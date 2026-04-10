from fastapi import APIRouter, Depends, Query

from app.database import get_db
from app.security.auth_middleware import require_role, get_current_user
from app.services.worldbank_service import sync_all_worldbank, get_wb_indicator_data, get_all_latest_wb, WB_INDICATORS
from app.services.sync_service import (
    sync_opendatafrica, get_all_sources_status, get_external_data,
    get_contraintes, get_perspectives,
)
from app.services.simprix_service import sync_simprix, get_simprix_prix, get_simprix_regions, get_prix_evolution

router = APIRouter(prefix="/sources", tags=["Sources externes"])


# --- Public endpoints ---

@router.get("/status")
async def sources_status(conn=Depends(get_db)):
    """Get status of all external data sources."""
    return await get_all_sources_status(conn)


@router.get("/donnees")
async def list_external_data(
    source: str | None = None,
    indicateur: str | None = None,
    annee: int | None = None,
    conn=Depends(get_db),
):
    """Get external data with optional filters."""
    return await get_external_data(conn, source_code=source, indicator=indicateur, year=annee)


@router.get("/worldbank")
async def worldbank_latest(conn=Depends(get_db)):
    """Get latest World Bank data for all indicators."""
    return await get_all_latest_wb(conn)


@router.get("/worldbank/{indicator_code}")
async def worldbank_indicator(indicator_code: str, limit: int = 20, conn=Depends(get_db)):
    """Get historical data for a specific World Bank indicator."""
    return await get_wb_indicator_data(conn, indicator_code, limit)


@router.get("/worldbank-indicators")
async def worldbank_indicator_list():
    """List all mapped World Bank indicators."""
    return [
        {"code": code, "nom": nom_fr, "nom_en": nom_en, "unite": unite}
        for code, (nom_fr, nom_en, unite) in WB_INDICATORS.items()
    ]


@router.get("/contraintes")
async def api_contraintes(
    secteur_id: int | None = None,
    periode_id: int | None = None,
    conn=Depends(get_db),
):
    """Get enterprise constraints data."""
    return await get_contraintes(conn, secteur_id=secteur_id, periode_id=periode_id)


@router.get("/perspectives")
async def api_perspectives(
    secteur_id: int | None = None,
    periode_id: int | None = None,
    conn=Depends(get_db),
):
    """Get economic perspectives data."""
    return await get_perspectives(conn, secteur_id=secteur_id, periode_id=periode_id)


@router.get("/sous-secteurs")
async def list_sous_secteurs(secteur_id: int | None = None, conn=Depends(get_db)):
    """List industry sub-sectors."""
    if secteur_id:
        rows = await conn.fetch(
            "SELECT * FROM sous_secteurs WHERE secteur_id = $1 AND est_actif = true ORDER BY ordre",
            secteur_id
        )
    else:
        rows = await conn.fetch("SELECT * FROM sous_secteurs WHERE est_actif = true ORDER BY secteur_id, ordre")
    return [dict(r) for r in rows]


# --- Prix (SIMPRIX) ---

@router.get("/prix")
async def list_prix(
    region: str | None = None,
    conn=Depends(get_db),
):
    """Get SIMPRIX prices, filterable by region code."""
    return await get_simprix_prix(conn, region_code=region)


@router.get("/prix/regions")
async def prix_regions(conn=Depends(get_db)):
    """Get list of regions with price data."""
    return await get_simprix_regions(conn)


@router.get("/prix/{code_produit}/evolution")
async def prix_evolution(code_produit: str, conn=Depends(get_db)):
    """Get price evolution for a product."""
    return await get_prix_evolution(conn, code_produit)


# --- Commodités (Trading Economics) ---

@router.get("/commodites")
async def list_commodites(categorie: str | None = None, conn=Depends(get_db)):
    """Get commodity prices, filterable by category (energie, metaux, agriculture)."""
    query = "SELECT * FROM commodites WHERE prix IS NOT NULL"
    params = []
    if categorie:
        query += " AND categorie = $1"
        params.append(categorie)
    query += " ORDER BY categorie, ordre"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


@router.post("/commodites-import")
async def import_commodites(
    data: list[dict],
    conn=Depends(get_db),
    current_user=Depends(require_role("editeur")),
):
    """Import commodity prices from external scraper."""
    from datetime import datetime
    count = 0
    for item in data:
        code = item.get("code")
        prix = item.get("prix")
        variation = item.get("variation")
        if code and prix:
            await conn.execute("""
                UPDATE commodites SET prix = $1, variation = $2, date_releve = $3 WHERE code = $4
            """, float(prix), float(variation) if variation else None, datetime.utcnow(), code)
            count += 1
    return {"imported": count}


@router.post("/simprix-import")
async def import_simprix_prices(
    data: dict,
    conn=Depends(get_db),
    current_user=Depends(require_role("editeur")),
):
    """Import SIMPRIX prices from external scraper script."""
    from datetime import date
    region_code = data.get("region_code")
    region_nom = data.get("region_nom")
    prices = data.get("prices", {})

    count = 0
    today = date.today()
    for product_code, prix in prices.items():
        produit = await conn.fetchrow("SELECT id FROM simprix_produits WHERE code = $1", product_code)
        if produit:
            await conn.execute("""
                INSERT INTO simprix_prix (produit_id, region_code, region_nom, prix_plafond, date_releve)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (produit_id, region_code, date_releve)
                DO UPDATE SET prix_plafond = $4
            """, produit["id"], region_code, region_nom, float(prix), today)
            count += 1

    return {"region": region_nom, "imported": count}


# --- Admin sync endpoints ---

@router.post("/sync/simprix")
async def trigger_simprix_sync(conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    """Trigger SIMPRIX price scraping."""
    return await sync_simprix(conn)


@router.post("/sync/worldbank")
async def trigger_worldbank_sync(conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    """Trigger World Bank data synchronization."""
    result = await sync_all_worldbank(conn)
    return result


@router.post("/sync/opendatafrica")
async def trigger_oda_sync(conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    """Trigger Open Data Africa synchronization."""
    result = await sync_opendatafrica(conn)
    return result


@router.post("/sync/all")
async def trigger_full_sync(conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    """Trigger sync from all automatic sources."""
    wb = await sync_all_worldbank(conn)
    oda = await sync_opendatafrica(conn)
    spx = await sync_simprix(conn)
    return {
        "worldbank": wb,
        "opendatafrica": oda,
        "simprix": spx,
        "message": "Synchronisation terminée",
    }
