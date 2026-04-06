import logging
from datetime import datetime

import httpx

logger = logging.getLogger(__name__)


async def sync_opendatafrica(conn) -> dict:
    """Sync data from Guinea Open Data for Africa portal (SDMX/JSON)."""
    source = await conn.fetchrow(
        "SELECT id FROM sources_externes WHERE code = 'OPENDATAAF'"
    )
    if not source:
        return {"error": "Source OPENDATAAF not configured"}

    # The portal uses Knoema API format
    # Example datasets available: IMF WEO, World Bank WDI
    indicators = {
        "NGDP_RPCH": ("Croissance PIB réel", "%"),
        "PCPIPCH": ("Inflation moyenne", "%"),
        "BCA_NGDPD": ("Balance courante (% PIB)", "%"),
        "GGXWDG_NGDP": ("Dette brute (% PIB)", "%"),
    }

    total = 0
    errors = []

    for code, (nom, unite) in indicators.items():
        try:
            url = f"https://guinea.opendataforafrica.org/api/1.0/data/IMF_WEO?frequency=A&country=GIN&indicator={code}&format=json"
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.get(url)
                if resp.status_code != 200:
                    errors.append({"code": code, "error": f"HTTP {resp.status_code}"})
                    continue

                data = resp.json()
                if not data or "data" not in data:
                    continue

                for entry in data.get("data", []):
                    year = entry.get("Time")
                    value = entry.get("Value")
                    if year and value:
                        await conn.execute("""
                            INSERT INTO donnees_externes
                                (source_id, indicateur_code, indicateur_nom, pays, annee, valeur, unite, updated_at)
                            VALUES ($1, $2, $3, 'GIN', $4, $5, $6, $7)
                            ON CONFLICT (source_id, indicateur_code, annee, trimestre)
                            DO UPDATE SET valeur = $5, updated_at = $7
                        """, source["id"], code, nom, int(year), float(value), unite, datetime.utcnow())
                        total += 1

        except Exception as e:
            logger.error(f"OpenDataAfrica sync error for {code}: {e}")
            errors.append({"code": code, "error": str(e)})

    if total > 0:
        await conn.execute(
            "UPDATE sources_externes SET derniere_sync = $1 WHERE code = 'OPENDATAAF'",
            datetime.utcnow()
        )

    return {"source": "Open Data Africa", "total_synced": total, "errors": errors}


async def get_all_sources_status(conn) -> list[dict]:
    """Get status of all external data sources."""
    rows = await conn.fetch("""
        SELECT se.id, se.code, se.nom, se.type, se.url_base, se.est_actif, se.derniere_sync,
               COUNT(de.id) as nb_donnees,
               MAX(de.updated_at) as derniere_maj
        FROM sources_externes se
        LEFT JOIN donnees_externes de ON de.source_id = se.id
        GROUP BY se.id
        ORDER BY se.id
    """)
    return [dict(r) for r in rows]


async def get_external_data(conn, source_code: str = None, indicator: str = None, year: int = None) -> list[dict]:
    """Get external data with filters."""
    query = """
        SELECT de.*, se.code as source_code, se.nom as source_nom
        FROM donnees_externes de
        JOIN sources_externes se ON se.id = de.source_id
        WHERE 1=1
    """
    params = []
    idx = 1

    if source_code:
        query += f" AND se.code = ${idx}"
        params.append(source_code)
        idx += 1

    if indicator:
        query += f" AND de.indicateur_code = ${idx}"
        params.append(indicator)
        idx += 1

    if year:
        query += f" AND de.annee = ${idx}"
        params.append(year)
        idx += 1

    query += " ORDER BY de.annee DESC, de.trimestre DESC NULLS LAST"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


async def get_contraintes(conn, secteur_id: int = None, periode_id: int = None) -> list[dict]:
    """Get enterprise constraints data."""
    query = """
        SELECT c.code, c.nom, c.nom_en, cv.score, cv.nombre_repondants,
               s.nom as secteur, r.nom as region, p.annee, p.trimestre
        FROM contraintes_valeurs cv
        JOIN contraintes c ON c.id = cv.contrainte_id
        LEFT JOIN secteurs s ON s.id = cv.secteur_id
        LEFT JOIN regions r ON r.id = cv.region_id
        LEFT JOIN periodes p ON p.id = cv.periode_id
        WHERE 1=1
    """
    params = []
    idx = 1

    if secteur_id:
        query += f" AND cv.secteur_id = ${idx}"
        params.append(secteur_id)
        idx += 1

    if periode_id:
        query += f" AND cv.periode_id = ${idx}"
        params.append(periode_id)
        idx += 1

    query += " ORDER BY c.ordre"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


async def get_perspectives(conn, secteur_id: int = None, periode_id: int = None) -> list[dict]:
    """Get economic perspectives data."""
    query = """
        SELECT p2.optimiste, p2.stable, p2.pessimiste, p2.nombre_repondants,
               s.nom as secteur, s.code as secteur_code, r.nom as region, p.annee, p.trimestre
        FROM perspectives p2
        LEFT JOIN secteurs s ON s.id = p2.secteur_id
        LEFT JOIN regions r ON r.id = p2.region_id
        LEFT JOIN periodes p ON p.id = p2.periode_id
        WHERE 1=1
    """
    params = []
    idx = 1

    if secteur_id:
        query += f" AND p2.secteur_id = ${idx}"
        params.append(secteur_id)
        idx += 1

    if periode_id:
        query += f" AND p2.periode_id = ${idx}"
        params.append(periode_id)
        idx += 1

    query += " ORDER BY p.annee DESC, p.trimestre DESC"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]
