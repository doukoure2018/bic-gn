from fastapi import APIRouter, Depends

from app.database import get_db

router = APIRouter(prefix="/barometre", tags=["Baromètre"])


async def _get_latest_external(conn, source_code: str, indicator_code: str) -> dict | None:
    """Helper: get latest value for an indicator from a specific source."""
    row = await conn.fetchrow("""
        SELECT indicateur_code, indicateur_nom, annee, trimestre, valeur, unite, updated_at
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = $1)
          AND indicateur_code = $2
        ORDER BY annee DESC, trimestre DESC NULLS LAST
        LIMIT 1
    """, source_code, indicator_code)
    return dict(row) if row else None


async def _get_external_series(conn, source_code: str, indicator_code: str, limit: int = 30) -> list[dict]:
    """Helper: get time series for an indicator."""
    rows = await conn.fetch("""
        SELECT annee, trimestre, valeur, unite
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = $1)
          AND indicateur_code = $2
          AND valeur IS NOT NULL
        ORDER BY annee ASC, trimestre ASC NULLS LAST
        LIMIT $3
    """, source_code, indicator_code, limit)
    return [dict(r) for r in rows]


async def _get_source_indicators(conn, source_code: str, codes: list[str]) -> list[dict]:
    """Helper: get latest values for multiple indicators from a source."""
    rows = await conn.fetch("""
        SELECT DISTINCT ON (indicateur_code)
            indicateur_code, indicateur_nom, annee, trimestre, valeur, unite
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = $1)
          AND indicateur_code = ANY($2)
          AND valeur IS NOT NULL
        ORDER BY indicateur_code, annee DESC, trimestre DESC NULLS LAST
    """, source_code, codes)
    return [dict(r) for r in rows]


# =====================================================================
# DASHBOARD PRINCIPAL — 100% dynamique depuis les sources externes
# =====================================================================

@router.get("/dashboard")
async def dashboard(conn=Depends(get_db)):
    # --- World Bank: indicateurs macro ---
    wb_codes = [
        'NV.IND.TOTL.ZS', 'NV.IND.MANF.ZS', 'SL.IND.EMPL.ZS',
        'FP.CPI.TOTL.ZG', 'NE.EXP.GNFS.ZS', 'NE.IMP.GNFS.ZS',
        'NY.GDP.MKTP.CD', 'NY.GDP.MKTP.KD.ZG', 'NE.GDI.FTOT.ZS',
        'BX.KLT.DINV.CD.WD', 'TG.VAL.TOTL.GD.ZS', 'SP.POP.TOTL',
        'NV.IND.TOTL.CD',
    ]
    wb_latest = await _get_source_indicators(conn, 'WORLDBANK', wb_codes)

    # --- Trading Economics ---
    te_codes = ['GDP', 'GDP_GROWTH', 'INFLATION', 'FOOD_INFLATION', 'EXPORTS',
                'IMPORTS', 'TRADE_BALANCE', 'UNEMPLOYMENT', 'INTEREST_RATE', 'PUBLIC_DEBT', 'POPULATION']
    te_latest = await _get_source_indicators(conn, 'TRADINGECO', te_codes)

    # --- INS: IPI trimestriel ---
    ipi_data = await conn.fetch("""
        SELECT indicateur_code, indicateur_nom, annee, trimestre, valeur, unite, metadata
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = 'INS_GN')
        ORDER BY annee ASC, trimestre ASC
    """)

    # --- World Bank: séries historiques industrie pour graphiques ---
    wb_industrie_series = await _get_external_series(conn, 'WORLDBANK', 'NV.IND.TOTL.ZS')
    wb_export_series = await _get_external_series(conn, 'WORLDBANK', 'NE.EXP.GNFS.ZS')
    wb_inflation_series = await _get_external_series(conn, 'WORLDBANK', 'FP.CPI.TOTL.ZG')

    # Evolution: Industrie vs Commerce (% PIB)
    wb_manuf_series = await _get_external_series(conn, 'WORLDBANK', 'NV.IND.MANF.ZS')
    wb_trade_series = await _get_external_series(conn, 'WORLDBANK', 'TG.VAL.TOTL.GD.ZS')

    evolution_data = []
    ind_map = {str(d['annee']): float(d['valeur']) for d in wb_industrie_series}
    trade_map = {str(d['annee']): float(d['valeur']) for d in wb_trade_series}
    for year in sorted(set(list(ind_map.keys()) + list(trade_map.keys()))):
        entry = {'periode': year}
        if year in ind_map:
            entry['industrie'] = ind_map[year]
        if year in trade_map:
            entry['commerce'] = trade_map[year]
        evolution_data.append(entry)

    # --- Contraintes ---
    contraintes = await conn.fetch("""
        SELECT c.code, c.nom, c.nom_en, cv.score, cv.nombre_repondants
        FROM contraintes_valeurs cv
        JOIN contraintes c ON c.id = cv.contrainte_id
        ORDER BY cv.score DESC, c.ordre
    """)

    # --- Perspectives ---
    perspectives = await conn.fetch("""
        SELECT p2.optimiste, p2.stable, p2.pessimiste, p2.nombre_repondants,
               s.nom as secteur, s.code as secteur_code
        FROM perspectives p2
        LEFT JOIN secteurs s ON s.id = p2.secteur_id
        ORDER BY p2.periode_id DESC NULLS LAST
    """)

    # --- Prix SIMPRIX ---
    prix = await conn.fetch("""
        SELECT code_produit, nom_produit, categorie, prix_plafond, prix_marche, unite, date_releve
        FROM prix_produits
        ORDER BY date_releve DESC, nom_produit
        LIMIT 10
    """)

    # --- Freedom House ---
    freedom = await _get_latest_external(conn, 'FREEDOMH', 'FREEDOM_SCORE')

    # --- Sources status ---
    sources = await conn.fetch("""
        SELECT code, nom, type, derniere_sync,
               (SELECT COUNT(*) FROM donnees_externes WHERE source_id = se.id) as nb_donnees
        FROM sources_externes se
        WHERE est_actif = true
        ORDER BY id
    """)

    return {
        "worldbank": [dict(r) for r in wb_latest],
        "trading_economics": [dict(r) for r in te_latest],
        "ipi_data": [dict(r) for r in ipi_data],
        "evolution_industrie_commerce": evolution_data[-15:],
        "evolution_industrie": [
            {"periode": str(d["annee"]), "valeur": float(d["valeur"])}
            for d in wb_industrie_series[-15:]
        ],
        "evolution_inflation": [
            {"periode": str(d["annee"]), "valeur": float(d["valeur"])}
            for d in wb_inflation_series[-15:]
        ],
        "contraintes": [dict(r) for r in contraintes],
        "perspectives": [dict(r) for r in perspectives],
        "prix": [dict(r) for r in prix],
        "freedom_house": freedom,
        "sources": [dict(r) for r in sources],
    }


