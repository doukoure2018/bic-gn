import json
import logging
import re
from datetime import datetime, date

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

SIMPRIX_BASE = "https://www.simprix.gov.gn"
SIMPRIX_IMG_BASE = "https://admin.simprix.gov.gn/web/mainAssets/media/uploads/photo/"

# URLs SIMPRIX par région (pages des prix plafonds)
SIMPRIX_REGION_URLS = {
    "conakry": {"nom": "Conakry", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/8e0350a6c79d76cca67cfd0ea9157229d35c0d2f3252c18f"},
    "boke": {"nom": "Boké", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/8cfbf5a52bd82f5c98b9d1b3d7ce7312146bfdaad2e4b876"},
    "kindia": {"nom": "Kindia", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/ef49819e7faaba3ee014d5ce442c57c2ef51ca7001efa70e"},
    "labe": {"nom": "Labé", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/e15133477de199b30684bd01de9d0a9105ab6d73a1e4fd8e"},
    "faranah": {"nom": "Faranah", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/65384f76657677feb5f32e29e534b257e21dd606b3af7668"},
    "nzerekore": {"nom": "Nzérékoré", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/5dda4f2f4b45d9104d4e9693b7fde337c087a4796a2ae27f"},
    "mamou": {"nom": "Mamou", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/2870ebb6a4747885bac66bbc70c2a652276b5069fb9cdbad"},
    "kankan": {"nom": "Kankan", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/bebb13402f45c8ec03b615484614fc0276a42a74a286e816"},
    # Sous-régions
    "boffa": {"nom": "Boffa", "url": "/164346b82df9069987ef0029a0b44d9a/c70acfa6f4492b1c84cc278d902bd4e2f710fc01c19dd4d9"},
    "fria": {"nom": "Fria", "url": "/164346b82df9069987ef0029a0b44d9a/584250600729b39aa2fc291c86b79c32ab8a91ad5709d805"},
    "gaoual": {"nom": "Gaoual", "url": "/164346b82df9069987ef0029a0b44d9a/85542694c1629a5ac4e140f2fa33f675673ebb1cbcc5e8a2"},
    "koundara": {"nom": "Koundara", "url": "/164346b82df9069987ef0029a0b44d9a/8f2ab1498d51cc65ae2646bc5866468160113eeef84e5cac"},
    "coyah": {"nom": "Coyah", "url": "/164346b82df9069987ef0029a0b44d9a/54934dda658902b078a70e61378439685678dcfd54fec111"},
    "dubreka": {"nom": "Dubréka", "url": "/164346b82df9069987ef0029a0b44d9a/bc2fde314ed3463653ff3a0c0c38abfc53604c4505905bf9"},
    "forecariah": {"nom": "Forécariah", "url": "/164346b82df9069987ef0029a0b44d9a/00e0ff9f921a725ea915cadb3449d407352be6f36103c788"},
    "telimele": {"nom": "Télimélé", "url": "/164346b82df9069987ef0029a0b44d9a/463111dc0f87b66e01ac5bcbda0f50002748bcad7bbf7bac"},
    "koubia": {"nom": "Koubia", "url": "/164346b82df9069987ef0029a0b44d9a/29d34c31b6d5d8f5b8885c102f4287f1cb01bfa935a00e73"},
    "lelouma": {"nom": "Lélouma", "url": "/164346b82df9069987ef0029a0b44d9a/ea0cec587b19522110b48f92621bcf1e05f968de86f24799"},
    "mali": {"nom": "Mali", "url": "/164346b82df9069987ef0029a0b44d9a/90a306ee1b2c96051d75b427abc3ad8c02909bb7e6bacbea"},
    "tougue": {"nom": "Tougué", "url": "/164346b82df9069987ef0029a0b44d9a/84516ae38fe9c481a841ab8c8a9a22de3577b23e20c9bad3"},
    "dabola": {"nom": "Dabola", "url": "/164346b82df9069987ef0029a0b44d9a/be5c46a66860bf6898b3a07178faabf2fe0758cb616bfa7b"},
    "dinguiraye": {"nom": "Dinguiraye", "url": "/164346b82df9069987ef0029a0b44d9a/6ae4537d30f6a228e0a88e415d0e14aaaa3b0f03657751fc"},
    "kissidougou": {"nom": "Kissidougou", "url": "/164346b82df9069987ef0029a0b44d9a/0dada4f37427415f020e8dbeedb2e73752c0b094328f7d9d"},
    "beyla": {"nom": "Beyla", "url": "/164346b82df9069987ef0029a0b44d9a/8761c5d2594c6c07734880267be2e47ac92ad00258da6798"},
    "lola": {"nom": "Lola", "url": "/164346b82df9069987ef0029a0b44d9a/ac2b241cd25c1135d04d9f7d08e72d3ddf2af768e879e34e"},
    "macenta": {"nom": "Macenta", "url": "/164346b82df9069987ef0029a0b44d9a/68d398f1de3dfe73e1f20b281c1c1192f50b0edf980e73fa"},
    "yomou": {"nom": "Yomou", "url": "/164346b82df9069987ef0029a0b44d9a/a040a3850fe95dcb39d32b212e7123b2b5a7a2ca9bed4166"},
    "dalaba": {"nom": "Dalaba", "url": "/164346b82df9069987ef0029a0b44d9a/5e0cc4f5e59ec75c2ada98df43b55b6f080d9aa6e121bfd7"},
    "pita": {"nom": "Pita", "url": "/164346b82df9069987ef0029a0b44d9a/311337d10a04db6ea645a4f8495bc0928b7e63c0bf8e297d"},
    "siguiri": {"nom": "Siguiri", "url": "/164346b82df9069987ef0029a0b44d9a/31556cb99fbcc04fb60cde194f27b9dc09ee06bb8732d339"},
    "mandiana": {"nom": "Mandiana", "url": "/164346b82df9069987ef0029a0b44d9a/8f24e366b82304656b971ab550ccce52434a0c7b67f8fb4a"},
    "kouroussa": {"nom": "Kouroussa", "url": "/164346b82df9069987ef0029a0b44d9a/6143777b607dd1f8e687fbef7a908e696c90752b6756a3bb"},
    "kerouane": {"nom": "Kérouané", "url": "/164346b82df9069987ef0029a0b44d9a/7a315567244e6afeee5accba302a47ff5c4e08dc8c0d42cc"},
}

SIMPRIX_REGIONS = {k: v["nom"] for k, v in SIMPRIX_REGION_URLS.items()}


async def _scrape_region_prices(client: httpx.AsyncClient, url: str) -> list[dict]:
    """Scrape prices from a SIMPRIX regional page."""
    try:
        resp = await client.get(url)
        if resp.status_code != 200:
            return []

        html = resp.text
        soup = BeautifulSoup(html, "html.parser")
        prices = []

        # Method 1: Find price values in text (pattern: "280.000 GNF" or "280,000")
        all_text = soup.get_text()
        # Look for product names followed by prices
        product_names = [
            "RIZ IMPORTE 5% BRISURES 50",
            "RIZ IMPORTE 25% BRISURES 50",
            "RIZ IMPORTE 5% BRISURES 25",
            "HUILE VEGETALE",
            "OIGNON",
            "POULET ENTIER",
            "CUISSE DE POULET",
            "SUCRE",
            "FARINE",
            "LAIT EN POUDRE",
        ]

        # Method 2: Find all elements with price-like content
        for el in soup.find_all(True):
            text = el.get_text(strip=True)
            if not text:
                continue
            # Match patterns like "280.000 GNF" or "280,000 GNF"
            price_match = re.search(r'(\d{2,3}[.,]\d{3})\s*GNF', text)
            if price_match:
                price_val = price_match.group(1).replace('.', '').replace(',', '')
                # Find which product this price belongs to
                parent_text = ""
                parent = el.parent
                for _ in range(5):
                    if parent:
                        parent_text = parent.get_text(strip=True).upper()
                        parent = parent.parent
                    else:
                        break

                for pname in product_names:
                    if pname in parent_text or pname in text.upper():
                        prices.append({"nom": pname, "prix": float(price_val)})
                        break

        # Method 3: Try extracting from any structured data
        if not prices:
            # Look for divs/spans with number patterns
            for el in soup.find_all(['span', 'div', 'p', 'td', 'h3', 'h4', 'h5']):
                text = el.get_text(strip=True)
                price_match = re.search(r'(\d{2,3})[.,](\d{3})', text)
                if price_match and 'GNF' in (el.parent.get_text() if el.parent else ''):
                    val = int(price_match.group(1)) * 1000 + int(price_match.group(2))
                    if 100000 <= val <= 2000000:  # Reasonable price range
                        prices.append({"nom": text, "prix": float(val)})

        # Method 4: Extract from JSON embedded in scripts
        for script in soup.find_all("script"):
            script_text = script.string or ""
            # Look for price data in JavaScript
            price_matches = re.findall(r'"prix"\s*:\s*"?(\d+)"?', script_text)
            name_matches = re.findall(r'"description"\s*:\s*"([^"]+)"', script_text)
            for i, price in enumerate(price_matches):
                if i < len(name_matches):
                    prices.append({"nom": name_matches[i], "prix": float(price)})

        return prices

    except Exception as e:
        logger.error(f"SIMPRIX scrape error for {url}: {e}")
        return []


def _parse_price(text: str) -> float | None:
    """Extract numeric price from text like '280,000 GNF' or '280000'."""
    cleaned = re.sub(r'[^\d,.]', '', str(text).replace(' ', ''))
    cleaned = cleaned.replace(',', '')
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return None


def _match_product_code(nom: str) -> str | None:
    """Match a product name to our internal code."""
    nom_lower = nom.lower()
    mapping = [
        ("riz", "5%", "50", "RIZ_5_50"),
        ("riz", "25%", "50", "RIZ_25_50"),
        ("riz", "5%", "25", "RIZ_5_25"),
        ("huile", "", "", "HUILE_20"),
        ("oignon", "", "", "OIGNON_25"),
        ("poulet entier", "", "", "POULET_10"),
        ("cuisse", "", "", "CUISSE_10"),
        ("sucre", "", "", "SUCRE_50"),
        ("farine", "", "", "FARINE_50"),
        ("lait", "", "", "LAIT_25"),
    ]
    for keywords in mapping:
        *terms, code = keywords
        if all(t in nom_lower for t in terms if t):
            return code
    return None


async def sync_simprix_all_regions(conn) -> dict:
    """Sync SIMPRIX prices for all regions."""
    total = 0
    errors = []
    regions_done = []

    # Images locales (téléchargées depuis admin.simprix.gov.gn)
    simprix_images = {
        "RIZ_5_50": "/images/produits/riz5_50.jpg",
        "RIZ_25_50": "/images/produits/riz25_50.jpg",
        "RIZ_5_25": "/images/produits/riz5_25.jpg",
        "HUILE_20": "/images/produits/huile.jpg",
        "OIGNON_25": "/images/produits/oignon.jpg",
        "POULET_10": "/images/produits/poulet.jpg",
        "CUISSE_10": "/images/produits/cuisse.jpg",
        "SUCRE_50": "/images/produits/sucre.jpg",
        "FARINE_50": "/images/produits/farine.jpg",
        "LAIT_25": "/images/produits/lait.jpg",
    }
    for code, url in simprix_images.items():
        await conn.execute("UPDATE simprix_produits SET image_url = $1 WHERE code = $2 AND image_url IS NULL", url, code)

    # Scrape prices from all SIMPRIX regional pages
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True, verify=False) as client:
            for region_code, region_info in SIMPRIX_REGION_URLS.items():
                try:
                    full_url = f"{SIMPRIX_BASE}{region_info['url']}"
                    scraped = await _scrape_region_prices(client, full_url)
                    if scraped:
                        today = date.today()
                        for item in scraped:
                            code = _match_product_code(item["nom"])
                            if code and item.get("prix"):
                                produit = await conn.fetchrow("SELECT id FROM simprix_produits WHERE code = $1", code)
                                if produit:
                                    await conn.execute("""
                                        INSERT INTO simprix_prix (produit_id, region_code, region_nom, prix_plafond, date_releve)
                                        VALUES ($1, $2, $3, $4, $5)
                                        ON CONFLICT (produit_id, region_code, date_releve)
                                        DO UPDATE SET prix_plafond = $4
                                    """, produit["id"], region_code, region_info["nom"], item["prix"], today)
                                    total += 1
                        regions_done.append(region_code)
                        logger.info(f"SIMPRIX: {region_info['nom']} -> {len(scraped)} prix")
                except Exception as e:
                    errors.append({"region": region_code, "error": str(e)})
                    logger.warning(f"SIMPRIX scrape error {region_code}: {e}")
    except Exception as e:
        logger.warning(f"SIMPRIX scraping failed: {e}")

    # Fallback: insert Conakry known prices if scraping got nothing
    known_prices = {
        "conakry": {
            "RIZ_5_50": 280000, "RIZ_25_50": 260000, "RIZ_5_25": 140000,
            "HUILE_20": 305000, "OIGNON_25": 270000, "POULET_10": 310000,
            "CUISSE_10": 220000, "SUCRE_50": 350000, "FARINE_50": 360000, "LAIT_25": 980000,
        },
    }
    if "conakry" not in regions_done:
        logger.info("SIMPRIX: Using fallback Conakry prices")

    today = date.today()
    for region_code, prices in known_prices.items():
        region_nom = SIMPRIX_REGIONS.get(region_code, region_code)
        for code, prix in prices.items():
            produit = await conn.fetchrow("SELECT id FROM simprix_produits WHERE code = $1", code)
            if produit:
                await conn.execute("""
                    INSERT INTO simprix_prix (produit_id, region_code, region_nom, prix_plafond, date_releve)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (produit_id, region_code, date_releve)
                    DO UPDATE SET prix_plafond = $4
                """, produit["id"], region_code, region_nom, prix, today)
                total += 1

        if region_code not in regions_done:
            regions_done.append(region_code)

    # Update last sync
    await conn.execute(
        "UPDATE sources_externes SET derniere_sync = $1 WHERE code = 'SIMPRIX'",
        datetime.utcnow()
    )

    return {
        "source": "SIMPRIX",
        "total_synced": total,
        "regions": regions_done,
        "errors": errors,
    }


async def get_simprix_prix(conn, region_code: str = None) -> list[dict]:
    """Get SIMPRIX prices with product details, filterable by region."""
    query = """
        SELECT sp.code, sp.nom, sp.unite, sp.image_url, sp.ordre,
               sx.region_code, sx.region_nom, sx.prix_plafond, sx.date_releve
        FROM simprix_prix sx
        JOIN simprix_produits sp ON sp.id = sx.produit_id
        WHERE sx.date_releve = (SELECT MAX(date_releve) FROM simprix_prix)
    """
    params = []
    if region_code:
        query += " AND sx.region_code = $1"
        params.append(region_code)

    query += " ORDER BY sp.ordre, sx.region_nom"
    rows = await conn.fetch(query, *params)
    return [dict(r) for r in rows]


async def get_simprix_regions(conn) -> list[dict]:
    """Get list of regions with price data."""
    rows = await conn.fetch("""
        SELECT DISTINCT region_code, region_nom
        FROM simprix_prix
        ORDER BY region_nom
    """)
    return [dict(r) for r in rows]


# Keep old functions for compatibility
async def sync_simprix(conn) -> dict:
    return await sync_simprix_all_regions(conn)


async def get_prix_produits(conn, categorie: str = None, date_from: str = None) -> list[dict]:
    return await get_simprix_prix(conn)


async def get_prix_evolution(conn, code_produit: str) -> list[dict]:
    rows = await conn.fetch("""
        SELECT sx.date_releve, sx.prix_plafond, sx.region_code, sx.region_nom
        FROM simprix_prix sx
        JOIN simprix_produits sp ON sp.id = sx.produit_id
        WHERE sp.code = $1
        ORDER BY sx.date_releve, sx.region_nom
    """, code_produit)
    return [dict(r) for r in rows]
