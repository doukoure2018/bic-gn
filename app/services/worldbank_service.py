import logging
from datetime import datetime

import httpx

logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/GIN/indicator"
COUNTRY_CODE = "GIN"

# Mapping: World Bank indicator code -> (nom FR, nom EN, unité)
WB_INDICATORS = {
    "NV.IND.TOTL.ZS": ("Industrie (% du PIB)", "Industry (% of GDP)", "%"),
    "NV.IND.TOTL.CD": ("Valeur ajoutée industrielle", "Industry value added", "USD"),
    "NV.IND.MANF.ZS": ("Manufacturier (% du PIB)", "Manufacturing (% of GDP)", "%"),
    "NV.MNF.TECH.ZS.UN": ("Haute technologie manufactur. (%)", "High-tech manufacturing (%)", "%"),
    "SL.IND.EMPL.ZS": ("Emploi industriel (% total)", "Industry employment (% total)", "%"),
    "FP.CPI.TOTL.ZG": ("Inflation prix consommation", "Consumer price inflation", "%"),
    "NE.EXP.GNFS.ZS": ("Exportations (% du PIB)", "Exports (% of GDP)", "%"),
    "NE.IMP.GNFS.ZS": ("Importations (% du PIB)", "Imports (% of GDP)", "%"),
    "NY.GDP.MKTP.CD": ("PIB (USD courant)", "GDP (current USD)", "USD"),
    "NY.GDP.MKTP.KD.ZG": ("Croissance du PIB", "GDP growth", "%"),
    "NE.GDI.FTOT.ZS": ("Formation brute capital fixe (% PIB)", "Gross fixed capital formation (% GDP)", "%"),
    "BX.KLT.DINV.CD.WD": ("Investissements directs étrangers", "Foreign direct investment", "USD"),
    "TG.VAL.TOTL.GD.ZS": ("Commerce marchandises (% PIB)", "Merchandise trade (% GDP)", "%"),
    "GC.DOD.TOTL.GD.ZS": ("Dette publique (% PIB)", "Public debt (% GDP)", "%"),
    "SP.POP.TOTL": ("Population totale", "Total population", "personnes"),
}


async def fetch_wb_indicator(indicator_code: str, per_page: int = 20) -> list[dict]:
    """Fetch a single indicator from World Bank API."""
    url = f"{BASE_URL}/{indicator_code}"
    params = {"format": "json", "per_page": per_page}

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    if not data or len(data) < 2:
        return []

    results = []
    for entry in data[1]:
        if entry.get("value") is not None:
            results.append({
                "indicator_code": indicator_code,
                "year": int(entry["date"]),
                "value": float(entry["value"]),
                "country": entry.get("country", {}).get("value", "Guinea"),
            })

    return results


async def sync_all_worldbank(conn) -> dict:
    """Sync all World Bank indicators for Guinea into donnees_externes."""
    source = await conn.fetchrow(
        "SELECT id FROM sources_externes WHERE code = 'WORLDBANK'"
    )
    if not source:
        logger.error("Source WORLDBANK not found in DB")
        return {"error": "Source WORLDBANK not configured"}

    source_id = source["id"]
    total_synced = 0
    errors = []
    details = {}

    for wb_code, (nom_fr, nom_en, unite) in WB_INDICATORS.items():
        try:
            data_points = await fetch_wb_indicator(wb_code, per_page=30)
            count = 0

            for point in data_points:
                await conn.execute("""
                    INSERT INTO donnees_externes
                        (source_id, indicateur_code, indicateur_nom, pays, annee, valeur, unite, updated_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (source_id, indicateur_code, annee, trimestre)
                    DO UPDATE SET valeur = $6, updated_at = $8
                """,
                    source_id, wb_code, nom_fr, COUNTRY_CODE,
                    point["year"], point["value"], unite, datetime.utcnow()
                )
                count += 1

            total_synced += count
            details[wb_code] = {"nom": nom_fr, "points": count}
            logger.info(f"WB sync: {wb_code} ({nom_fr}) -> {count} points")

        except Exception as e:
            logger.error(f"WB sync error for {wb_code}: {e}")
            errors.append({"code": wb_code, "error": str(e)})

    # Update last sync timestamp
    await conn.execute(
        "UPDATE sources_externes SET derniere_sync = $1 WHERE code = 'WORLDBANK'",
        datetime.utcnow()
    )

    return {
        "source": "World Bank",
        "total_synced": total_synced,
        "indicators": len(details),
        "details": details,
        "errors": errors,
        "synced_at": datetime.utcnow().isoformat(),
    }


async def get_wb_indicator_data(conn, indicator_code: str, limit: int = 20) -> list[dict]:
    """Get stored World Bank data for a specific indicator."""
    rows = await conn.fetch("""
        SELECT annee, valeur, unite, indicateur_nom, updated_at
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = 'WORLDBANK')
          AND indicateur_code = $1
        ORDER BY annee DESC
        LIMIT $2
    """, indicator_code, limit)
    return [dict(r) for r in rows]


async def get_all_latest_wb(conn) -> list[dict]:
    """Get latest value for each World Bank indicator."""
    rows = await conn.fetch("""
        SELECT DISTINCT ON (indicateur_code)
            indicateur_code, indicateur_nom, annee, valeur, unite, updated_at
        FROM donnees_externes
        WHERE source_id = (SELECT id FROM sources_externes WHERE code = 'WORLDBANK')
        ORDER BY indicateur_code, annee DESC
    """)
    return [dict(r) for r in rows]