# =====================================================================
# INDUSTRIE — données dynamiques
# =====================================================================

@router.get("/industrie")
async def dashboard_industrie(conn=Depends(get_db)):
    # World Bank industrie
    wb_codes = ['NV.IND.TOTL.ZS', 'NV.IND.TOTL.CD', 'NV.IND.MANF.ZS',
                'SL.IND.EMPL.ZS', 'NE.EXP.GNFS.ZS', 'NE.GDI.FTOT.ZS']
    wb_latest = await _get_source_indicators(conn, 'WORLDBANK', wb_codes)

    # Séries historiques
    wb_industrie_series = await _get_external_series(conn, 'WORLDBANK', 'NV.IND.TOTL.ZS')
    wb_emploi_series = await _get_external_series(conn, 'WORLDBANK', 'SL.IND.EMPL.ZS')

    # INS: IPI trimestriel
    ipi_data = await conn.fetch("""
        SELECT indicateur_code, indicateur_nom, annee, trimestre, valeur, unite, metadata
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = 'INS_GN')
          AND indicateur_code LIKE 'IPI%%'
        ORDER BY annee, trimestre
    """)

    # Sous-secteurs
    sous_secteurs = await conn.fetch(
        "SELECT * FROM sous_secteurs WHERE secteur_id = 1 AND est_actif = true ORDER BY ordre"
    )

    # Contraintes industrie
    contraintes = await conn.fetch("""
        SELECT c.code, c.nom, c.nom_en, cv.score, cv.nombre_repondants
        FROM contraintes_valeurs cv
        JOIN contraintes c ON c.id = cv.contrainte_id
        WHERE cv.secteur_id = 1
        ORDER BY cv.score DESC, c.ordre
    """)

    # Perspectives industrie
    perspectives = await conn.fetchrow("""
        SELECT optimiste, stable, pessimiste, nombre_repondants
        FROM perspectives WHERE secteur_id = 1
        ORDER BY periode_id DESC NULLS LAST LIMIT 1
    """)

    return {
        "worldbank": [dict(r) for r in wb_latest],
        "evolution_industrie": [
            {"periode": str(d["annee"]), "valeur": float(d["valeur"])}
            for d in wb_industrie_series[-15:]
        ],
        "evolution_emploi": [
            {"periode": str(d["annee"]), "valeur": float(d["valeur"])}
            for d in wb_emploi_series[-15:]
        ],
        "ipi_data": [dict(r) for r in ipi_data],
        "sous_secteurs": [dict(r) for r in sous_secteurs],
        "contraintes": [dict(r) for r in contraintes],
        "perspectives": dict(perspectives) if perspectives else None,
    }


