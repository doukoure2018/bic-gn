# Documentation des Indicateurs — BIC-GN

> **Baromètre Industrie et Commerce — Guinée**
> Observatoire National de la Compétitivité Pays (ONCP)

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Sources de données](#2-sources-de-données)
3. [Indicateurs Industrie](#3-indicateurs-industrie)
4. [Indicateurs Commerce](#4-indicateurs-commerce)
5. [Indicateurs macro-économiques transversaux](#5-indicateurs-macro-économiques-transversaux)
6. [Prix des denrées (SIMPRIX)](#6-prix-des-denrées-simprix)
7. [Indice synthétique IBIC](#7-indice-synthétique-ibic)
8. [Sous-secteurs industriels](#8-sous-secteurs-industriels)
9. [Méthodologie IPI](#9-méthodologie-ipi)

---

## 1. Vue d'ensemble

| Métrique | Valeur |
|----------|--------|
| Indicateurs identifiés | ~120 |
| Indicateurs implémentés en base | 45 indicateurs internes + 24 World Bank + 11 Trading Economics |
| Sources de données | 8 sources actives |
| Prix suivis (SIMPRIX) | 10 produits |
| Sous-secteurs industriels | 9 (classification ISIC Rév. 4) |
| Sous-secteurs commerce | 5 |
| Régions couvertes | 8 + National |
| Fréquences | Temps réel, quotidien, mensuel, trimestriel, annuel |

---

## 2. Sources de données

### Sources automatiques (API)

| Source | Type | URL | Données | Coût |
|--------|------|-----|---------|------|
| **Banque Mondiale** | API REST | `api.worldbank.org/v2/country/GIN/indicator/{code}?format=json` | 13 indicateurs macro, historique 30 ans | Gratuit |
| **Guinea Open Data** | API SDMX | `guinea.opendataforafrica.org` | Données IMF/BAD | Gratuit |

### Sources semi-automatiques

| Source | Type | URL | Données | Coût |
|--------|------|-----|---------|------|
| **Trading Economics** | API | `tradingeconomics.com/guinea` | PIB, inflation, commerce, emploi (11 indicateurs) | Trial gratuit (100 req.) |
| **Freedom House** | Web | `freedomhouse.org/country/guinea` | Score liberté/gouvernance | Gratuit |
| **WACOMP Observatory** | Web | `wacomp-observatory.org` | Compétitivité CEDEAO | Gratuit |

### Sources manuelles / scraping

| Source | Type | URL | Données |
|--------|------|-----|---------|
| **INS Guinée** | Import Excel | — | IPI trimestriel, statistiques nationales |
| **SIMPRIX** | Scraping | `simprix.gov.gn` | Prix plafonds denrées première nécessité |
| **ANASA** | Import Excel | `anasa.gov.gn` | Statistiques agricoles, annuaires |
| **BCRG** | Import Excel | — | Inflation, taux de change, balance des paiements |
| **Enquêtes ONCP** | Module interne | — | Contraintes entreprises, perspectives, IPI détaillé |

---

## 3. Indicateurs Industrie

### 3.1 Production

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Indice de Production Industrielle (IPI) Total | Indice base 100 | INS | — | Trimestriel | Oui (INS seed) |
| IPI Manufacturier | Indice base 100 | INS | — | Trimestriel | Oui (seed) |
| Taux d'utilisation des capacités | % | Enquête ONCP | — | Trimestriel | Oui (seed) |
| Volume de production | Unités | Enquête ONCP | — | Trimestriel | Oui (seed) |
| Commandes reçues | Indice | Enquête ONCP | — | Trimestriel | Oui (seed) |
| Stocks de produits finis | Indice | Enquête ONCP | — | Trimestriel | Oui (questionnaire) |
| Production minière physique | Tonnes | INS / Min. Mines | — | Trimestriel | Documenté |
| Valeur production minière | USD | INS / Min. Mines | — | Annuel | Documenté |
| Production MWh (énergie) | MWh | Opérateurs énergie | — | Mensuel | Documenté |
| Volume eau traitée | m³ | Opérateurs eau | — | Mensuel | Documenté |
| Volume construction | m², km | Min. Urbanisme | — | Trimestriel | Documenté |

### 3.2 Finances et investissements

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Montant des investissements | Mrd GNF | INS | — | Trimestriel | Oui (seed) |
| Accès au financement | Indice | Enquête ONCP | — | Trimestriel | Oui (seed) |
| Investissements industriels (FBCF) | Mrd USD | INS / Banque Centrale | `NE.GDI.FTOT.ZS` | Annuel | Oui (WB) |
| Investissements directs étrangers | USD | Banque Mondiale | `BX.KLT.DINV.CD.WD` | Annuel | Oui (WB) |
| Chiffre d'affaires industriel | Mrd GNF | INS / Enquête | — | Trimestriel | Documenté |
| Trésorerie des entreprises | Indice | Enquête ONCP | — | Trimestriel | Oui (questionnaire) |
| Taux d'intérêt crédit entreprises | % | BCRG | — | Mensuel | Oui (TE) |

### 3.3 Emploi

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Effectifs employés | Nombre | Enquête ONCP | — | Trimestriel | Oui (seed) |
| Variation emploi | % | INS | — | Trimestriel | Oui (seed) |
| Emploi industriel (% total) | % | Banque Mondiale | `SL.IND.EMPL.ZS` | Annuel | Oui (WB) |
| Nombre d'emplois industriels | Nombre | INS / Min. Travail | — | Annuel | Oui (questionnaire) |
| Salaires industriels | GNF | Min. Travail | — | Annuel | Documenté |
| Recrutements / Licenciements | Nombre | Enquête ONCP | — | Trimestriel | Oui (questionnaire) |

### 3.4 Exportations industrielles

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Volume exportations | Mrd GNF | BCRG | — | Trimestriel | Oui (seed) |
| Variation exportations | % | BCRG | — | Trimestriel | Oui (seed) |
| Exportations (% du PIB) | % | Banque Mondiale | `NE.EXP.GNFS.ZS` | Annuel | Oui (WB) |
| Exportations industrielles | USD | Douanes / INS | — | Trimestriel | Documenté |
| Importations matières premières | USD | Douanes | — | Trimestriel | Documenté |
| Importations (% du PIB) | % | Banque Mondiale | `NE.IMP.GNFS.ZS` | Annuel | Oui (WB) |

### 3.5 Coûts de production

| Indicateur | Unité | Source | Fréquence | Implémenté |
|------------|-------|--------|-----------|------------|
| Coût énergie | GNF/kWh | Enquête ONCP | Trimestriel | Oui (questionnaire) |
| Coût transport | GNF/tonne.km | Enquête ONCP | Trimestriel | Oui (questionnaire) |
| Coût matières premières | Indice / % | Enquête ONCP | Trimestriel | Oui (questionnaire) |
| Coût main d'œuvre | GNF/employé | Min. Travail | Annuel | Documenté |

### 3.6 Climat des affaires

| Indicateur | Unité | Source | Fréquence | Implémenté |
|------------|-------|--------|-----------|------------|
| Contrainte Électricité | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Fiscalité | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Transport | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Accès financement | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Douanes | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Informel | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Infrastructures | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Contrainte Corruption | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Score liberté globale | /100 | Freedom House | Annuel | Oui |

### 3.7 Perspectives

| Indicateur | Unité | Source | Fréquence | Implémenté |
|------------|-------|--------|-----------|------------|
| Perspectives de production | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Oui |
| Perspectives d'investissement | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Oui (questionnaire) |
| Perspectives d'emploi | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Oui (questionnaire) |
| Perspectives d'exportation | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Documenté |

---

## 4. Indicateurs Commerce

### 4.1 Commerce intérieur

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Chiffre d'affaires commerce | Mrd GNF | INS | — | Trimestriel | Oui (seed) |
| Volume des ventes | Indice | Enquête ONCP | — | Trimestriel | Oui (seed) |
| Fréquentation clients | Indice | Enquête ONCP | — | Trimestriel | Documenté |
| Stocks | Indice | Enquête ONCP | — | Trimestriel | Documenté |
| Délais de paiement | Jours | Enquête ONCP | — | Trimestriel | Documenté |
| Prix de vente | GNF | Enquête / SIMPRIX | — | Temps réel | Oui (SIMPRIX) |
| Approvisionnement | Indice | Enquête ONCP | — | Trimestriel | Documenté |

### 4.2 Commerce extérieur

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Importations | Mrd GNF / M USD | BCRG / Douanes | `NE.IMP.GNFS.ZS` | Trim. / Annuel | Oui (seed + WB) |
| Exportations | Mrd GNF / M USD | BCRG / Douanes | `NE.EXP.GNFS.ZS` | Trim. / Annuel | Oui (seed + WB) |
| Balance commerciale | Mrd GNF / M USD | BCRG | — | Trimestriel | Oui (seed + TE) |
| Commerce marchandises (% PIB) | % | Banque Mondiale | `TG.VAL.TOTL.GD.ZS` | Annuel | Oui (WB) |
| Exportations (valeur Trading Eco.) | M USD | Trading Economics | `EXPORTS` | Annuel | Oui (TE: $3 641M) |
| Importations (valeur Trading Eco.) | M USD | Trading Economics | `IMPORTS` | Annuel | Oui (TE: $2 676M) |
| Balance commerciale (Trading Eco.) | M USD | Trading Economics | `TRADE_BALANCE` | Annuel | Oui (TE: $965M) |
| Délai de dédouanement | Jours | Douanes | — | Trimestriel | Documenté |
| Taux de change | GNF/USD | BCRG | — | Quotidien | Documenté |
| Volume des conteneurs | TEU | Autorité portuaire | — | Mensuel | Documenté |

### 4.3 Prix et inflation

| Indicateur | Unité | Source | Code WB | Fréquence | Implémenté |
|------------|-------|--------|---------|-----------|------------|
| Indice des prix (IPC) | Indice base 100 | INS | — | Mensuel | Oui (seed) |
| Taux d'inflation | % | BCRG / Banque Mondiale | `FP.CPI.TOTL.ZG` | Annuel | Oui (WB: 8,1%) |
| Inflation (CPI Trading Eco.) | % | Trading Economics | `INFLATION` | Annuel | Oui (TE: 4,4%) |
| Inflation alimentaire | % | Trading Economics | `FOOD_INFLATION` | Annuel | Oui (TE: 9,6%) |
| Prix riz local | GNF/kg | SIMPRIX | — | Temps réel | Oui (plafond: 8 500) |
| Prix riz importé | GNF/kg | SIMPRIX | — | Temps réel | Oui (plafond: 9 500) |
| Prix huile de palme | GNF/litre | SIMPRIX | — | Temps réel | Oui (plafond: 18 000) |
| Prix sucre | GNF/kg | SIMPRIX | — | Temps réel | Oui (plafond: 12 000) |
| Prix essence | GNF/litre | SIMPRIX | — | Temps réel | Oui (plafond: 12 000) |

### 4.4 Contraintes commerce

| Indicateur | Unité | Source | Fréquence | Implémenté |
|------------|-------|--------|-----------|------------|
| Fiscalité | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Douanes | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Transport | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Accès financement | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Concurrence | Score 1-5 | Enquête ONCP | Trimestriel | Documenté |
| Fraude | Score 1-5 | Enquête ONCP | Trimestriel | Documenté |
| Secteur informel | Score 1-5 | Enquête ONCP | Trimestriel | Oui |
| Sécurité | Score 1-5 | Enquête ONCP | Trimestriel | Documenté |

### 4.5 Perspectives commerce

| Indicateur | Unité | Source | Fréquence | Implémenté |
|------------|-------|--------|-----------|------------|
| Perspectives de ventes | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Oui |
| Perspectives de prix | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Documenté |
| Perspectives d'importation | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Documenté |
| Perspectives d'investissement | % (Opt/Stab/Pess) | Enquête ONCP | Trimestriel | Documenté |

---

## 5. Indicateurs macro-économiques transversaux

### Banque Mondiale (API gratuite — sync automatique)

| Indicateur | Code WB | Dernière valeur | Année |
|------------|---------|-----------------|-------|
| Industrie (% du PIB) | `NV.IND.TOTL.ZS` | 25,1% | 2024 |
| Valeur ajoutée industrielle | `NV.IND.TOTL.CD` | $6,28 Mrd | 2024 |
| Manufacturier (% du PIB) | `NV.IND.MANF.ZS` | 12,8% | 2022 |
| Emploi industriel (% total) | `SL.IND.EMPL.ZS` | 14,2% | 2025 |
| Inflation prix consommation | `FP.CPI.TOTL.ZG` | 8,1% | 2024 |
| Exportations (% du PIB) | `NE.EXP.GNFS.ZS` | 41,4% | 2024 |
| Importations (% du PIB) | `NE.IMP.GNFS.ZS` | 38,5% | 2024 |
| PIB (USD courant) | `NY.GDP.MKTP.CD` | $25,0 Mrd | 2024 |
| Croissance du PIB | `NY.GDP.MKTP.KD.ZG` | 5,3% | 2024 |
| Formation brute capital fixe | `NE.GDI.FTOT.ZS` | 33,2% | 2024 |
| IDE | `BX.KLT.DINV.CD.WD` | $1,4 Mrd | 2024 |
| Commerce marchandises (% PIB) | `TG.VAL.TOTL.GD.ZS` | 62,9% | 2024 |
| Population totale | `SP.POP.TOTL` | 14,75M | 2024 |

### Trading Economics

| Indicateur | Code | Dernière valeur | Année |
|------------|------|-----------------|-------|
| PIB | `GDP` | $25,3 Mrd | 2025 |
| Croissance PIB | `GDP_GROWTH` | 5,6% | 2025 |
| Taux de chômage | `UNEMPLOYMENT` | 5,2% | 2025 |
| Inflation (CPI) | `INFLATION` | 4,4% | 2025 |
| Inflation alimentaire | `FOOD_INFLATION` | 9,6% | 2025 |
| Exportations | `EXPORTS` | $3 641M | 2025 |
| Importations | `IMPORTS` | $2 676M | 2025 |
| Balance commerciale | `TRADE_BALANCE` | $965M | 2025 |
| Taux d'intérêt | `INTEREST_RATE` | 9,5% | 2025 |
| Population | `POPULATION` | 14,36M | 2025 |
| Dette publique (% PIB) | `PUBLIC_DEBT` | 33,6% | 2025 |

### INS Guinée (IPI trimestriel — données réelles)

| Période | Indicateur | Valeur | Source détaillée |
|---------|------------|--------|------------------|
| T1 2025 vs T4 2024 | IPI Total (variation) | +11,0% | INS rapports IPI T1-2025 |
| T2 2025 vs T2 2024 | IPI Total (variation) | +5,0% | INS via Eco-Finance Guinée |
| T3 2025 vs T3 2024 | IPI Total (variation) | +10,4% | INS publication harmonisée T3-2025 |

### Freedom House

| Indicateur | Valeur | Année |
|------------|--------|-------|
| Score liberté globale | 28/100 (Not Free) | 2026 |
| Droits politiques | 6/40 | 2026 |
| Libertés civiles | 22/60 | 2026 |

---

## 6. Prix des denrées (SIMPRIX)

Source : **SIMPRIX** — Système d'Information sur les Prix (simprix.gov.gn)
Direction Nationale du Commerce Intérieur et de la Concurrence (DNCIC)

| Produit | Catégorie | Prix plafond | Prix marché | Unité |
|---------|-----------|-------------|-------------|-------|
| Riz local | Alimentaire | 8 500 | 9 000 | GNF/kg |
| Riz importé | Alimentaire | 9 500 | 10 200 | GNF/kg |
| Huile de palme | Alimentaire | 18 000 | 19 500 | GNF/litre |
| Sucre | Alimentaire | 12 000 | 12 500 | GNF/kg |
| Farine de blé | Alimentaire | 11 000 | 11 800 | GNF/kg |
| Lait en poudre | Alimentaire | 45 000 | 48 000 | GNF/400g |
| Ciment (50kg) | Construction | 85 000 | 90 000 | GNF/sac |
| Essence | Énergie | 12 000 | 12 000 | GNF/litre |
| Gasoil | Énergie | 12 000 | 12 000 | GNF/litre |
| Gaz butane (12kg) | Énergie | 120 000 | 130 000 | GNF/bouteille |

---

## 7. Indice synthétique IBIC

### Formule

L'Indice du Baromètre Industrie et Commerce est calculé comme suit :

```
IBIC = Σ (Composante_i × Pondération_i)
```

### Composantes et pondérations

| Composante | Pondération |
|------------|-------------|
| Production / Ventes | 20% |
| Chiffre d'affaires | 15% |
| Investissements | 15% |
| Emploi | 15% |
| Exportations | 10% |
| Stocks | 5% |
| Trésorerie | 10% |
| Perspectives | 10% |
| **Total** | **100%** |

### Interprétation

| Score | Interprétation | Couleur |
|-------|----------------|---------|
| 60 — 100 | Situation bonne | Vert `#2E8B57` |
| 40 — 60 | Situation stable | Or `#D4A829` |
| 0 — 40 | Situation mauvaise | Rouge `#C41E3A` |

---

## 8. Sous-secteurs industriels

Classification ISIC Révision 4 (codes 05-43)

| Sous-secteur | Code ISIC | Poids (%) | Statut données |
|--------------|-----------|-----------|----------------|
| Extraction minière (mines) | 05-09 | 39,25% | Poids connu |
| Industries manufacturières | 10-33 | 43,61% | Poids connu |
| Construction industrielle | 41-43 | 17,41% | Poids connu |
| Électricité, gaz et eau | 35-39 | — | Non ventilé publiquement |
| Industries agro-alimentaires | — | — | Partie du manufacturier |
| Industries chimiques et matériaux | — | — | Très faible présence |
| Textile, habillement et cuir | — | ~16% des unités | Pas de pondération officielle |
| Métallurgie et produits métalliques | — | — | Partie du manufacturier |
| Industries du bois et papiers | — | — | Très faible |

### Calcul IPI pondéré

```
IPI Total = Σ (IPI_sous-secteur_i × Poids_i)

Exemple:
  Manufacturier: IPI=110 × 0.4361 = 47.97
  Mines:         IPI=90  × 0.3925 = 35.33
  Construction:  IPI=105 × 0.1741 = 18.28
  IPI Total = 47.97 + 35.33 + 18.28 = 101.58 (+1.58%)
```

---

## 9. Méthodologie IPI

### Étape 1 : Collecte
- Enquêtes trimestrielles auprès des entreprises (1 000 à 5 000)
- Statistiques administratives (douanes, services énergétiques, mines)
- Rapports INS officiels

### Étape 2 : Pondération
Chaque sous-secteur reçoit un poids basé sur sa part dans la valeur ajoutée industrielle totale.

### Étape 3 : Calcul par sous-secteur
```
IPI_i = (Production_i en période T / Production_i en base) × 100
```

### Étape 4 : Agrégation
```
IPI Total = Σ (IPI_i × Poids_i)
```

### Seuils et objectifs (matrice de suivi)

| Indicateur | Objectif / Seuil |
|------------|-----------------|
| IPI Total | +5% annuel par rapport à T1 2023 |
| IPI Manufacturier | +4% annuel |
| Part industrie dans PIB | Maintien > 20% |
| Valeur ajoutée industrielle | Croissance > 6% |
| Emplois industriels | Augmentation > 2% par an |
| Exportations industrielles | Croissance > 5% |
| Capacité de production | Minimum 70% |
| Investissements (FBCF) | Croissance > 5% |

---

**© ONCP — Observatoire National de la Compétitivité Pays — Guinée**
**Plateforme BIC-GN — Baromètre Industrie et Commerce**
