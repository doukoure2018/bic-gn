import json
import secrets

from app.exceptions.handlers import NotFoundException


async def create_enquete(conn, data: dict, user_id: str):
    return await conn.fetchrow(
        """INSERT INTO enquetes (titre, titre_en, description, description_en, secteur_id, periode_id, date_debut, date_fin, questions, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *""",
        data["titre"], data.get("titre_en"), data.get("description"), data.get("description_en"),
        data.get("secteur_id"), data.get("periode_id"), data["date_debut"], data["date_fin"],
        json.dumps(data["questions"]), user_id
    )


async def lancer_enquete(conn, enquete_id: int, entreprise_ids: list[int] | None = None):
    enquete = await conn.fetchrow("SELECT * FROM enquetes WHERE id = $1", enquete_id)
    if not enquete:
        raise NotFoundException("Enquête introuvable")

    if not entreprise_ids:
        entreprise_ids = [r["id"] for r in await conn.fetch(
            "SELECT id FROM entreprises WHERE est_actif = true AND secteur_id IS NOT DISTINCT FROM $1",
            enquete["secteur_id"]
        )]

    tokens = []
    for eid in entreprise_ids:
        token = secrets.token_urlsafe(32)
        await conn.execute(
            """INSERT INTO reponses_enquete (enquete_id, entreprise_id, token_acces, reponses, statut)
               VALUES ($1, $2, $3, '{}', 'en_cours')
               ON CONFLICT DO NOTHING""",
            enquete_id, eid, token
        )
        tokens.append({"entreprise_id": eid, "token": token})

    await conn.execute(
        "UPDATE enquetes SET statut = 'active', nombre_cibles = $1 WHERE id = $2",
        len(entreprise_ids), enquete_id
    )

    return tokens


async def soumettre_reponse(conn, token: str, reponses: dict):
    row = await conn.fetchrow(
        "SELECT * FROM reponses_enquete WHERE token_acces = $1", token
    )
    if not row:
        raise NotFoundException("Token invalide")

    await conn.execute(
        """UPDATE reponses_enquete SET reponses = $1, statut = 'complete', date_soumission = CURRENT_TIMESTAMP
           WHERE token_acces = $2""",
        json.dumps(reponses), token
    )

    await conn.execute(
        """UPDATE enquetes SET nombre_reponses = (
               SELECT COUNT(*) FROM reponses_enquete WHERE enquete_id = $1 AND statut = 'complete'
           ) WHERE id = $1""",
        row["enquete_id"]
    )


async def get_enquete_by_token(conn, token: str):
    row = await conn.fetchrow(
        """SELECT re.*, e.titre, e.titre_en, e.description, e.questions
           FROM reponses_enquete re
           JOIN enquetes e ON e.id = re.enquete_id
           WHERE re.token_acces = $1 AND e.statut = 'active'""",
        token
    )
    if not row:
        raise NotFoundException("Enquête introuvable ou inactive")
    return row
