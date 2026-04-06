import logging
from datetime import datetime, date

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

SIMPRIX_URL = "https://www.simprix.gov.gn"


async def scrape_simprix_prices() -> list[dict]:
    """
    Attempt to scrape prices from SIMPRIX portal.
    Falls back to empty list if site is unreachable or format changes.
    """
    try:
        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            resp = await client.get(SIMPRIX_URL)
            if resp.status_code != 200:
                logger.warning(f"SIMPRIX returned {resp.status_code}")
                return []

            soup = BeautifulSoup(resp.text, "html.parser")

            prices = []
            # Look for price tables or data
            tables = soup.find_all("table")
            for table in tables:
                rows = table.find_all("tr")
                for row in rows[1:]:  # skip header
                    cells = row.find_all(["td", "th"])
                    if len(cells) >= 3:
                        prices.append({
                            "produit": cells[0].get_text(strip=True),
                            "prix": cells[1].get_text(strip=True),
                            "unite": cells[2].get_text(strip=True) if len(cells) > 2 else "",
                        })

            logger.info(f"SIMPRIX scraped: {len(prices)} products")
            return prices

    except Exception as e:
        logger.error(f"SIMPRIX scraping error: {e}")
        return []


async def sync_simprix(conn) -> dict:
    """Sync SIMPRIX prices into the database."""
    scraped = await scrape_simprix_prices()

    if not scraped:
        return {
            "source": "SIMPRIX",
            "message": "Aucune donnée récupérée (site indisponible ou format changé)",
            "total_synced": 0,
        }

    count = 0
    today = date.today()

    for item in scraped:
        try:
            prix_str = item["prix"].replace(" ", "").replace(",", ".")
            prix_val = float("".join(c for c in prix_str if c.isdigit() or c == "."))

            code = item["produit"][:50].upper().replace(" ", "_")

            await conn.execute("""
                INSERT INTO prix_produits (code_produit, nom_produit, categorie, prix_marche, unite, date_releve, source)
                VALUES ($1, $2, 'autre', $3, $4, $5, 'SIMPRIX')
                ON CONFLICT (code_produit, region_id, date_releve)
                DO UPDATE SET prix_marche = $3
            """, code, item["produit"], prix_val, item.get("unite", "GNF"), today)
            count += 1
        except Exception as e:
            logger.warning(f"SIMPRIX insert error for {item}: {e}")

    await conn.execute(
        "UPDATE sources_externes SET derniere_sync = $1 WHERE code = 'SIMPRIX'",
        datetime.utcnow()
    )

    return {"source": "SIMPRIX", "total_synced": count}


async def get_prix_produits(conn, categorie: str = None, date_from: str = None) -> list[dict]:
    """Get product prices with optional filters."""
    query = "SELECT * FROM prix_produits WHERE 1=1"
    params = []
    idx = 1

    if categorie:
        query += f" AND categorie = ${idx}"
        params.append(categorie)
        idx += 1

    if date_from:
        query += f" AND date_releve >= ${idx}"
        params.append(date_from)
        idx += 1

    query += " ORDER BY date_releve DESC, nom_produit"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


async def get_prix_evolution(conn, code_produit: str) -> list[dict]:
    """Get price evolution for a specific product."""
    rows = await conn.fetch("""
        SELECT date_releve, prix_plafond, prix_marche, variation
        FROM prix_produits
        WHERE code_produit = $1
        ORDER BY date_releve
    """, code_produit)
    return [dict(r) for r in rows]
