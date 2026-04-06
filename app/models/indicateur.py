from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal


class SecteurResponse(BaseModel):
    id: int
    code: str
    nom: str
    nom_en: str | None = None
    description: str | None = None
    icone: str | None = None
    couleur: str | None = None


class CategorieResponse(BaseModel):
    id: int
    secteur_id: int
    code: str
    nom: str
    nom_en: str | None = None
    ordre: int = 0


class IndicateurCreate(BaseModel):
    categorie_id: int
    code: str
    nom: str
    nom_en: str | None = None
    description: str | None = None
    description_en: str | None = None
    unite: str
    type_calcul: str = "valeur"
    formule: str | None = None
    source: str | None = None
    periodicite: str = "trimestriel"


class IndicateurUpdate(BaseModel):
    categorie_id: int | None = None
    nom: str | None = None
    nom_en: str | None = None
    description: str | None = None
    description_en: str | None = None
    unite: str | None = None
    type_calcul: str | None = None
    formule: str | None = None
    source: str | None = None
    periodicite: str | None = None
    est_actif: bool | None = None


class IndicateurResponse(BaseModel):
    id: int
    categorie_id: int
    code: str
    nom: str
    nom_en: str | None = None
    description: str | None = None
    description_en: str | None = None
    unite: str
    type_calcul: str
    formule: str | None = None
    source: str | None = None
    periodicite: str
    est_actif: bool
    ordre: int
    created_at: datetime | None = None


class RegionResponse(BaseModel):
    id: int
    code: str
    nom: str
    nom_en: str | None = None
    population: int | None = None
    superficie: float | None = None


class PeriodeResponse(BaseModel):
    id: int
    annee: int
    trimestre: int
    date_debut: date
    date_fin: date
    est_publie: bool
    date_publication: datetime | None = None


class ValeurCreate(BaseModel):
    indicateur_id: int
    periode_id: int
    region_id: int | None = None
    valeur: Decimal
    source_donnee: str | None = None
    notes: str | None = None


class ValeurUpdate(BaseModel):
    valeur: Decimal | None = None
    source_donnee: str | None = None
    notes: str | None = None


class ValeurResponse(BaseModel):
    id: int
    indicateur_id: int
    periode_id: int
    region_id: int | None = None
    valeur: Decimal
    valeur_precedente: Decimal | None = None
    variation: Decimal | None = None
    tendance: str | None = None
    statut: str
    source_donnee: str | None = None
    notes: str | None = None
    saisi_par: str | None = None
    valide_par: str | None = None
    date_saisie: datetime | None = None
    date_validation: datetime | None = None


class IndiceIBICResponse(BaseModel):
    id: int
    periode_id: int
    secteur_id: int | None = None
    region_id: int | None = None
    valeur: Decimal
    variation: Decimal | None = None
    tendance: str | None = None
    interpretation: str | None = None
    composantes: dict | None = None


class DashboardResponse(BaseModel):
    ibic_global: IndiceIBICResponse | None = None
    ibic_industrie: IndiceIBICResponse | None = None
    ibic_commerce: IndiceIBICResponse | None = None
    inflation: dict | None = None
    kpis: list[dict] = []
    evolution_ibic: list[dict] = []
    industrie_vs_commerce: list[dict] = []
    derniere_periode: PeriodeResponse | None = None
