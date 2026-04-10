#!/bin/bash
# Cron job: Synchronisation complète de toutes les sources
#
# Installation:
#   chmod +x /home/ubuntu/bicgn-api/cron_sync_all.sh
#   crontab -e
#   Ajouter:
#     0 6 * * * /home/ubuntu/bicgn-api/cron_sync_all.sh >> /home/ubuntu/bicgn-api/logs/cron_sync.log 2>&1
#     0 18 * * * /home/ubuntu/bicgn-api/cron_sync_all.sh >> /home/ubuntu/bicgn-api/logs/cron_sync.log 2>&1

API="http://localhost:8095"
LOG_DATE=$(date '+%Y-%m-%d %H:%M:%S')
SCRIPTS_DIR="/home/ubuntu/bicgn-api"

echo ""
echo "================================================================"
echo "[$LOG_DATE] SYNC COMPLETE - BIC-GN"
echo "================================================================"

# Auth
TOKEN=$(curl -s -X POST "$API/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oncp.gn","password":"Admin@2024"}' | \
  python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "[$LOG_DATE] ERREUR: Authentification échouée"
  exit 1
fi

HEADERS="Authorization: Bearer $TOKEN"

# 1. World Bank (API gratuite)
echo "[$LOG_DATE] [1/3] Sync World Bank..."
WB=$(curl -s -X POST "$API/api/sources/sync/worldbank" -H "$HEADERS")
echo "[$LOG_DATE] World Bank: $WB"

# 2. SIMPRIX (Playwright)
echo "[$LOG_DATE] [2/3] Sync SIMPRIX..."
cd "$SCRIPTS_DIR"
if [ -f "sync_simprix.py" ]; then
  python3 sync_simprix.py 2>&1 | tail -5
else
  echo "[$LOG_DATE] sync_simprix.py non trouvé, skip"
fi

# 3. Commodités (Playwright + fallback)
echo "[$LOG_DATE] [3/3] Sync Commodités..."
if [ -f "cron_commodites.sh" ]; then
  bash cron_commodites.sh
else
  echo "[$LOG_DATE] cron_commodites.sh non trouvé, skip"
fi

echo "[$LOG_DATE] === SYNC COMPLETE TERMINEE ==="
echo "================================================================"
