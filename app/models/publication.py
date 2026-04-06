from pydantic import BaseModel
from datetime import datetime, date


class PublicationCreate(BaseModel):
    titre: str
    titre_en: str | None = None
    type: str
    secteur_id: int | None = None
    periode_id: int | None = None
    resume: str | None = None
    resume_en: str | None = None
    date_publication: date | None = None


class PublicationUpdate(BaseModel):
    titre: str | None = None
    titre_en: str | None = None
    type: str | None = None
    secteur_id: int | None = None
    periode_id: int | None = None
    resume: str | None = None
    resume_en: str | None = None
    date_publication: date | None = None


class PublicationResponse(BaseModel):
    id: int
    titre: str
    titre_en: str | None = None
    type: str
    secteur_id: int | None = None
    periode_id: int | None = None
    resume: str | None = None
    resume_en: str | None = None
    fichier_url: str | None = None
    image_couverture: str | None = None
    est_publie: bool
    date_publication: date | None = None
    nombre_telechargements: int
    created_by: str | None = None
    created_at: datetime | None = None
