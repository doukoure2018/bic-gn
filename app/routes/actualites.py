from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models.actualite import ActualiteCreate, ActualiteUpdate, ActualiteResponse
from app.security.auth_middleware import require_role
from app.utils.helpers import slugify

router = APIRouter(prefix="/actualites", tags=["Actualités"])


@router.get("", response_model=list[ActualiteResponse])
async def list_actualites(
    categorie: str | None = None,
    vedette: bool | None = None,
    page: int = 1,
    per_page: int = 20,
    conn=Depends(get_db),
):
    query = "SELECT * FROM actualites WHERE est_publie = true"
    params = []
    idx = 1

    if categorie:
        query += f" AND categorie = ${idx}"
        params.append(categorie)
        idx += 1
    if vedette is not None:
        query += f" AND est_vedette = ${idx}"
        params.append(vedette)
        idx += 1

    query += f" ORDER BY date_publication DESC NULLS LAST LIMIT ${idx} OFFSET ${idx+1}"
    params.extend([per_page, (page - 1) * per_page])

    rows = await conn.fetch(query, *params)
    return [ActualiteResponse(**dict(r)) for r in rows]


@router.get("/{slug}", response_model=ActualiteResponse)
async def get_by_slug(slug: str, conn=Depends(get_db)):
    row = await conn.fetchrow("SELECT * FROM actualites WHERE slug = $1", slug)
    if not row:
        raise HTTPException(status_code=404, detail="Actualité introuvable")

    await conn.execute("UPDATE actualites SET vues = vues + 1 WHERE id = $1", row["id"])
    return ActualiteResponse(**dict(row))


@router.post("", response_model=ActualiteResponse, status_code=201)
async def create(data: ActualiteCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    slug = slugify(data.titre)

    existing = await conn.fetchrow("SELECT id FROM actualites WHERE slug = $1", slug)
    if existing:
        slug = f"{slug}-{existing['id'] + 1}"

    tags_list = data.tags if data.tags else None
    import json
    tags_json = json.dumps(tags_list) if tags_list else None

    row = await conn.fetchrow(
        """INSERT INTO actualites (titre, titre_en, slug, categorie, contenu, contenu_en, extrait, extrait_en, image_url, est_vedette, tags, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *""",
        data.titre, data.titre_en, slug, data.categorie, data.contenu, data.contenu_en,
        data.extrait, data.extrait_en, data.image_url, data.est_vedette, tags_json, current_user["id"]
    )
    return ActualiteResponse(**dict(row))


@router.put("/{actualite_id}", response_model=ActualiteResponse)
async def update(actualite_id: int, data: ActualiteUpdate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    dump = data.model_dump(exclude_unset=True)
    fields = {k: v for k, v in dump.items() if v is not None}

    if "tags" in fields:
        import json
        fields["tags"] = json.dumps(fields["tags"])

    if not fields:
        row = await conn.fetchrow("SELECT * FROM actualites WHERE id = $1", actualite_id)
        return ActualiteResponse(**dict(row))

    set_clauses = []
    params = []
    for i, (key, val) in enumerate(fields.items(), 1):
        set_clauses.append(f"{key} = ${i}")
        params.append(val)

    params.append(actualite_id)
    query = f"UPDATE actualites SET {', '.join(set_clauses)} WHERE id = ${len(params)} RETURNING *"
    row = await conn.fetchrow(query, *params)
    return ActualiteResponse(**dict(row))


@router.delete("/{actualite_id}")
async def delete(actualite_id: int, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    await conn.execute("DELETE FROM actualites WHERE id = $1", actualite_id)
    return {"message": "Actualité supprimée"}


@router.post("/{actualite_id}/publier")
async def publier(actualite_id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    await conn.execute(
        "UPDATE actualites SET est_publie = true, date_publication = CURRENT_TIMESTAMP WHERE id = $1",
        actualite_id
    )
    return {"message": "Actualité publiée"}
