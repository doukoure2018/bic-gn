from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import UserCreate, UserUpdate, UserResponse
from app.security.auth_middleware import require_role
from app.utils.helpers import generate_id

router = APIRouter(prefix="/admin", tags=["Administration"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/users", response_model=list[UserResponse])
async def list_users(conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    rows = await conn.fetch("SELECT * FROM users ORDER BY created_at DESC")
    return [UserResponse(**dict(r)) for r in rows]


@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(data: UserCreate, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", data.email)
    if existing:
        raise HTTPException(status_code=409, detail="Cet email est déjà utilisé")

    user_id = generate_id("user")
    password_hash = pwd_context.hash(data.password)

    row = await conn.fetchrow(
        """INSERT INTO users (id, email, password_hash, nom, prenom, role, phone)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *""",
        user_id, data.email, password_hash, data.nom, data.prenom, data.role, data.phone
    )
    return UserResponse(**dict(row))


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    row = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
    if not row:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return UserResponse(**dict(row))


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, data: UserUpdate, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    row = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
    if not row:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    fields = {k: v for k, v in data.model_dump().items() if v is not None}
    if not fields:
        return UserResponse(**dict(row))

    set_clauses = []
    params = []
    for i, (key, val) in enumerate(fields.items(), 1):
        set_clauses.append(f"{key} = ${i}")
        params.append(val)

    params.append(user_id)
    query = f"UPDATE users SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = ${len(params)} RETURNING *"
    updated = await conn.fetchrow(query, *params)
    return UserResponse(**dict(updated))


@router.delete("/users/{user_id}")
async def deactivate_user(user_id: str, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Impossible de désactiver votre propre compte")
    await conn.execute("UPDATE users SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = $1", user_id)
    return {"message": "Utilisateur désactivé"}


@router.get("/logs")
async def get_logs(page: int = 1, per_page: int = 50, conn=Depends(get_db), current_user=Depends(require_role("super_admin"))):
    offset = (page - 1) * per_page
    rows = await conn.fetch(
        "SELECT * FROM logs_activite ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        per_page, offset
    )
    total = await conn.fetchval("SELECT COUNT(*) FROM logs_activite")
    return {"data": [dict(r) for r in rows], "total": total, "page": page, "per_page": per_page}


@router.get("/stats")
async def get_stats(conn=Depends(get_db), current_user=Depends(require_role("lecteur"))):
    users_count = await conn.fetchval("SELECT COUNT(*) FROM users WHERE status = 'active'")
    indicateurs_count = await conn.fetchval("SELECT COUNT(*) FROM indicateurs WHERE est_actif = true")
    valeurs_count = await conn.fetchval("SELECT COUNT(*) FROM valeurs")
    enquetes_count = await conn.fetchval("SELECT COUNT(*) FROM enquetes")
    publications_count = await conn.fetchval("SELECT COUNT(*) FROM publications")
    actualites_count = await conn.fetchval("SELECT COUNT(*) FROM actualites")

    return {
        "utilisateurs": users_count,
        "indicateurs": indicateurs_count,
        "valeurs": valeurs_count,
        "enquetes": enquetes_count,
        "publications": publications_count,
        "actualites": actualites_count,
    }
