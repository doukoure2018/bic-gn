from app.exceptions.handlers import NotFoundException, ConflictException


async def get_indicateurs(conn, secteur_code: str | None = None, categorie_id: int | None = None, actif_only: bool = True):
    query = """
        SELECT i.*, c.nom as categorie_nom, c.code as categorie_code, s.code as secteur_code
        FROM indicateurs i
        JOIN categories c ON c.id = i.categorie_id
        JOIN secteurs s ON s.id = c.secteur_id
        WHERE 1=1
    """
    params = []
    idx = 1

    if actif_only:
        query += " AND i.est_actif = true"

    if secteur_code:
        query += f" AND s.code = ${idx}"
        params.append(secteur_code)
        idx += 1

    if categorie_id:
        query += f" AND i.categorie_id = ${idx}"
        params.append(categorie_id)
        idx += 1

    query += " ORDER BY c.ordre, i.ordre"
    return await conn.fetch(query, *params)


async def get_indicateur(conn, indicateur_id: int):
    row = await conn.fetchrow("SELECT * FROM indicateurs WHERE id = $1", indicateur_id)
    if not row:
        raise NotFoundException("Indicateur introuvable")
    return row


async def create_indicateur(conn, data: dict):
    existing = await conn.fetchrow("SELECT id FROM indicateurs WHERE code = $1", data["code"])
    if existing:
        raise ConflictException(f"Le code '{data['code']}' existe déjà")

    return await conn.fetchrow(
        """INSERT INTO indicateurs (categorie_id, code, nom, nom_en, description, description_en, unite, type_calcul, formule, source, periodicite)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *""",
        data["categorie_id"], data["code"], data["nom"], data.get("nom_en"),
        data.get("description"), data.get("description_en"), data["unite"],
        data.get("type_calcul", "valeur"), data.get("formule"), data.get("source"),
        data.get("periodicite", "trimestriel")
    )


async def update_indicateur(conn, indicateur_id: int, data: dict):
    existing = await conn.fetchrow("SELECT * FROM indicateurs WHERE id = $1", indicateur_id)
    if not existing:
        raise NotFoundException("Indicateur introuvable")

    fields = {k: v for k, v in data.items() if v is not None}
    if not fields:
        return existing

    set_clauses = []
    params = []
    for i, (key, val) in enumerate(fields.items(), 1):
        set_clauses.append(f"{key} = ${i}")
        params.append(val)

    params.append(indicateur_id)
    query = f"UPDATE indicateurs SET {', '.join(set_clauses)} WHERE id = ${len(params)} RETURNING *"
    return await conn.fetchrow(query, *params)


async def delete_indicateur(conn, indicateur_id: int):
    existing = await conn.fetchrow("SELECT id FROM indicateurs WHERE id = $1", indicateur_id)
    if not existing:
        raise NotFoundException("Indicateur introuvable")
    await conn.execute("DELETE FROM indicateurs WHERE id = $1", indicateur_id)


async def create_valeur(conn, data: dict, user_id: str):
    from app.services.calcul_service import calculer_tendance, calculer_variation

    prev = await conn.fetchrow(
        """SELECT v.valeur FROM valeurs v
           JOIN periodes p ON p.id = v.periode_id
           WHERE v.indicateur_id = $1 AND v.region_id IS NOT DISTINCT FROM $2
           ORDER BY p.annee DESC, p.trimestre DESC LIMIT 1""",
        data["indicateur_id"], data.get("region_id")
    )

    valeur_precedente = float(prev["valeur"]) if prev else None
    valeur_actuelle = float(data["valeur"])
    variation = calculer_variation(valeur_actuelle, valeur_precedente)
    tendance = calculer_tendance(valeur_actuelle, valeur_precedente)

    return await conn.fetchrow(
        """INSERT INTO valeurs (indicateur_id, periode_id, region_id, valeur, valeur_precedente, variation, tendance, source_donnee, notes, saisi_par)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *""",
        data["indicateur_id"], data["periode_id"], data.get("region_id"),
        data["valeur"], valeur_precedente, variation, tendance,
        data.get("source_donnee"), data.get("notes"), user_id
    )


async def valider_valeur(conn, valeur_id: int, user_id: str):
    row = await conn.fetchrow("SELECT * FROM valeurs WHERE id = $1", valeur_id)
    if not row:
        raise NotFoundException("Valeur introuvable")

    return await conn.fetchrow(
        """UPDATE valeurs SET statut = 'valide', valide_par = $1, date_validation = CURRENT_TIMESTAMP
           WHERE id = $2 RETURNING *""",
        user_id, valeur_id
    )


async def get_serie_temporelle(conn, indicateur_id: int, region_id: int | None = None):
    query = """
        SELECT v.*, p.annee, p.trimestre
        FROM valeurs v
        JOIN periodes p ON p.id = v.periode_id
        WHERE v.indicateur_id = $1 AND v.region_id IS NOT DISTINCT FROM $2
        ORDER BY p.annee, p.trimestre
    """
    return await conn.fetch(query, indicateur_id, region_id)
