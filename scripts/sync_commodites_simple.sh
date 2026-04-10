#!/bin/bash
# Sync commodités Trading Economics vers BIC-GN API
# Usage: bash sync_commodites_simple.sh
# Données mises à jour manuellement ou via cron

API="http://localhost:8095"

echo "=== Authentification ==="
TOKEN=$(curl -s -X POST "$API/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oncp.gn","password":"Admin@2024"}' | \
  python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "OK"

echo "=== Import Commodités ==="
curl -s -X POST "$API/api/sources/commodites-import" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"code":"CRUDE_OIL","prix":98.327,"variation":0.47},
    {"code":"BRENT","prix":96.695,"variation":0.81},
    {"code":"NATURAL_GAS","prix":2.6693,"variation":-0.03},
    {"code":"GASOLINE","prix":3.014,"variation":0.44},
    {"code":"HEATING_OIL","prix":4.0056,"variation":1.74},
    {"code":"COAL","prix":135.5,"variation":0.0},
    {"code":"GOLD","prix":4764.75,"variation":0.03},
    {"code":"SILVER","prix":76.061,"variation":0.99},
    {"code":"COPPER","prix":5.7756,"variation":0.48},
    {"code":"PLATINUM","prix":2083.2,"variation":-1.37},
    {"code":"IRON_ORE","prix":106.27,"variation":-1.45},
    {"code":"ALUMINUM","prix":3446.0,"variation":-0.92},
    {"code":"LITHIUM","prix":155550.0,"variation":-0.13},
    {"code":"WHEAT","prix":574.13,"variation":-0.06},
    {"code":"RICE","prix":10.905,"variation":-1.36},
    {"code":"CORN","prix":444.2552,"variation":0.06},
    {"code":"SOYBEANS","prix":1168.64,"variation":0.29},
    {"code":"SUGAR","prix":13.95,"variation":0.23},
    {"code":"COFFEE","prix":293.97,"variation":0.09},
    {"code":"COCOA","prix":3184.26,"variation":0.7},
    {"code":"PALM_OIL","prix":4643.0,"variation":1.24}
  ]'

echo ""
echo "=== DONE ==="
