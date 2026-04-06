from fastapi import APIRouter, Depends, Query

from app.database import get_db

router = APIRouter(prefix="/search", tags=["Recherche"])


@router.get("")
async def search(q: str = Query(..., min_length=2), conn=Depends(get_db)):
    """Moteur de recherche interne — cherche dans indicateurs, publications, actualites, donnees externes."""
    term = f"%{q}%"
    results = []

    # Indicateurs
    rows = await conn.fetch(
        """SELECT 'indicateur' as type, id, nom as titre, code as slug, unite as detail
           FROM indicateurs WHERE nom ILIKE $1 OR code ILIKE $1 OR nom_en ILIKE $1
           LIMIT 10""", term
    )
    for r in rows:
        results.append({"type": "indicateur", "id": r["id"], "titre": r["titre"],
                         "slug": r["slug"], "detail": r["detail"], "url": f"/donnees"})

    # Publications
    rows = await conn.fetch(
        """SELECT 'publication' as type, id, titre, type as detail
           FROM publications WHERE (titre ILIKE $1 OR resume ILIKE $1) AND est_publie = true
           LIMIT 10""", term
    )
    for r in rows:
        results.append({"type": "publication", "id": r["id"], "titre": r["titre"],
                         "slug": None, "detail": r["detail"], "url": f"/publications"})

    # Actualites
    rows = await conn.fetch(
        """SELECT 'actualite' as type, id, titre, slug, categorie as detail
           FROM actualites WHERE (titre ILIKE $1 OR contenu ILIKE $1 OR extrait ILIKE $1) AND est_publie = true
           LIMIT 10""", term
    )
    for r in rows:
        results.append({"type": "actualite", "id": r["id"], "titre": r["titre"],
                         "slug": r["slug"], "detail": r["detail"], "url": f"/actualites/{r['slug']}"})

    # Donnees externes
    rows = await conn.fetch(
        """SELECT 'donnee_externe' as type, de.id, de.indicateur_nom as titre,
                  de.indicateur_code as slug, se.nom as detail
           FROM donnees_externes de
           JOIN sources_externes se ON se.id = de.source_id
           WHERE de.indicateur_nom ILIKE $1 OR de.indicateur_code ILIKE $1
           GROUP BY de.indicateur_code, de.indicateur_nom, de.id, se.nom
           LIMIT 10""", term
    )
    for r in rows:
        results.append({"type": "donnee", "id": r["id"], "titre": r["titre"],
                         "slug": r["slug"], "detail": r["detail"], "url": "/donnees"})

    # Sous-secteurs
    rows = await conn.fetch(
        """SELECT 'sous_secteur' as type, id, nom as titre, code as slug, code_isic as detail
           FROM sous_secteurs WHERE nom ILIKE $1 OR code ILIKE $1
           LIMIT 5""", term
    )
    for r in rows:
        results.append({"type": "sous_secteur", "id": r["id"], "titre": r["titre"],
                         "slug": r["slug"], "detail": r["detail"], "url": "/barometre/industrie"})

    return {"query": q, "total": len(results), "results": results}
