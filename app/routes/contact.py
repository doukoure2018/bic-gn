from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models.actualite import ContactCreate, ContactResponse
from app.security.auth_middleware import require_role, get_current_user

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("", status_code=201)
async def send_message(data: ContactCreate, conn=Depends(get_db)):
    row = await conn.fetchrow(
        """INSERT INTO contacts (nom, email, telephone, organisation, sujet, message)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING *""",
        data.nom, data.email, data.telephone, data.organisation, data.sujet, data.message
    )
    return {"message": "Message envoyé avec succès", "id": row["id"]}


@router.get("/messages", response_model=list[ContactResponse])
async def list_messages(
    statut: str | None = None,
    page: int = 1,
    per_page: int = 20,
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = "SELECT * FROM contacts WHERE 1=1"
    params = []
    idx = 1

    if statut:
        query += f" AND statut = ${idx}"
        params.append(statut)
        idx += 1

    query += f" ORDER BY created_at DESC LIMIT ${idx} OFFSET ${idx+1}"
    params.extend([per_page, (page - 1) * per_page])

    rows = await conn.fetch(query, *params)
    return [ContactResponse(**dict(r)) for r in rows]


@router.put("/messages/{message_id}")
async def traiter_message(
    message_id: int,
    statut: str | None = None,
    reponse: str | None = None,
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    row = await conn.fetchrow("SELECT * FROM contacts WHERE id = $1", message_id)
    if not row:
        raise HTTPException(status_code=404, detail="Message introuvable")

    if reponse:
        await conn.execute(
            """UPDATE contacts SET statut = 'traite', reponse = $1, repondu_par = $2, date_reponse = CURRENT_TIMESTAMP
               WHERE id = $3""",
            reponse, current_user["id"], message_id
        )
    elif statut:
        await conn.execute("UPDATE contacts SET statut = $1 WHERE id = $2", statut, message_id)

    updated = await conn.fetchrow("SELECT * FROM contacts WHERE id = $1", message_id)
    return ContactResponse(**dict(updated))