# =====================================================================
# COMMERCE — données dynamiques
# =====================================================================

@router.get("/commerce")
async def dashboard_commerce(conn=Depends(get_db)):
    # World Bank commerce
    wb_codes = ['FP.CPI.TOTL.ZG', 'NE.EXP.GNFS.ZS', 'NE.IMP.GNFS.ZS',
                'TG.VAL.TOTL.GD.ZS', 'NY.GDP.MKTP.CD']
    wb_latest = await _get_source_indicators(conn, 'WORLDBANK', wb_codes)

    # Séries historiques
    wb_export_series = await _get_external_series(conn, 'WORLDBANK', 'NE.EXP.GNFS.ZS')
    wb_import_series = await _get_external_series(conn, 'WORLDBANK', 'NE.IMP.GNFS.ZS')
    wb_inflation_series = await _get_external_series(conn, 'WORLDBANK', 'FP.CPI.TOTL.ZG')

    # Trading Economics
    te_codes = ['EXPORTS', 'IMPORTS', 'TRADE_BALANCE', 'INFLATION', 'FOOD_INFLATION']
    te_latest = await _get_source_indicators(conn, 'TRADINGECO', te_codes)

    # Sous-secteurs commerce
    sous_secteurs = await conn.fetch(
        "SELECT * FROM sous_secteurs WHERE secteur_id = 2 AND est_actif = true ORDER BY ordre"
    )

    # Prix SIMPRIX
    prix = await conn.fetch("""
        SELECT code_produit, nom_produit, categorie, prix_plafond, prix_marche, unite, date_releve
        FROM prix_produits ORDER BY date_releve DESC, nom_produit LIMIT 10
    """)

    # Contraintes commerce
    contraintes = await conn.fetch("""
        SELECT c.code, c.nom, c.nom_en, cv.score, cv.nombre_repondants
        FROM contraintes_valeurs cv
        JOIN contraintes c ON c.id = cv.contrainte_id
        WHERE cv.secteur_id = 2
        ORDER BY cv.score DESC, c.ordre
    """)

    # Perspectives commerce
    perspectives = await conn.fetchrow("""
        SELECT optimiste, stable, pessimiste, nombre_repondants
        FROM perspectives WHERE secteur_id = 2
        ORDER BY periode_id DESC NULLS LAST LIMIT 1
    """)

    # Evolution exports vs imports
    exp_map = {str(d['annee']): float(d['valeur']) for d in wb_export_series}
    imp_map = {str(d['annee']): float(d['valeur']) for d in wb_import_series}
    evolution_trade = []
    for year in sorted(set(list(exp_map.keys()) + list(imp_map.keys()))):
        entry = {'periode': year}
        if year in exp_map:
            entry['exportations'] = exp_map[year]
        if year in imp_map:
            entry['importations'] = imp_map[year]
        evolution_trade.append(entry)

    return {
        "worldbank": [dict(r) for r in wb_latest],
        "trading_economics": [dict(r) for r in te_latest],
        "evolution_trade": evolution_trade[-15:],
        "evolution_inflation": [
            {"periode": str(d["annee"]), "valeur": float(d["valeur"])}
            for d in wb_inflation_series[-15:]
        ],
        "sous_secteurs": [dict(r) for r in sous_secteurs],
        "prix": [dict(r) for r in prix],
        "contraintes": [dict(r) for r in contraintes],
        "perspectives": dict(perspectives) if perspectives else None,
    }


@router.get("/regions")
async def by_regions(conn=Depends(get_db)):
    rows = await conn.fetch(
        "SELECT r.code, r.nom FROM regions r ORDER BY r.nom"
    )
    return [dict(r) for r in rows]


@router.get("/comparaison")
async def comparaison(conn=Depends(get_db)):
    ind_series = await _get_external_series(conn, 'WORLDBANK', 'NV.IND.TOTL.ZS')
    trade_series = await _get_external_series(conn, 'WORLDBANK', 'TG.VAL.TOTL.GD.ZS')

    ind_map = {str(d['annee']): float(d['valeur']) for d in ind_series}
    trade_map = {str(d['annee']): float(d['valeur']) for d in trade_series}

    result = []
    for year in sorted(set(list(ind_map.keys()) + list(trade_map.keys()))):
        entry = {'periode': year}
        if year in ind_map:
            entry['industrie'] = ind_map[year]
        if year in trade_map:
            entry['commerce'] = trade_map[year]
        result.append(entry)

    return result[-15:]
