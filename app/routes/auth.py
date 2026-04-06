from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import UserLogin, UserResponse, Token, PasswordChange
from app.security.jwt_handler import create_access_token
from app.security.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentification"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, conn=Depends(get_db)):
    user = await conn.fetchrow(
        "SELECT * FROM users WHERE email = $1 AND status = 'active'",
        credentials.email
    )
    if not user or not pwd_context.verify(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou mot de passe incorrect")

    await conn.execute(
        "UPDATE users SET last_login = $1 WHERE id = $2",
        datetime.utcnow(), user["id"]
    )

    token = create_access_token({"user_id": user["id"], "email": user["email"], "role": user["role"]})

    return Token(
        access_token=token,
        user=UserResponse(**dict(user))
    )


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {"message": "Déconnexion réussie"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)


@router.put("/password")
async def change_password(data: PasswordChange, current_user: dict = Depends(get_current_user), conn=Depends(get_db)):
    if not pwd_context.verify(data.old_password, current_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")

    new_hash = pwd_context.hash(data.new_password)
    await conn.execute("UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
                       new_hash, current_user["id"])
    return {"message": "Mot de passe modifié avec succès"}
