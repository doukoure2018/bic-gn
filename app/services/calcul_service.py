import json
import logging

logger = logging.getLogger(__name__)

PONDERATIONS = {
    "production": 0.20,
    "chiffre_affaires": 0.15,
    "investissements": 0.15,
    "emploi": 0.15,
    "exportations": 0.10,
    "stocks": 0.05,
    "tresorerie": 0.10,
    "perspectives": 0.10,
}


def calculer_ibic(valeurs: dict) -> float:
    ibic = sum(valeurs.get(k, 50) * v for k, v in PONDERATIONS.items())
    return round(ibic, 2)


def interpreter_ibic(score: float) -> str:
    if score < 40:
        return "mauvais"
    elif score < 60:
        return "stable"
    return "bon"


def calculer_tendance(valeur_actuelle: float, valeur_precedente: float | None) -> str:
    if valeur_precedente is None:
        return "stable"
    diff = valeur_actuelle - valeur_precedente
    if abs(diff) < 0.5:
        return "stable"
    return "hausse" if diff > 0 else "baisse"


def calculer_variation(valeur_actuelle: float, valeur_precedente: float | None) -> float | None:
    if valeur_precedente is None or valeur_precedente == 0:
        return None
    return round(((valeur_actuelle - valeur_precedente) / valeur_precedente) * 100, 2)


async def calculer_et_sauvegarder_ibic(conn, periode_id: int, secteur_id: int | None = None, region_id: int | None = None):
    query = """
        SELECT i.code, v.valeur
        FROM valeurs v
        JOIN indicateurs i ON i.id = v.indicateur_id
        WHERE v.periode_id = $1 AND v.statut = 'publie'
    """
    params = [periode_id]
    idx = 2

    if secteur_id:
        query += f" AND i.categorie_id IN (SELECT id FROM categories WHERE secteur_id = ${idx})"
        params.append(secteur_id)
        idx += 1

    if region_id:
        query += f" AND v.region_id = ${idx}"
        params.append(region_id)
    else:
        query += " AND v.region_id IS NULL"

    rows = await conn.fetch(query, *params)

    mapping = {}
    for row in rows:
        code = row["code"].lower()
        for key in PONDERATIONS:
            if key[:4] in code:
                mapping[key] = float(row["valeur"])
                break

    if not mapping:
        return None

    score = calculer_ibic(mapping)
    tendance_val = calculer_tendance(score, None)
    interpretation = interpreter_ibic(score)

    prev = await conn.fetchrow(
        """SELECT valeur FROM indice_ibic
           WHERE secteur_id IS NOT DISTINCT FROM $1
           AND region_id IS NOT DISTINCT FROM $2
           AND periode_id < $3
           ORDER BY periode_id DESC LIMIT 1""",
        secteur_id, region_id, periode_id
    )

    variation = None
    if prev:
        variation = calculer_variation(score, float(prev["valeur"]))
        tendance_val = calculer_tendance(score, float(prev["valeur"]))

    await conn.execute(
        """INSERT INTO indice_ibic (periode_id, secteur_id, region_id, valeur, variation, tendance, interpretation, composantes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (periode_id, secteur_id, region_id)
           DO UPDATE SET valeur=$4, variation=$5, tendance=$6, interpretation=$7, composantes=$8""",
        periode_id, secteur_id, region_id, score, variation, tendance_val, interpretation, json.dumps(mapping)
    )

    return {"valeur": score, "variation": variation, "tendance": tendance_val, "interpretation": interpretation}
