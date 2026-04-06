from pydantic import BaseModel
from datetime import datetime


class ActualiteCreate(BaseModel):
    titre: str
    titre_en: str | None = None
    categorie: str | None = None
    contenu: str
    contenu_en: str | None = None
    extrait: str | None = None
    extrait_en: str | None = None
    image_url: str | None = None
    est_vedette: bool = False
    tags: list[str] | None = None


class ActualiteUpdate(BaseModel):
    titre: str | None = None
    titre_en: str | None = None
    categorie: str | None = None
    contenu: str | None = None
    contenu_en: str | None = None
    extrait: str | None = None
    extrait_en: str | None = None
    image_url: str | None = None
    est_vedette: bool | None = None
    tags: list[str] | None = None


class ActualiteResponse(BaseModel):
    id: int
    titre: str
    titre_en: str | None = None
    slug: str
    categorie: str | None = None
    contenu: str | None = None
    contenu_en: str | None = None
    extrait: str | None = None
    image_url: str | None = None
    est_publie: bool
    est_vedette: bool
    date_publication: datetime | None = None
    auteur: str | None = None
    tags: list | None = None
    vues: int
    created_at: datetime | None = None


class PartenaireResponse(BaseModel):
    id: int
    nom: str
    nom_en: str | None = None
    type: str | None = None
    description: str | None = None
    logo_url: str | None = None
    site_web: str | None = None
    ordre: int


class ContactCreate(BaseModel):
    nom: str
    email: str
    telephone: str | None = None
    organisation: str | None = None
    sujet: str | None = None
    message: str


class ContactResponse(BaseModel):
    id: int
    nom: str
    email: str
    telephone: str | None = None
    organisation: str | None = None
    sujet: str | None = None
    message: str
    statut: str
    reponse: str | None = None
    date_reponse: datetime | None = None
    created_at: datetime | None = None
