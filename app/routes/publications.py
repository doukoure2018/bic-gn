import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse

from app.config import settings
from app.database import get_db
from app.models.publication import PublicationCreate, PublicationUpdate, PublicationResponse
from app.security.auth_middleware import require_role, get_current_user

router = APIRouter(prefix="/publications", tags=["Publications"])


@router.get("", response_model=list[PublicationResponse])
async def list_publications(
    type: str | None = None,
    secteur_id: int | None = None,
    page: int = 1,
    per_page: int = 20,
    conn=Depends(get_db),
):
    query = "SELECT * FROM publications WHERE est_publie = true"
    params = []
    idx = 1

    if type:
        query += f" AND type = ${idx}"
        params.append(type)
        idx += 1
    if secteur_id:
        query += f" AND secteur_id = ${idx}"
        params.append(secteur_id)
        idx += 1

    query += f" ORDER BY date_publication DESC NULLS LAST LIMIT ${idx} OFFSET ${idx+1}"
    params.extend([per_page, (page - 1) * per_page])

    rows = await conn.fetch(query, *params)
    return [PublicationResponse(**dict(r)) for r in rows]


@router.get("/{publication_id}", response_model=PublicationResponse)
async def get_one(publication_id: int, conn=Depends(get_db)):
    row = await conn.fetchrow("SELECT * FROM publications WHERE id = $1", publication_id)
    if not row:
        raise HTTPException(status_code=404, detail="Publication introuvable")
    return PublicationResponse(**dict(row))


@router.post("", response_model=PublicationResponse, status_code=201)
async def create(data: PublicationCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    row = await conn.fetchrow(
        """INSERT INTO publications (titre, titre_en, type, secteur_id, periode_id, resume, resume_en, date_publication, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *""",
        data.titre, data.titre_en, data.type, data.secteur_id, data.periode_id,
        data.resume, data.resume_en, data.date_publication, current_user["id"]
    )
    return PublicationResponse(**dict(row))


@router.put("/{publication_id}", response_model=PublicationResponse)
async def update(publication_id: int, data: PublicationUpdate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    fields = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not fields:
        row = await conn.fetchrow("SELECT * FROM publications WHERE id = $1", publication_id)
        return PublicationResponse(**dict(row))

    set_clauses = []
    params = []
    for i, (key, val) in enumerate(fields.items(), 1):
        set_clauses.append(f"{key} = ${i}")
        params.append(val)

    params.append(publication_id)
    query = f"UPDATE publications SET {', '.join(set_clauses)} WHERE id = ${len(params)} RETURNING *"
    row = await conn.fetchrow(query, *params)
    return PublicationResponse(**dict(row))


@router.delete("/{publication_id}")
async def delete(publication_id: int, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    await conn.execute("DELETE FROM publications WHERE id = $1", publication_id)
    return {"message": "Publication supprimée"}


@router.post("/{publication_id}/publier")
async def publier(publication_id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    await conn.execute(
        "UPDATE publications SET est_publie = true, date_publication = CURRENT_DATE WHERE id = $1",
        publication_id
    )
    return {"message": "Publication publiée"}


@router.get("/{publication_id}/telecharger")
async def telecharger(publication_id: int, conn=Depends(get_db)):
    row = await conn.fetchrow("SELECT * FROM publications WHERE id = $1", publication_id)
    if not row or not row["fichier_url"]:
        raise HTTPException(status_code=404, detail="Fichier introuvable")

    await conn.execute(
        "UPDATE publications SET nombre_telechargements = nombre_telechargements + 1 WHERE id = $1",
        publication_id
    )

    filepath = os.path.join(settings.UPLOAD_DIR, row["fichier_url"])
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Fichier introuvable sur le serveur")

    return FileResponse(filepath, filename=os.path.basename(filepath))
