from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal


class EntrepriseCreate(BaseModel):
    raison_sociale: str
    secteur_id: int | None = None
    sous_secteur: str | None = None
    region_id: int | None = None
    adresse: str | None = None
    telephone: str | None = None
    email: str | None = None
    contact_nom: str | None = None
    contact_fonction: str | None = None
    taille: str | None = None
    effectif: int | None = None
    chiffre_affaires: Decimal | None = None


class EntrepriseResponse(BaseModel):
    id: int
    raison_sociale: str
    secteur_id: int | None = None
    sous_secteur: str | None = None
    region_id: int | None = None
    adresse: str | None = None
    telephone: str | None = None
    email: str | None = None
    contact_nom: str | None = None
    contact_fonction: str | None = None
    taille: str | None = None
    effectif: int | None = None
    est_actif: bool
    created_at: datetime | None = None


class EnqueteCreate(BaseModel):
    titre: str
    titre_en: str | None = None
    description: str | None = None
    description_en: str | None = None
    secteur_id: int | None = None
    periode_id: int | None = None
    date_debut: date
    date_fin: date
    questions: list[dict]


class EnqueteUpdate(BaseModel):
    titre: str | None = None
    titre_en: str | None = None
    description: str | None = None
    description_en: str | None = None
    date_debut: date | None = None
    date_fin: date | None = None
    questions: list[dict] | None = None


class EnqueteResponse(BaseModel):
    id: int
    titre: str
    titre_en: str | None = None
    description: str | None = None
    secteur_id: int | None = None
    periode_id: int | None = None
    date_debut: date
    date_fin: date
    statut: str
    questions: list[dict]
    nombre_cibles: int
    nombre_reponses: int
    created_by: str | None = None
    created_at: datetime | None = None


class ReponseEnqueteCreate(BaseModel):
    reponses: dict


class ReponseEnqueteResponse(BaseModel):
    id: int
    enquete_id: int
    entreprise_id: int | None = None
    statut: str
    date_soumission: datetime | None = None
