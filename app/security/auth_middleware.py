from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.database import get_db
from app.security.jwt_handler import decode_access_token
from app.security.roles import has_permission

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(token: str = Depends(oauth2_scheme), conn=Depends(get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Non authentifié")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide ou expiré")

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

    user = await conn.fetchrow("SELECT * FROM users WHERE id = $1 AND status = 'active'", user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur introuvable ou inactif")

    return dict(user)


async def get_optional_user(token: str = Depends(oauth2_scheme), conn=Depends(get_db)):
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id = payload.get("user_id")
    if not user_id:
        return None
    user = await conn.fetchrow("SELECT * FROM users WHERE id = $1 AND status = 'active'", user_id)
    return dict(user) if user else None


def require_role(required_role: str):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if not has_permission(current_user["role"], required_role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Rôle '{required_role}' ou supérieur requis",
            )
        return current_user
    return role_checker
