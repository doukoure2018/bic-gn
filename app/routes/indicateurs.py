from fastapi import APIRouter, Depends, Query

from app.database import get_db
from app.models.indicateur import (
    IndicateurCreate, IndicateurUpdate, IndicateurResponse,
    ValeurCreate, ValeurUpdate, ValeurResponse,
)
from app.security.auth_middleware import require_role
from app.services.indicateur_service import (
    get_indicateurs, get_indicateur, create_indicateur, update_indicateur, delete_indicateur,
    create_valeur, valider_valeur, get_serie_temporelle,
)

router = APIRouter(prefix="/indicateurs", tags=["Indicateurs"])


@router.get("", response_model=list[IndicateurResponse])
async def list_indicateurs(
    secteur: str | None = None,
    categorie_id: int | None = None,
    conn=Depends(get_db),
):
    rows = await get_indicateurs(conn, secteur_code=secteur, categorie_id=categorie_id)
    return [IndicateurResponse(**dict(r)) for r in rows]


@router.get("/{indicateur_id}", response_model=IndicateurResponse)
async def get_one(indicateur_id: int, conn=Depends(get_db)):
    row = await get_indicateur(conn, indicateur_id)
    return IndicateurResponse(**dict(row))


@router.post("", response_model=IndicateurResponse, status_code=201)
async def create(data: IndicateurCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    row = await create_indicateur(conn, data.model_dump())
    return IndicateurResponse(**dict(row))


@router.put("/{indicateur_id}", response_model=IndicateurResponse)
async def update(indicateur_id: int, data: IndicateurUpdate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    row = await update_indicateur(conn, indicateur_id, data.model_dump(exclude_unset=True))
    return IndicateurResponse(**dict(row))


@router.delete("/{indicateur_id}")
async def delete(indicateur_id: int, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    await delete_indicateur(conn, indicateur_id)
    return {"message": "Indicateur supprimé"}


@router.get("/secteur/{code}", response_model=list[IndicateurResponse])
async def by_secteur(code: str, conn=Depends(get_db)):
    rows = await get_indicateurs(conn, secteur_code=code)
    return [IndicateurResponse(**dict(r)) for r in rows]


@router.get("/categorie/{categorie_id}", response_model=list[IndicateurResponse])
async def by_categorie(categorie_id: int, conn=Depends(get_db)):
    rows = await get_indicateurs(conn, categorie_id=categorie_id)
    return [IndicateurResponse(**dict(r)) for r in rows]


# --- Valeurs ---

valeurs_router = APIRouter(prefix="/valeurs", tags=["Valeurs"])


@valeurs_router.get("")
async def list_valeurs(
    indicateur_id: int | None = None,
    periode_id: int | None = None,
    region_id: int | None = None,
    statut: str | None = None,
    page: int = 1,
    per_page: int = 50,
    conn=Depends(get_db),
):
    query = """
        SELECT v.*, i.nom as indicateur_nom, i.code as indicateur_code, i.unite,
               p.annee, p.trimestre, r.nom as region_nom
        FROM valeurs v
        JOIN indicateurs i ON i.id = v.indicateur_id
        JOIN periodes p ON p.id = v.periode_id
        LEFT JOIN regions r ON r.id = v.region_id
        WHERE 1=1
    """
    params = []
    idx = 1

    if indicateur_id:
        query += f" AND v.indicateur_id = ${idx}"
        params.append(indicateur_id)
        idx += 1
    if periode_id:
        query += f" AND v.periode_id = ${idx}"
        params.append(periode_id)
        idx += 1
    if region_id:
        query += f" AND v.region_id = ${idx}"
        params.append(region_id)
        idx += 1
    if statut:
        query += f" AND v.statut = ${idx}"
        params.append(statut)
        idx += 1

    query += f" ORDER BY p.annee DESC, p.trimestre DESC LIMIT ${idx} OFFSET ${idx+1}"
    params.extend([per_page, (page - 1) * per_page])

    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


@valeurs_router.post("", status_code=201)
async def create_val(data: ValeurCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    row = await create_valeur(conn, data.model_dump(), current_user["id"])
    return dict(row)


@valeurs_router.put("/{valeur_id}")
async def update_val(valeur_id: int, data: ValeurUpdate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    fields = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not fields:
        row = await conn.fetchrow("SELECT * FROM valeurs WHERE id = $1", valeur_id)
        return dict(row)

    set_clauses = []
    params = []
    for i, (key, val) in enumerate(fields.items(), 1):
        set_clauses.append(f"{key} = ${i}")
        params.append(val)

    params.append(valeur_id)
    query = f"UPDATE valeurs SET {', '.join(set_clauses)} WHERE id = ${len(params)} RETURNING *"
    row = await conn.fetchrow(query, *params)
    return dict(row)


@valeurs_router.post("/{valeur_id}/valider")
async def validate_val(valeur_id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    row = await valider_valeur(conn, valeur_id, current_user["id"])
    return dict(row)


@valeurs_router.get("/indicateur/{indicateur_id}/series")
async def series(indicateur_id: int, region_id: int | None = None, conn=Depends(get_db)):
    rows = await get_serie_temporelle(conn, indicateur_id, region_id)
    return [dict(r) for r in rows]


@valeurs_router.get("/periode/{periode_id}")
async def by_periode(periode_id: int, conn=Depends(get_db)):
    rows = await conn.fetch(
        """SELECT v.*, i.nom as indicateur_nom, i.code as indicateur_code, i.unite
           FROM valeurs v JOIN indicateurs i ON i.id = v.indicateur_id
           WHERE v.periode_id = $1 ORDER BY i.ordre""",
        periode_id
    )
    return [dict(r) for r in rows]
