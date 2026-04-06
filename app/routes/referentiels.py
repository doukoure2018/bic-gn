from fastapi import APIRouter, Depends

from app.database import get_db
from app.models.indicateur import SecteurResponse, CategorieResponse, RegionResponse, PeriodeResponse
from app.models.actualite import PartenaireResponse

router = APIRouter(prefix="/ref", tags=["Référentiels"])


@router.get("/secteurs", response_model=list[SecteurResponse])
async def list_secteurs(conn=Depends(get_db)):
    rows = await conn.fetch("SELECT * FROM secteurs ORDER BY id")
    return [SecteurResponse(**dict(r)) for r in rows]


@router.get("/categories", response_model=list[CategorieResponse])
async def list_categories(secteur_id: int | None = None, conn=Depends(get_db)):
    if secteur_id:
        rows = await conn.fetch("SELECT * FROM categories WHERE secteur_id = $1 ORDER BY ordre", secteur_id)
    else:
        rows = await conn.fetch("SELECT * FROM categories ORDER BY secteur_id, ordre")
    return [CategorieResponse(**dict(r)) for r in rows]


@router.get("/regions", response_model=list[RegionResponse])
async def list_regions(conn=Depends(get_db)):
    rows = await conn.fetch("SELECT * FROM regions ORDER BY id")
    return [RegionResponse(**dict(r)) for r in rows]


@router.get("/periodes", response_model=list[PeriodeResponse])
async def list_periodes(conn=Depends(get_db)):
    rows = await conn.fetch("SELECT * FROM periodes ORDER BY annee DESC, trimestre DESC")
    return [PeriodeResponse(**dict(r)) for r in rows]


@router.get("/partenaires", response_model=list[PartenaireResponse])
async def list_partenaires(conn=Depends(get_db)):
    rows = await conn.fetch("SELECT * FROM partenaires WHERE est_actif = true ORDER BY ordre")
    return [PartenaireResponse(**dict(r)) for r in rows]
