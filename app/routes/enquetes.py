import json

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models.enquete import EnqueteCreate, EnqueteUpdate, EnqueteResponse, ReponseEnqueteCreate
from app.security.auth_middleware import require_role, get_current_user
from app.services.enquete_service import create_enquete, lancer_enquete, soumettre_reponse, get_enquete_by_token

router = APIRouter(prefix="/enquetes", tags=["Enquêtes"])


@router.get("")
async def list_enquetes(conn=Depends(get_db), current_user=Depends(get_current_user)):
    rows = await conn.fetch("SELECT * FROM enquetes ORDER BY created_at DESC")
    return [dict(r) for r in rows]


@router.post("", status_code=201)
async def create(data: EnqueteCreate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    row = await create_enquete(conn, data.model_dump(), current_user["id"])
    return dict(row)


@router.get("/{enquete_id}")
async def get_one(enquete_id: int, conn=Depends(get_db), current_user=Depends(get_current_user)):
    row = await conn.fetchrow("SELECT * FROM enquetes WHERE id = $1", enquete_id)
    if not row:
        raise HTTPException(status_code=404, detail="Enquête introuvable")
    return dict(row)


@router.put("/{enquete_id}")
async def update(enquete_id: int, data: EnqueteUpdate, conn=Depends(get_db), current_user=Depends(require_role("editeur"))):
    fields = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not fields:
        row = await conn.fetchrow("SELECT * FROM enquetes WHERE id = $1", enquete_id)
        return dict(row)

    set_clauses = []
    params = []
    for i, (key, val) in enumerate(fields.items(), 1):
        if key == "questions":
            val = json.dumps(val)
        set_clauses.append(f"{key} = ${i}")
        params.append(val)

    params.append(enquete_id)
    query = f"UPDATE enquetes SET {', '.join(set_clauses)} WHERE id = ${len(params)} RETURNING *"
    row = await conn.fetchrow(query, *params)
    return dict(row)


@router.post("/{enquete_id}/lancer")
async def lancer(enquete_id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    tokens = await lancer_enquete(conn, enquete_id)
    return {"message": f"Enquête lancée auprès de {len(tokens)} entreprises", "tokens": tokens}


@router.post("/{enquete_id}/cloturer")
async def cloturer(enquete_id: int, conn=Depends(get_db), current_user=Depends(require_role("validateur"))):
    await conn.execute("UPDATE enquetes SET statut = 'cloturee' WHERE id = $1", enquete_id)
    return {"message": "Enquête clôturée"}


@router.get("/{enquete_id}/reponses")
async def list_reponses(enquete_id: int, conn=Depends(get_db), current_user=Depends(get_current_user)):
    rows = await conn.fetch(
        """SELECT re.*, e.raison_sociale as entreprise_nom
           FROM reponses_enquete re
           LEFT JOIN entreprises e ON e.id = re.entreprise_id
           WHERE re.enquete_id = $1
           ORDER BY re.date_soumission DESC NULLS LAST""",
        enquete_id
    )
    return [dict(r) for r in rows]


@router.get("/{enquete_id}/statistiques")
async def statistiques(enquete_id: int, conn=Depends(get_db), current_user=Depends(get_current_user)):
    stats = await conn.fetchrow(
        """SELECT
               COUNT(*) as total,
               COUNT(*) FILTER (WHERE statut = 'complete') as completes,
               COUNT(*) FILTER (WHERE statut = 'en_cours') as en_cours
           FROM reponses_enquete WHERE enquete_id = $1""",
        enquete_id
    )
    return dict(stats)


# --- Public endpoints ---

@router.get("/public/{token}")
async def get_public_enquete(token: str, conn=Depends(get_db)):
    row = await get_enquete_by_token(conn, token)
    return {
        "titre": row["titre"],
        "titre_en": row["titre_en"],
        "description": row["description"],
        "questions": row["questions"] if isinstance(row["questions"], list) else json.loads(row["questions"]),
    }


@router.post("/public/{token}")
async def submit_public(token: str, data: ReponseEnqueteCreate, conn=Depends(get_db)):
    await soumettre_reponse(conn, token, data.reponses)
    return {"message": "Réponse enregistrée avec succès"}
