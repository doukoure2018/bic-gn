# 🎨 Prototype Visuel — Maquette UX/UI BIC-GN

> **Baromètre Industrie et Commerce – Guinée**

---

## 📋 Table des matières

1. [Maquette Page d'Accueil](#1-maquette--page-daccueil)
2. [Maquette Baromètre Industrie](#2-maquette--page-baromètre-industrie)
3. [Maquette Baromètre Commerce](#3-maquette--page-baromètre-commerce)
4. [Tableau de bord Global](#4-maquette--tableau-de-bord-global)
5. [Couleurs recommandées](#5-couleurs-recommandées)
6. [Composants UX](#6-composants-ux-à-prévoir)
7. [Structure visuelle](#7-structure-visuelle-du-site)
8. [Modules requis](#8-modules-requis)
9. [Menu final](#9-structure-finale-recommandée)

---

## 1. Maquette — Page d'Accueil

### Structure visuelle (de haut en bas)

---

### 🔷 Barre supérieure (Header)

**Contenu :**
- Logo ONCP
- Nom : *Baromètre Industrie & Commerce – Guinée*
- Menu :
  - Accueil
  - À propos
  - Baromètre
  - Données statistiques
  - Publications
  - Actualités
  - Partenaires
  - Contact
- Bouton : **Télécharger le rapport**

---

### 🔷 Bannière principale

Grand visuel (ville industrielle, port, commerce, etc.)

**Texte au centre :**
> **Baromètre Industrie et Commerce de la Guinée**  
> *Suivi trimestriel de la performance économique*

**Boutons :**
- 🟢 Consulter Industrie
- 🔴 Consulter Commerce
- 📥 Télécharger Rapport

---

### 🔷 Tableau de bord rapide (cards KPI)

**Disposition en 5 blocs :**

| Indicateur | Valeur | Tendance |
|------------|--------|----------|
| Indice Industrie | **58** | ↑ |
| Indice Commerce | **62** | ↓ |
| Production industrielle | **+4%** | ↑ |
| Chiffre d'affaires commerce | **+2%** | → |
| Emploi | **-1%** | ↓ |

**Couleurs des cartes :**
- 🟢 Vert = amélioration
- 🟠 Orange = stable
- 🔴 Rouge = baisse
- 🔵 Bleu = indicateur neutre

---

### 🔷 Graphiques principaux

**Disposition en 2 colonnes :**

| Gauche | Droite |
|--------|--------|
| Évolution indice Industrie | Production industrielle |
| Évolution indice Commerce | Volume des ventes commerce |

---

### 🔷 Contraintes des entreprises

**Graphique en barres :**
- Électricité
- Fiscalité
- Transport
- Accès financement
- Douanes
- Informel

---

### 🔷 Perspectives

**Graphique :**
- 🟢 Optimistes
- 🟡 Stables
- 🔴 Pessimistes

---

### 🔷 Dernières publications

**Cartes avec :**
- Image couverture
- Titre
- Date
- Bouton Télécharger

---

### 🔷 Actualités

**Liste d'articles :**
- Réformes économiques
- Investissements
- Activités ONCP

---

### 🔷 Footer

- Contacts
- Email
- Téléphone
- Réseaux sociaux
- Partenaires
- Copyright ONCP

---

## 2. Maquette — Page Baromètre Industrie

### Structure

**Bandeau :** Baromètre Industrie – Guinée

**Filtres :**
- Année
- Trimestre
- Région
- Secteur industriel

**Tableau de bord Industrie (Cards) :**
- Production
- Investissements
- Emploi
- Exportations
- Trésorerie
- Commandes
- Stocks

**Graphiques :**
1. Production industrielle
2. Investissements
3. Emploi
4. Exportations
5. Contraintes
6. Perspectives

**Tableau des indicateurs :**
- Bouton Export Excel
- Bouton Export PDF

---

## 3. Maquette — Page Baromètre Commerce

Même structure que Industrie avec :
- Ventes
- Importations
- Exportations
- Prix
- Stocks
- Approvisionnement
- Douanes
- Informel

---

## 4. Maquette — Tableau de bord Global

### Structure idéale du Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│     Indice Global     │    Industrie    │    Commerce      │
├─────────────────────────────────────────────────────────────┤
│  Production  │   Ventes   │   Emploi   │   Exportations    │
├─────────────────────────────────────────────────────────────┤
│                 Graphique évolution globale                 │
├─────────────────────────────────────────────────────────────┤
│                  Industrie vs Commerce                      │
├─────────────────────────────────────────────────────────────┤
│                Contraintes entreprises                      │
├─────────────────────────────────────────────────────────────┤
│                     Perspectives                            │
├─────────────────────────────────────────────────────────────┤
│                   Carte régionale                           │
├─────────────────────────────────────────────────────────────┤
│                   Tableau données                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Couleurs recommandées

### Palette UX

| Couleur | Utilisation | Code HEX |
|---------|-------------|----------|
| 🟢 Vert | Croissance | `#16a34a` |
| 🔴 Rouge | Baisse | `#dc2626` |
| 🟠 Orange | Stable | `#f59e0b` |
| 🔵 Bleu | Institution | `#1a365d` |
| ⚪ Gris | Fond | `#f3f4f6` |
| ⬜ Blanc | Cartes | `#ffffff` |

### Palette inspirée du drapeau guinéen 🇬🇳

- 🔴 Rouge
- 🟡 Jaune
- 🟢 Vert

---

## 6. Composants UX à prévoir

### Interface utilisateur

- ✅ Cards indicateurs
- ✅ Graphiques interactifs
- ✅ Filtres dynamiques
- ✅ Téléchargement Excel/PDF
- ✅ Tableau dynamique
- ✅ Carte géographique
- ✅ Recherche données
- ✅ Menu latéral (dashboard)
- ✅ Notifications économiques

---

## 7. Structure visuelle du site

### Architecture UX

```
ACCUEIL
│
├── Tableau de bord
├── Indicateurs clés
├── Graphiques
├── Publications
└── Actualités

BAROMÈTRE
├── Industrie
│   ├── Production
│   ├── Investissements
│   ├── Emploi
│   ├── Exportations
│   ├── Contraintes
│   └── Perspectives
│
└── Commerce
    ├── Ventes
    ├── Importations
    ├── Prix
    ├── Stocks
    ├── Contraintes
    └── Perspectives

DONNÉES
PUBLICATIONS
ACTUALITÉS
PARTENAIRES
CONTACT
```

---

## 8. Modules requis

Pour une plateforme professionnelle :

- ✅ Dashboard interactif
- ✅ Base de données
- ✅ Module enquêtes entreprises
- ✅ Module publications
- ✅ Module actualités
- ✅ Administration
- ✅ Génération automatique du rapport Baromètre

---

## 9. Structure finale recommandée

### Menu final du site

```
├── Accueil
├── À propos
├── Baromètre
│   ├── Industrie
│   └── Commerce
├── Données statistiques
├── Tableau de bord
├── Publications
├── Actualités
├── Partenaires
├── Contact
└── Administration
```

---

**© ONCP - Observatoire National de la Compétitivité Pays - Guinée**
