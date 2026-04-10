#!/bin/bash
# Cron job: Mise à jour automatique des commodités
# Ajouter au crontab: crontab -e
# 0 8 * * * /home/ubuntu/bicgn-api/cron_commodites.sh >> /home/ubuntu/bicgn-api/logs/cron_commodites.log 2>&1

API="http://localhost:8095"
LOG_DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$LOG_DATE] === Début sync commodités ==="

# Auth
TOKEN=$(curl -s -X POST "$API/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oncp.gn","password":"Admin@2024"}' | \
  python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "[$LOG_DATE] ERREUR: Authentification échouée"
  exit 1
fi

# Scraper les prix via Playwright (headless + stealth)
COMMODITES=$(python3 - << 'PYEOF'
import asyncio, re, json

NAME_TO_CODE = {
    'crude oil': 'CRUDE_OIL', 'brent': 'BRENT', 'natural gas': 'NATURAL_GAS',
    'gasoline': 'GASOLINE', 'heating oil': 'HEATING_OIL', 'coal': 'COAL',
    'gold': 'GOLD', 'silver': 'SILVER', 'copper': 'COPPER',
    'platinum': 'PLATINUM', 'iron ore': 'IRON_ORE', 'aluminum': 'ALUMINUM', 'lithium': 'LITHIUM',
    'wheat': 'WHEAT', 'rice': 'RICE', 'corn': 'CORN', 'soybeans': 'SOYBEANS',
    'sugar': 'SUGAR', 'coffee': 'COFFEE', 'cocoa': 'COCOA', 'palm oil': 'PALM_OIL',
}

async def scrape():
    from playwright.async_api import async_playwright
    from bs4 import BeautifulSoup

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"]
        )
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
        )
        page = await ctx.new_page()
        await page.goto("https://tradingeconomics.com/commodities", wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(10000)
        html = await page.content()
        await browser.close()

    soup = BeautifulSoup(html, "html.parser")
    results = []
    seen = set()

    for row in soup.find_all("tr"):
        cells = row.find_all("td")
        if len(cells) >= 4:
            name = cells[0].get_text(strip=True).lower()
            for key, code in NAME_TO_CODE.items():
                if key in name and code not in seen:
                    try:
                        prix = float(cells[1].get_text(strip=True).replace(",", ""))
                        var_text = cells[-1].get_text(strip=True).replace("%", "").replace(",", ".")
                        variation = float(re.sub(r"[^\d.+-]", "", var_text))
                    except:
                        continue
                    results.append({"code": code, "prix": prix, "variation": variation})
                    seen.add(code)
                    break

    print(json.dumps(results))

asyncio.run(scrape())
PYEOF
)

# Vérifier si on a des données
COUNT=$(echo "$COMMODITES" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$COUNT" -gt "0" ] 2>/dev/null; then
  # Push vers API
  RESULT=$(curl -s -X POST "$API/api/sources/commodites-import" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$COMMODITES")
  echo "[$LOG_DATE] Playwright: $COUNT commodités importées - $RESULT"
else
  echo "[$LOG_DATE] Playwright échoué, utilisation API httpx..."

  # Fallback: utiliser httpx (pas de JS mais peut marcher)
  COMMODITES=$(python3 - << 'PYEOF2'
import httpx, re, json
from bs4 import BeautifulSoup

NAME_TO_CODE = {
    'crude oil': 'CRUDE_OIL', 'brent': 'BRENT', 'natural gas': 'NATURAL_GAS',
    'gasoline': 'GASOLINE', 'heating oil': 'HEATING_OIL', 'coal': 'COAL',
    'gold': 'GOLD', 'silver': 'SILVER', 'copper': 'COPPER',
    'platinum': 'PLATINUM', 'iron ore': 'IRON_ORE', 'aluminum': 'ALUMINUM', 'lithium': 'LITHIUM',
    'wheat': 'WHEAT', 'rice': 'RICE', 'corn': 'CORN', 'soybeans': 'SOYBEANS',
    'sugar': 'SUGAR', 'coffee': 'COFFEE', 'cocoa': 'COCOA', 'palm oil': 'PALM_OIL',
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
resp = httpx.get("https://tradingeconomics.com/commodities", headers=headers, timeout=30, follow_redirects=True)
soup = BeautifulSoup(resp.text, "html.parser")
results = []
seen = set()

for row in soup.find_all("tr"):
    cells = row.find_all("td")
    if len(cells) >= 4:
        name = cells[0].get_text(strip=True).lower()
        for key, code in NAME_TO_CODE.items():
            if key in name and code not in seen:
                try:
                    prix = float(cells[1].get_text(strip=True).replace(",", ""))
                    var_text = cells[-1].get_text(strip=True).replace("%", "").replace(",", ".")
                    variation = float(re.sub(r"[^\d.+-]", "", var_text))
                except:
                    continue
                results.append({"code": code, "prix": prix, "variation": variation})
                seen.add(code)
                break

print(json.dumps(results))
PYEOF2
)

  COUNT=$(echo "$COMMODITES" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))" 2>/dev/null)

  if [ "$COUNT" -gt "0" ] 2>/dev/null; then
    RESULT=$(curl -s -X POST "$API/api/sources/commodites-import" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$COMMODITES")
    echo "[$LOG_DATE] httpx fallback: $COUNT commodités importées - $RESULT"
  else
    echo "[$LOG_DATE] AUCUNE donnée récupérée"
  fi
fi

echo "[$LOG_DATE] === Fin sync commodités ==="
