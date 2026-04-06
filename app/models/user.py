from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    nom: str
    prenom: str | None = None
    role: str = "lecteur"
    phone: str | None = None


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    nom: str | None = None
    prenom: str | None = None
    role: str | None = None
    status: str | None = None
    phone: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    nom: str
    prenom: str | None = None
    role: str
    status: str
    phone: str | None = None
    last_login: datetime | None = None
    created_at: datetime | None = None


class UserInToken(BaseModel):
    user_id: str
    email: str
    role: str


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
