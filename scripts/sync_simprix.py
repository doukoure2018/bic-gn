#!/usr/bin/env python3
"""
Script de scraping SIMPRIX - À exécuter sur le VPS (en dehors de Docker)
Usage: python3 sync_simprix.py

Prérequis sur le VPS:
  pip3 install playwright requests
  playwright install chromium
"""
import asyncio
import re
import sys
import requests

API_BASE = "http://localhost:8095"
SIMPRIX_BASE = "https://www.simprix.gov.gn"

PRODUCTS_ORDER = [
    "RIZ_5_50", "RIZ_25_50", "HUILE_20", "OIGNON_25",
    "POULET_10", "CUISSE_10", "SUCRE_50", "FARINE_50",
    "LAIT_25", "RIZ_5_25",
]

REGIONS = {
    "conakry": {"nom": "Conakry", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/8e0350a6c79d76cca67cfd0ea9157229d35c0d2f3252c18f"},
    "boke": {"nom": "Boké", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/8cfbf5a52bd82f5c98b9d1b3d7ce7312146bfdaad2e4b876"},
    "boffa": {"nom": "Boffa", "url": "/164346b82df9069987ef0029a0b44d9a/c70acfa6f4492b1c84cc278d902bd4e2f710fc01c19dd4d9"},
    "fria": {"nom": "Fria", "url": "/164346b82df9069987ef0029a0b44d9a/584250600729b39aa2fc291c86b79c32ab8a91ad5709d805"},
    "gaoual": {"nom": "Gaoual", "url": "/164346b82df9069987ef0029a0b44d9a/85542694c1629a5ac4e140f2fa33f675673ebb1cbcc5e8a2"},
    "koundara": {"nom": "Koundara", "url": "/164346b82df9069987ef0029a0b44d9a/8f2ab1498d51cc65ae2646bc5866468160113eeef84e5cac"},
    "kindia": {"nom": "Kindia", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/ef49819e7faaba3ee014d5ce442c57c2ef51ca7001efa70e"},
    "coyah": {"nom": "Coyah", "url": "/164346b82df9069987ef0029a0b44d9a/54934dda658902b078a70e61378439685678dcfd54fec111"},
    "dubreka": {"nom": "Dubréka", "url": "/164346b82df9069987ef0029a0b44d9a/bc2fde314ed3463653ff3a0c0c38abfc53604c4505905bf9"},
    "forecariah": {"nom": "Forécariah", "url": "/164346b82df9069987ef0029a0b44d9a/00e0ff9f921a725ea915cadb3449d407352be6f36103c788"},
    "telimele": {"nom": "Télimélé", "url": "/164346b82df9069987ef0029a0b44d9a/463111dc0f87b66e01ac5bcbda0f50002748bcad7bbf7bac"},
    "labe": {"nom": "Labé", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/e15133477de199b30684bd01de9d0a9105ab6d73a1e4fd8e"},
    "koubia": {"nom": "Koubia", "url": "/164346b82df9069987ef0029a0b44d9a/29d34c31b6d5d8f5b8885c102f4287f1cb01bfa935a00e73"},
    "lelouma": {"nom": "Lélouma", "url": "/164346b82df9069987ef0029a0b44d9a/ea0cec587b19522110b48f92621bcf1e05f968de86f24799"},
    "mali": {"nom": "Mali", "url": "/164346b82df9069987ef0029a0b44d9a/90a306ee1b2c96051d75b427abc3ad8c02909bb7e6bacbea"},
    "tougue": {"nom": "Tougué", "url": "/164346b82df9069987ef0029a0b44d9a/84516ae38fe9c481a841ab8c8a9a22de3577b23e20c9bad3"},
    "faranah": {"nom": "Faranah", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/65384f76657677feb5f32e29e534b257e21dd606b3af7668"},
    "dabola": {"nom": "Dabola", "url": "/164346b82df9069987ef0029a0b44d9a/be5c46a66860bf6898b3a07178faabf2fe0758cb616bfa7b"},
    "dinguiraye": {"nom": "Dinguiraye", "url": "/164346b82df9069987ef0029a0b44d9a/6ae4537d30f6a228e0a88e415d0e14aaaa3b0f03657751fc"},
    "kissidougou": {"nom": "Kissidougou", "url": "/164346b82df9069987ef0029a0b44d9a/0dada4f37427415f020e8dbeedb2e73752c0b094328f7d9d"},
    "nzerekore": {"nom": "Nzérékoré", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/5dda4f2f4b45d9104d4e9693b7fde337c087a4796a2ae27f"},
    "beyla": {"nom": "Beyla", "url": "/164346b82df9069987ef0029a0b44d9a/8761c5d2594c6c07734880267be2e47ac92ad00258da6798"},
    "gueckedou": {"nom": "Guéckédou", "url": "/164346b82df9069987ef0029a0b44d9a/83fc7866a3451b4959f2b0c902f9c0a9798d55e5e53bbb9b"},
    "lola": {"nom": "Lola", "url": "/164346b82df9069987ef0029a0b44d9a/ac2b241cd25c1135d04d9f7d08e72d3ddf2af768e879e34e"},
    "macenta": {"nom": "Macenta", "url": "/164346b82df9069987ef0029a0b44d9a/68d398f1de3dfe73e1f20b281c1c1192f50b0edf980e73fa"},
    "yomou": {"nom": "Yomou", "url": "/164346b82df9069987ef0029a0b44d9a/a040a3850fe95dcb39d32b212e7123b2b5a7a2ca9bed4166"},
    "mamou": {"nom": "Mamou", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/2870ebb6a4747885bac66bbc70c2a652276b5069fb9cdbad"},
    "dalaba": {"nom": "Dalaba", "url": "/164346b82df9069987ef0029a0b44d9a/5e0cc4f5e59ec75c2ada98df43b55b6f080d9aa6e121bfd7"},
    "pita": {"nom": "Pita", "url": "/164346b82df9069987ef0029a0b44d9a/311337d10a04db6ea645a4f8495bc0928b7e63c0bf8e297d"},
    "kankan": {"nom": "Kankan", "url": "/67bb5e36ad63ba84e38d76cda5d2e3e2/bebb13402f45c8ec03b615484614fc0276a42a74a286e816"},
    "siguiri": {"nom": "Siguiri", "url": "/164346b82df9069987ef0029a0b44d9a/31556cb99fbcc04fb60cde194f27b9dc09ee06bb8732d339"},
    "mandiana": {"nom": "Mandiana", "url": "/164346b82df9069987ef0029a0b44d9a/8f24e366b82304656b971ab550ccce52434a0c7b67f8fb4a"},
    "kouroussa": {"nom": "Kouroussa", "url": "/164346b82df9069987ef0029a0b44d9a/6143777b607dd1f8e687fbef7a908e696c90752b6756a3bb"},
    "kerouane": {"nom": "Kérouané", "url": "/164346b82df9069987ef0029a0b44d9a/7a315567244e6afeee5accba302a47ff5c4e08dc8c0d42cc"},
}


def get_token():
    resp = requests.post(f"{API_BASE}/api/auth/login", json={
        "email": "admin@oncp.gn", "password": "Admin@2024"
    })
    return resp.json()["access_token"]


def push_prices(token, region_code, region_nom, prices):
    """Push scraped prices to the API via internal DB insert endpoint."""
    headers = {"Authorization": f"Bearer {token}"}
    data = {"region_code": region_code, "region_nom": region_nom, "prices": prices}
    resp = requests.post(f"{API_BASE}/api/sources/simprix-import", json=data, headers=headers)
    return resp.json()


async def scrape_all():
    from playwright.async_api import async_playwright

    all_data = {}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, args=["--window-position=-2000,-2000"])
        ctx = await browser.new_context()
        page = await ctx.new_page()

        # Pass captcha
        print("Visiting main page to pass captcha...")
        await page.goto(f"{SIMPRIX_BASE}/9e7d6b59065b43a81686e55819520ba0",
                        wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(3000)

        for code, info in REGIONS.items():
            try:
                url = f"{SIMPRIX_BASE}{info['url']}"
                await page.goto(url, wait_until="networkidle", timeout=20000)
                await page.wait_for_timeout(2000)
                html = await page.content()

                # Extract ALL prices in order of appearance
                # Handles both 280.000 GNF and 1.005.500 GNF formats
                vals = []
                for m in re.finditer(r'([\d.,]+)\s*GNF', html):
                    raw = m.group(1).replace('.', '').replace(',', '')
                    try:
                        val = int(raw)
                        if val > 10000:
                            vals.append(val)
                    except ValueError:
                        pass

                if vals:
                    prices = {}
                    for i, product_code in enumerate(PRODUCTS_ORDER):
                        if i < len(vals):
                            prices[product_code] = vals[i]
                    all_data[code] = {"nom": info["nom"], "prices": prices}
                    print(f"  {info['nom']}: {len(prices)} prix")
                else:
                    print(f"  {info['nom']}: AUCUN PRIX")

            except Exception as e:
                print(f"  {info['nom']}: ERREUR - {e}")

        await browser.close()

    return all_data


def main():
    print("=" * 50)
    print("SIMPRIX Price Scraper - All Regions")
    print("=" * 50)

    # Get API token
    print("\nAuthentification API...")
    token = get_token()
    print("OK")

    # Scrape all regions
    print("\nScraping SIMPRIX (33 regions)...")
    all_data = asyncio.run(scrape_all())

    # Push to API
    print(f"\nPushing {len(all_data)} regions to API...")
    for code, data in all_data.items():
        result = push_prices(token, code, data["nom"], data["prices"])
        print(f"  {data['nom']}: {result}")

    print(f"\n{'=' * 50}")
    print(f"DONE: {len(all_data)} regions scraped and pushed")
    print(f"{'=' * 50}")


if __name__ == "__main__":
    main()
