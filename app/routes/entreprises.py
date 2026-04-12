from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import date

from app.database import get_db
from app.security.auth_middleware import require_role, get_current_user

router = APIRouter(prefix="/entreprises", tags=["Entreprises industrielles"])


class EntrepriseCreate(BaseModel):
    secteur_code: str
    nom_entreprise: str
    region: str
    prod_installee: str | None = None
    prod_realisee: str | None = None
    unite_production: str | None = None
    emplois: int = 0
    pct_emploi_femmes: float = 0
    nbre_emploi_femmes: int = 0
    ide_recus: float = 0
    contraintes: str | None = None
    date_maj: date | None = None


# --- Public endpoints ---

@router.get("/public")
async def list_public(secteur_code: str | None = None, conn=Depends(get_db)):
    """Get published enterprise data (public)."""
    query = "SELECT * FROM entreprises_industrielles WHERE statut = 'publie'"
    params = []
    if secteur_code:
        query += " AND secteur_code = $1"
        params.append(secteur_code)
    query += " ORDER BY secteur_code, nom_entreprise"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


@router.get("/public/agregation")
async def agregation_public(secteur_code: str | None = None, conn=Depends(get_db)):
    """Get aggregated data by sector (public)."""
    query = """
        SELECT secteur_code,
               COUNT(*) as nb_entreprises,
               SUM(emplois) as total_emplois,
               SUM(nbre_emploi_femmes) as total_emploi_femmes,
               SUM(ide_recus) as total_ide,
               SUM(CAST(REPLACE(REPLACE(prod_realisee, ' ', ''), ',', '') AS BIGINT)) as total_production,
               MIN(unite_production) as unite_production
        FROM entreprises_industrielles
        WHERE statut = 'publie'
    """
    params = []
    if secteur_code:
        query += " AND secteur_code = $1"
        params.append(secteur_code)
    query += " GROUP BY secteur_code ORDER BY secteur_code"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


@router.get("/public/consolidation")
async def consolidation_public(conn=Depends(get_db)):
    """Get full consolidation view (public)."""
    rows = await conn.fetch("""
        SELECT secteur_code, nom_entreprise, region, prod_realisee, unite_production,
               emplois, ide_recus, contraintes
        FROM entreprises_industrielles
        WHERE statut = 'publie'
        ORDER BY secteur_code, nom_entreprise
    """)
    return [dict(r) for r in rows]


# --- Admin endpoints ---

@router.get("")
async def list_all(secteur_code: str | None = None, conn=Depends(get_db), current_user=Depends(get_current_user)):
    """List all enterprises (admin)."""
    query = "SELECT * FROM entreprises_industrielles WHERE 1=1"
    params = []
    idx = 1
    if secteur_code:
        query += f" AND secteur_code = ${idx}"
        params.append(secteur_code)
        idx += 1
    query += " ORDER BY secteur_code, nom_entreprise"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


@router.post("", status_code=201)
async def create(data: EntrepriseCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    """Create enterprise (editor)."""
    row = await conn.fetchrow("""
        INSERT INTO entreprises_industrielles
            (secteur_code, nom_entreprise, region, prod_installee, prod_realisee, unite_production,
             emplois, pct_emploi_femmes, nbre_emploi_femmes, ide_recus, contraintes, date_maj, saisi_par)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *
    """, data.secteur_code, data.nom_entreprise, data.region,
        data.prod_installee, data.prod_realisee, data.unite_production,
        data.emplois, data.pct_emploi_femmes, data.nbre_emploi_femmes,
        data.ide_recus, data.contraintes, data.date_maj, current_user["id"])
    return dict(row)


@router.put("/{id}")
async def update(id: int, data: EntrepriseCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    """Update enterprise (editor)."""
    row = await conn.fetchrow("""
        UPDATE entreprises_industrielles SET
            secteur_code=$1, nom_entreprise=$2, region=$3, prod_installee=$4, prod_realisee=$5,
            unite_production=$6, emplois=$7, pct_emploi_femmes=$8, nbre_emploi_femmes=$9,
            ide_recus=$10, contraintes=$11, date_maj=$12, updated_at=CURRENT_TIMESTAMP
        WHERE id=$13 RETURNING *
    """, data.secteur_code, data.nom_entreprise, data.region,
        data.prod_installee, data.prod_realisee, data.unite_production,
        data.emplois, data.pct_emploi_femmes, data.nbre_emploi_femmes,
        data.ide_recus, data.contraintes, data.date_maj, id)
    if not row:
        raise HTTPException(status_code=404, detail="Entreprise introuvable")
    return dict(row)


@router.delete("/{id}")
async def delete(id: int, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    """Delete enterprise."""
    await conn.execute("DELETE FROM entreprises_industrielles WHERE id = $1", id)
    return {"message": "Supprimé"}


@router.post("/{id}/valider")
async def valider(id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    """Validate enterprise data (admin)."""
    row = await conn.fetchrow("""
        UPDATE entreprises_industrielles SET statut = 'valide', valide_par = $1, date_validation = CURRENT_TIMESTAMP
        WHERE id = $2 RETURNING *
    """, current_user["id"], id)
    if not row:
        raise HTTPException(status_code=404, detail="Entreprise introuvable")
    return dict(row)


@router.post("/{id}/publier")
async def publier(id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    """Publish enterprise data."""
    row = await conn.fetchrow("""
        UPDATE entreprises_industrielles SET statut = 'publie' WHERE id = $1 RETURNING *
    """, id)
    return dict(row)


@router.post("/valider-secteur/{secteur_code}")
async def valider_secteur(secteur_code: str, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    """Validate all enterprises in a sector."""
    await conn.execute("""
        UPDATE entreprises_industrielles SET statut = 'publie', valide_par = $1, date_validation = CURRENT_TIMESTAMP
        WHERE secteur_code = $2 AND statut IN ('brouillon', 'valide')
    """, current_user["id"], secteur_code)
    return {"message": f"Secteur {secteur_code} publié"}
