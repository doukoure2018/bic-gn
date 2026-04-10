#!/usr/bin/env python3
"""
Script de scraping Trading Economics Commodities
Usage: python3 sync_commodites.py

Prérequis:
  pip3 install playwright requests
  playwright install chromium
"""
import asyncio
import re
import requests

API_BASE = "http://localhost:8095"
TE_URL = "https://fr.tradingeconomics.com/commodities"

# Mapping des noms Trading Economics -> codes internes
NAME_TO_CODE = {
    "pétrole brut": "CRUDE_OIL", "crude oil": "CRUDE_OIL",
    "brent": "BRENT",
    "gaz naturel": "NATURAL_GAS", "natural gas": "NATURAL_GAS",
    "essence": "GASOLINE", "gasoline": "GASOLINE",
    "fioul": "HEATING_OIL", "heating oil": "HEATING_OIL",
    "charbon": "COAL", "coal": "COAL",
    "or": "GOLD", "gold": "GOLD",
    "argent": "SILVER", "silver": "SILVER",
    "cuivre": "COPPER", "copper": "COPPER",
    "platine": "PLATINUM", "platinum": "PLATINUM",
    "minerai de fer": "IRON_ORE", "iron ore": "IRON_ORE",
    "aluminium": "ALUMINUM", "aluminum": "ALUMINUM",
    "lithium": "LITHIUM",
    "blé": "WHEAT", "wheat": "WHEAT",
    "riz": "RICE", "rice": "RICE",
    "maïs": "CORN", "corn": "CORN", "mais": "CORN",
    "soja": "SOYBEANS", "soybeans": "SOYBEANS",
    "sucre": "SUGAR", "sugar": "SUGAR",
    "café": "COFFEE", "coffee": "COFFEE", "cafe": "COFFEE",
    "cacao": "COCOA", "cocoa": "COCOA",
    "huile de palme": "PALM_OIL", "palm oil": "PALM_OIL",
}


def get_token():
    resp = requests.post(f"{API_BASE}/api/auth/login", json={
        "email": "admin@oncp.gn", "password": "Admin@2024"
    })
    return resp.json()["access_token"]


async def scrape_commodities():
    from playwright.async_api import async_playwright

    commodities = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("Loading Trading Economics commodities page...")
        await page.goto(TE_URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(5000)

        html = await page.content()
        await browser.close()

    # Parse the HTML for commodity data
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")

    # Find all table rows with commodity data
    rows = soup.find_all("tr")
    for row in rows:
        cells = row.find_all("td")
        if len(cells) >= 3:
            name_cell = cells[0].get_text(strip=True).lower()
            price_cell = cells[1].get_text(strip=True)
            change_cell = cells[-1].get_text(strip=True) if len(cells) > 3 else "0"

            # Try to match commodity name
            code = None
            for name_key, code_val in NAME_TO_CODE.items():
                if name_key in name_cell:
                    code = code_val
                    break

            if code:
                # Parse price
                price_clean = price_cell.replace(",", "").replace(" ", "")
                try:
                    prix = float(price_clean)
                except ValueError:
                    continue

                # Parse variation
                variation = 0.0
                change_match = re.search(r'([+-]?\d+[.,]\d+)', change_cell.replace(",", "."))
                if change_match:
                    try:
                        variation = float(change_match.group(1))
                    except ValueError:
                        pass

                commodities.append({
                    "code": code,
                    "prix": prix,
                    "variation": variation,
                })
                print(f"  {code}: {prix} ({variation:+.2f}%)")

    # If table parsing didn't work, try text-based extraction
    if not commodities:
        print("Table parsing failed, trying text extraction...")
        text = soup.get_text(separator="\n")
        lines = [l.strip() for l in text.split("\n") if l.strip()]

        for i, line in enumerate(lines):
            line_lower = line.lower()
            for name_key, code_val in NAME_TO_CODE.items():
                if name_key == line_lower or line_lower.startswith(name_key):
                    # Look for price in next lines
                    for j in range(i + 1, min(i + 4, len(lines))):
                        price_match = re.search(r'(\d+[.,]?\d*)', lines[j].replace(",", ""))
                        if price_match:
                            try:
                                prix = float(price_match.group(1).replace(",", "."))
                                if prix > 0:
                                    commodities.append({"code": code_val, "prix": prix, "variation": 0})
                                    print(f"  {code_val}: {prix}")
                                    break
                            except ValueError:
                                pass
                    break

    return commodities


def main():
    print("=" * 50)
    print("Trading Economics Commodities Scraper")
    print("=" * 50)

    # Auth
    print("\nAuthentification API...")
    token = get_token()
    print("OK")

    # Scrape
    print("\nScraping Trading Economics...")
    commodities = asyncio.run(scrape_commodities())

    if not commodities:
        print("AUCUNE COMMODITÉ TROUVÉE")
        return

    # Push to API
    print(f"\nPushing {len(commodities)} commodities to API...")
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(
        f"{API_BASE}/api/sources/commodites-import",
        json=commodities,
        headers=headers,
    )
    print(f"Result: {resp.json()}")

    print(f"\n{'=' * 50}")
    print(f"DONE: {len(commodities)} commodities scraped and pushed")
    print(f"{'=' * 50}")


if __name__ == "__main__":
    main()
