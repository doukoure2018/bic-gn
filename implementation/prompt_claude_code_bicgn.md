# PROMPT CLAUDE CODE - Projet BIC-GN
## Baromètre Industrie et Commerce - Guinée

---

## 📋 CONTEXTE DU PROJET

Tu dois créer une plateforme web complète appelée **BIC-GN** (Baromètre Industrie et Commerce - Guinée) pour l'Observatoire National de la Compétitivité Pays (ONCP). Cette plateforme permettra de suivre les indicateurs économiques de l'industrie et du commerce en Guinée.

### Objectifs de la plateforme :
- Afficher un tableau de bord avec les indicateurs économiques clés
- Gérer les indicateurs Industrie et Commerce
- Permettre aux entreprises de répondre à des enquêtes en ligne
- Publier des rapports et actualités
- Exporter les données en Excel/PDF
- Supporter le français et l'anglais

### Contraintes :
- Date de livraison : 1er mai 2026
- 1000 à 5000 entreprises ciblées pour les enquêtes
- 5 administrateurs avec 4 rôles différents
- Mise à jour trimestrielle des données

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technique (identique à DistCanal)

| Composant       | Technologie                      |
|-----------------|----------------------------------|
| Backend         | Python 3.12, FastAPI 0.115.6     |
| Frontend        | React 18.3.1, Vite 5.4.0        |
| Base de données | PostgreSQL 17.2                  |
| Styling         | Tailwind CSS 4.0                 |
| HTTP Client     | Axios 1.7.0                      |
| Graphiques      | Recharts 2.x                     |
| Export Excel    | openpyxl (backend)               |
| Export PDF      | WeasyPrint ou ReportLab          |
| Déploiement     | Docker + Docker Compose          |

---

## 📁 STRUCTURE DU PROJET

```
bicgn/
├── python-api/                 # Backend FastAPI
│   ├── app/
│   │   ├── main.py             # Point d'entrée, CORS, lifespan
│   │   ├── config.py           # Configuration (.env via pydantic-settings)
│   │   ├── database.py         # Pool asyncpg, exécution des migrations
│   │   ├── models/             # Schémas Pydantic (requests/responses)
│   │   │   ├── __init__.py
│   │   │   ├── user.py         # Modèles utilisateurs/partenaires
│   │   │   ├── indicateur.py   # Modèles indicateurs
│   │   │   ├── enquete.py      # Modèles enquêtes
│   │   │   ├── publication.py  # Modèles publications
│   │   │   └── actualite.py    # Modèles actualités
│   │   ├── routes/             # Endpoints API
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # Authentification
│   │   │   ├── admin.py        # Administration (users, config)
│   │   │   ├── indicateurs.py  # CRUD indicateurs
│   │   │   ├── barometre.py    # Dashboard, calculs IBIC
│   │   │   ├── enquetes.py     # Gestion enquêtes entreprises
│   │   │   ├── publications.py # Rapports, études
│   │   │   ├── actualites.py   # Articles, événements
│   │   │   └── export.py       # Export Excel/PDF
│   │   ├── security/           # JWT, OAuth2, middlewares
│   │   │   ├── __init__.py
│   │   │   ├── jwt_handler.py  # Génération/validation JWT
│   │   │   ├── auth_middleware.py # Middleware authentification
│   │   │   └── roles.py        # Gestion des rôles
│   │   ├── services/           # Logique métier
│   │   │   ├── __init__.py
│   │   │   ├── indicateur_service.py
│   │   │   ├── calcul_service.py    # Calculs IBIC, tendances
│   │   │   ├── enquete_service.py
│   │   │   ├── export_service.py    # Excel, PDF
│   │   │   └── email_service.py     # Notifications email
│   │   ├── utils/              # Utilitaires
│   │   │   ├── __init__.py
│   │   │   ├── validation.py
│   │   │   └── helpers.py
│   │   └── exceptions/         # Gestion d'erreurs
│   │       ├── __init__.py
│   │       └── handlers.py
│   ├── migrations/             # Scripts SQL
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_indicateurs.sql
│   │   ├── 003_create_valeurs.sql
│   │   ├── 004_create_enquetes.sql
│   │   ├── 005_create_publications.sql
│   │   ├── 006_create_actualites.sql
│   │   ├── 007_seed_indicateurs.sql
│   │   └── 008_seed_regions.sql
│   ├── logs/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── App.jsx             # Routeur, routes protégées
│   │   ├── main.jsx            # Point d'entrée
│   │   ├── index.css           # Styles globaux Tailwind
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Gestion auth globale
│   │   │   └── LanguageContext.jsx # i18n FR/EN
│   │   ├── api/
│   │   │   ├── client.js       # Instance Axios configurée
│   │   │   ├── auth.js         # Appels API auth
│   │   │   ├── indicateurs.js  # Appels API indicateurs
│   │   │   ├── barometre.js    # Appels API dashboard
│   │   │   ├── enquetes.js     # Appels API enquêtes
│   │   │   ├── publications.js
│   │   │   └── actualites.js
│   │   ├── components/
│   │   │   ├── common/         # Composants réutilisables
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── LanguageSwitch.jsx
│   │   │   ├── charts/         # Composants graphiques
│   │   │   │   ├── LineChart.jsx
│   │   │   │   ├── BarChart.jsx
│   │   │   │   ├── PieChart.jsx
│   │   │   │   └── TrendIndicator.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── IBICGauge.jsx
│   │   │   │   └── RegionMap.jsx
│   │   │   └── forms/
│   │   │       ├── EnqueteForm.jsx
│   │   │       └── IndicateurForm.jsx
│   │   ├── pages/
│   │   │   ├── public/         # Pages accessibles sans auth
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── AboutPage.jsx
│   │   │   │   ├── BarometreIndustriePage.jsx
│   │   │   │   ├── BarometreCommercePage.jsx
│   │   │   │   ├── DonneesPage.jsx
│   │   │   │   ├── PublicationsPage.jsx
│   │   │   │   ├── ActualitesPage.jsx
│   │   │   │   ├── PartenairesPage.jsx
│   │   │   │   ├── ContactPage.jsx
│   │   │   │   └── EnquetePublicPage.jsx  # Formulaire entreprises
│   │   │   ├── admin/          # Pages protégées (back-office)
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── DashboardAdminPage.jsx
│   │   │   │   ├── UsersPage.jsx
│   │   │   │   ├── IndicateursPage.jsx
│   │   │   │   ├── ValeursPage.jsx
│   │   │   │   ├── EnquetesAdminPage.jsx
│   │   │   │   ├── PublicationsAdminPage.jsx
│   │   │   │   ├── ActualitesAdminPage.jsx
│   │   │   │   └── ExportPage.jsx
│   │   │   └── errors/
│   │   │       ├── NotFoundPage.jsx
│   │   │       └── UnauthorizedPage.jsx
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx    # Header, Footer public
│   │   │   └── AdminLayout.jsx     # Sidebar, Topbar admin
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useLanguage.js
│   │   └── utils/
│   │       ├── formatters.js   # Formatage nombres, dates
│   │       ├── constants.js
│   │       └── i18n.js         # Traductions FR/EN
│   ├── public/
│   │   ├── images/
│   │   └── locales/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 🗄️ BASE DE DONNÉES - SCHÉMA COMPLET

### Table `users` (Utilisateurs/Administrateurs)

```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'editeur', 'validateur', 'lecteur')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    phone VARCHAR(20),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `secteurs`

```sql
CREATE TABLE secteurs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,  -- 'IND' ou 'COM'
    nom VARCHAR(50) NOT NULL,           -- 'Industrie' ou 'Commerce'
    nom_en VARCHAR(50),                 -- 'Industry' ou 'Trade'
    description TEXT,
    description_en TEXT,
    icone VARCHAR(50),                  -- Nom de l'icône Lucide
    couleur VARCHAR(7)                  -- Code HEX (#16a34a pour vert, #dc2626 pour rouge)
);
```

### Table `categories`

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    secteur_id INTEGER REFERENCES secteurs(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    nom_en VARCHAR(100),
    ordre INTEGER DEFAULT 0
);

-- Exemples catégories Industrie : Production, Investissements, Emploi, Exportations, Coûts, Climat, Perspectives
-- Exemples catégories Commerce : Commerce intérieur, Commerce extérieur, Prix, Stocks, Contraintes, Perspectives
```

### Table `indicateurs`

```sql
CREATE TABLE indicateurs (
    id SERIAL PRIMARY KEY,
    categorie_id INTEGER REFERENCES categories(id),
    code VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    nom_en VARCHAR(200),
    description TEXT,
    description_en TEXT,
    unite VARCHAR(50) NOT NULL,         -- '%', 'GNF', 'Mrd GNF', 'unités', 'indice'
    type_calcul VARCHAR(20) DEFAULT 'valeur', -- 'valeur', 'indice', 'pourcentage', 'variation'
    formule TEXT,                        -- Formule de calcul si applicable
    source VARCHAR(100),                 -- INS, BCRG, Enquête, etc.
    periodicite VARCHAR(20) DEFAULT 'trimestriel', -- mensuel, trimestriel, annuel
    est_actif BOOLEAN DEFAULT true,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `regions`

```sql
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    nom_en VARCHAR(100),
    geojson JSONB,                       -- Données géographiques pour la carte
    population INTEGER,
    superficie DECIMAL(10,2)
);

-- Régions : Conakry, Boké, Faranah, Kankan, Kindia, Labé, Mamou, N'Zérékoré + National
```

### Table `periodes`

```sql
CREATE TABLE periodes (
    id SERIAL PRIMARY KEY,
    annee INTEGER NOT NULL,
    trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    est_publie BOOLEAN DEFAULT false,
    date_publication TIMESTAMP,
    UNIQUE(annee, trimestre)
);
```

### Table `valeurs` (Données des indicateurs)

```sql
CREATE TABLE valeurs (
    id SERIAL PRIMARY KEY,
    indicateur_id INTEGER REFERENCES indicateurs(id) ON DELETE CASCADE,
    periode_id INTEGER REFERENCES periodes(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id),  -- NULL = niveau national
    valeur DECIMAL(15, 2) NOT NULL,
    valeur_precedente DECIMAL(15, 2),
    variation DECIMAL(8, 2),                   -- Variation en %
    tendance VARCHAR(10) CHECK (tendance IN ('hausse', 'baisse', 'stable')),
    statut VARCHAR(20) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'valide', 'publie')),
    source_donnee VARCHAR(100),
    notes TEXT,
    saisi_par VARCHAR(50) REFERENCES users(id),
    valide_par VARCHAR(50) REFERENCES users(id),
    date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP,
    UNIQUE(indicateur_id, periode_id, region_id)
);
```

### Table `indice_ibic` (Indice synthétique)

```sql
CREATE TABLE indice_ibic (
    id SERIAL PRIMARY KEY,
    periode_id INTEGER REFERENCES periodes(id),
    secteur_id INTEGER REFERENCES secteurs(id),  -- NULL = global
    region_id INTEGER REFERENCES regions(id),     -- NULL = national
    valeur DECIMAL(5, 2) NOT NULL,               -- Score 0-100
    variation DECIMAL(5, 2),
    tendance VARCHAR(10),
    interpretation VARCHAR(20) CHECK (interpretation IN ('bon', 'stable', 'mauvais')),
    composantes JSONB,                            -- Détail des composantes
    UNIQUE(periode_id, secteur_id, region_id)
);
```

### Table `entreprises` (Pour les enquêtes)

```sql
CREATE TABLE entreprises (
    id SERIAL PRIMARY KEY,
    raison_sociale VARCHAR(200) NOT NULL,
    secteur_id INTEGER REFERENCES secteurs(id),
    sous_secteur VARCHAR(100),
    region_id INTEGER REFERENCES regions(id),
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(100),
    contact_nom VARCHAR(100),
    contact_fonction VARCHAR(100),
    taille VARCHAR(20) CHECK (taille IN ('TPE', 'PME', 'GE')),
    effectif INTEGER,
    chiffre_affaires DECIMAL(15, 2),
    est_actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `enquetes`

```sql
CREATE TABLE enquetes (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    titre_en VARCHAR(200),
    description TEXT,
    description_en TEXT,
    secteur_id INTEGER REFERENCES secteurs(id),
    periode_id INTEGER REFERENCES periodes(id),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'active', 'cloturee', 'archivee')),
    questions JSONB NOT NULL,                    -- Structure des questions
    nombre_cibles INTEGER DEFAULT 0,
    nombre_reponses INTEGER DEFAULT 0,
    created_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `reponses_enquete`

```sql
CREATE TABLE reponses_enquete (
    id SERIAL PRIMARY KEY,
    enquete_id INTEGER REFERENCES enquetes(id) ON DELETE CASCADE,
    entreprise_id INTEGER REFERENCES entreprises(id),
    token_acces VARCHAR(100) UNIQUE,             -- Token unique pour répondre
    reponses JSONB NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'complete', 'valide')),
    ip_address VARCHAR(45),
    date_debut TIMESTAMP,
    date_soumission TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `publications`

```sql
CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(300) NOT NULL,
    titre_en VARCHAR(300),
    type VARCHAR(50) NOT NULL CHECK (type IN ('rapport', 'note_conjoncture', 'etude', 'bulletin', 'methodologie')),
    secteur_id INTEGER REFERENCES secteurs(id),  -- NULL = transversal
    periode_id INTEGER REFERENCES periodes(id),
    resume TEXT,
    resume_en TEXT,
    fichier_url VARCHAR(500),                    -- Chemin vers le PDF
    fichier_url_en VARCHAR(500),
    image_couverture VARCHAR(500),
    est_publie BOOLEAN DEFAULT false,
    date_publication DATE,
    nombre_telechargements INTEGER DEFAULT 0,
    created_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `actualites`

```sql
CREATE TABLE actualites (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(300) NOT NULL,
    titre_en VARCHAR(300),
    slug VARCHAR(300) UNIQUE NOT NULL,
    categorie VARCHAR(50) CHECK (categorie IN ('economie', 'industrie', 'commerce', 'evenement', 'communique', 'reforme')),
    contenu TEXT NOT NULL,
    contenu_en TEXT,
    extrait VARCHAR(500),
    extrait_en VARCHAR(500),
    image_url VARCHAR(500),
    est_publie BOOLEAN DEFAULT false,
    est_vedette BOOLEAN DEFAULT false,           -- Mise en avant
    date_publication TIMESTAMP,
    auteur VARCHAR(100),
    tags JSONB,
    vues INTEGER DEFAULT 0,
    created_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `partenaires`

```sql
CREATE TABLE partenaires (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    nom_en VARCHAR(200),
    type VARCHAR(50) CHECK (type IN ('ministere', 'institution', 'organisme', 'bailleur', 'prive')),
    description TEXT,
    description_en TEXT,
    logo_url VARCHAR(500),
    site_web VARCHAR(300),
    ordre INTEGER DEFAULT 0,
    est_actif BOOLEAN DEFAULT true
);
```

### Table `contacts`

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    organisation VARCHAR(200),
    sujet VARCHAR(200),
    message TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'traite', 'archive')),
    reponse TEXT,
    repondu_par VARCHAR(50) REFERENCES users(id),
    date_reponse TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `logs_activite`

```sql
CREATE TABLE logs_activite (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entite VARCHAR(50),                          -- 'indicateur', 'valeur', 'publication', etc.
    entite_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 ENDPOINTS API

### Auth (`/api/auth`)

| Méthode | Endpoint              | Description                     | Auth |
|---------|-----------------------|---------------------------------|------|
| POST    | `/api/auth/login`     | Connexion (email + password)    | Non  |
| POST    | `/api/auth/logout`    | Déconnexion                     | Oui  |
| GET     | `/api/auth/me`        | Infos utilisateur connecté      | Oui  |
| PUT     | `/api/auth/password`  | Changer mot de passe            | Oui  |

### Administration (`/api/admin`) - Rôle super_admin uniquement

| Méthode | Endpoint                        | Description                     |
|---------|---------------------------------|---------------------------------|
| GET     | `/api/admin/users`              | Liste des utilisateurs          |
| POST    | `/api/admin/users`              | Créer un utilisateur            |
| GET     | `/api/admin/users/{id}`         | Détails utilisateur             |
| PUT     | `/api/admin/users/{id}`         | Modifier utilisateur            |
| DELETE  | `/api/admin/users/{id}`         | Désactiver utilisateur          |
| GET     | `/api/admin/logs`               | Logs d'activité                 |
| GET     | `/api/admin/stats`              | Statistiques globales           |

### Indicateurs (`/api/indicateurs`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/indicateurs`                    | Liste des indicateurs           | Non  |
| GET     | `/api/indicateurs/{id}`               | Détail indicateur               | Non  |
| POST    | `/api/indicateurs`                    | Créer indicateur                | Oui (editeur+) |
| PUT     | `/api/indicateurs/{id}`               | Modifier indicateur             | Oui (editeur+) |
| DELETE  | `/api/indicateurs/{id}`               | Supprimer indicateur            | Oui (super_admin) |
| GET     | `/api/indicateurs/secteur/{code}`     | Indicateurs par secteur         | Non  |
| GET     | `/api/indicateurs/categorie/{id}`     | Indicateurs par catégorie       | Non  |

### Valeurs (`/api/valeurs`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/valeurs`                        | Liste avec filtres              | Non  |
| POST    | `/api/valeurs`                        | Saisir une valeur               | Oui (editeur+) |
| PUT     | `/api/valeurs/{id}`                   | Modifier valeur                 | Oui (editeur+) |
| POST    | `/api/valeurs/{id}/valider`           | Valider une valeur              | Oui (validateur+) |
| POST    | `/api/valeurs/import`                 | Import Excel                    | Oui (editeur+) |
| GET     | `/api/valeurs/indicateur/{id}/series` | Série temporelle                | Non  |
| GET     | `/api/valeurs/periode/{id}`           | Valeurs d'une période           | Non  |

### Baromètre / Dashboard (`/api/barometre`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/barometre/dashboard`            | Données dashboard accueil       | Non  |
| GET     | `/api/barometre/ibic`                 | Indice IBIC actuel              | Non  |
| GET     | `/api/barometre/ibic/evolution`       | Évolution IBIC                  | Non  |
| GET     | `/api/barometre/industrie`            | Dashboard Industrie             | Non  |
| GET     | `/api/barometre/commerce`             | Dashboard Commerce              | Non  |
| GET     | `/api/barometre/regions`              | Données par région              | Non  |
| GET     | `/api/barometre/comparaison`          | Industrie vs Commerce           | Non  |
| GET     | `/api/barometre/contraintes`          | Analyse des contraintes         | Non  |
| GET     | `/api/barometre/perspectives`         | Perspectives économiques        | Non  |

### Enquêtes (`/api/enquetes`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/enquetes`                       | Liste enquêtes                  | Oui  |
| POST    | `/api/enquetes`                       | Créer enquête                   | Oui (editeur+) |
| GET     | `/api/enquetes/{id}`                  | Détail enquête                  | Oui  |
| PUT     | `/api/enquetes/{id}`                  | Modifier enquête                | Oui (editeur+) |
| POST    | `/api/enquetes/{id}/lancer`           | Lancer enquête                  | Oui (validateur+) |
| POST    | `/api/enquetes/{id}/cloturer`         | Clôturer enquête                | Oui (validateur+) |
| GET     | `/api/enquetes/{id}/reponses`         | Liste réponses                  | Oui  |
| GET     | `/api/enquetes/{id}/statistiques`     | Stats de l'enquête              | Oui  |
| GET     | `/api/enquetes/public/{token}`        | Accès formulaire (entreprise)   | Non  |
| POST    | `/api/enquetes/public/{token}`        | Soumettre réponse               | Non  |

### Publications (`/api/publications`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/publications`                   | Liste publications              | Non  |
| GET     | `/api/publications/{id}`              | Détail publication              | Non  |
| POST    | `/api/publications`                   | Créer publication               | Oui (editeur+) |
| PUT     | `/api/publications/{id}`              | Modifier publication            | Oui (editeur+) |
| DELETE  | `/api/publications/{id}`              | Supprimer publication           | Oui (super_admin) |
| POST    | `/api/publications/{id}/publier`      | Publier                         | Oui (validateur+) |
| GET     | `/api/publications/{id}/telecharger`  | Télécharger PDF                 | Non  |

### Actualités (`/api/actualites`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/actualites`                     | Liste actualités                | Non  |
| GET     | `/api/actualites/{slug}`              | Détail par slug                 | Non  |
| POST    | `/api/actualites`                     | Créer actualité                 | Oui (editeur+) |
| PUT     | `/api/actualites/{id}`                | Modifier actualité              | Oui (editeur+) |
| DELETE  | `/api/actualites/{id}`                | Supprimer actualité             | Oui (super_admin) |
| POST    | `/api/actualites/{id}/publier`        | Publier                         | Oui (validateur+) |

### Export (`/api/export`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/export/indicateurs/excel`       | Export indicateurs Excel        | Non  |
| GET     | `/api/export/valeurs/excel`           | Export valeurs Excel            | Non  |
| POST    | `/api/export/rapport/pdf`             | Générer rapport PDF             | Oui  |
| GET     | `/api/export/donnees/{secteur}`       | Export données secteur          | Non  |

### Référentiels (`/api/ref`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| GET     | `/api/ref/secteurs`                   | Liste secteurs                  | Non  |
| GET     | `/api/ref/categories`                 | Liste catégories                | Non  |
| GET     | `/api/ref/regions`                    | Liste régions                   | Non  |
| GET     | `/api/ref/periodes`                   | Liste périodes                  | Non  |
| GET     | `/api/ref/partenaires`                | Liste partenaires               | Non  |

### Contact (`/api/contact`)

| Méthode | Endpoint                              | Description                     | Auth |
|---------|---------------------------------------|---------------------------------|------|
| POST    | `/api/contact`                        | Envoyer message                 | Non  |
| GET     | `/api/contact/messages`               | Liste messages                  | Oui  |
| PUT     | `/api/contact/messages/{id}`          | Traiter message                 | Oui  |

---

## 🔐 AUTHENTIFICATION ET RÔLES

### Rôles et Permissions

| Rôle          | Permissions                                              |
|---------------|----------------------------------------------------------|
| super_admin   | Accès total, gestion utilisateurs, suppression           |
| editeur       | Saisie, modification données, création contenu           |
| validateur    | Validation données, publication contenu                  |
| lecteur       | Consultation back-office uniquement                      |

### Flux JWT

```
1. POST /api/auth/login avec email + password
2. Vérification credentials dans table users
3. Génération JWT (HS256) avec expiration 24h
4. Payload : { user_id, email, role, exp }
5. Frontend stocke dans localStorage
6. Header : Authorization: Bearer <token>
7. Middleware vérifie et extrait le user
```

---

## 🎨 FRONTEND - PAGES ET COMPOSANTS

### Pages Publiques

| Page                      | Route                      | Description                           |
|---------------------------|----------------------------|---------------------------------------|
| HomePage                  | `/`                        | Accueil avec dashboard synthétique    |
| AboutPage                 | `/a-propos`                | Présentation ONCP, méthodologie       |
| BarometreIndustriePage    | `/barometre/industrie`     | Dashboard complet Industrie           |
| BarometreCommercePage     | `/barometre/commerce`      | Dashboard complet Commerce            |
| DonneesPage               | `/donnees`                 | Exploration données, téléchargement   |
| PublicationsPage          | `/publications`            | Liste des publications                |
| PublicationDetailPage     | `/publications/:id`        | Détail publication                    |
| ActualitesPage            | `/actualites`              | Liste des actualités                  |
| ActualiteDetailPage       | `/actualites/:slug`        | Détail actualité                      |
| PartenairesPage           | `/partenaires`             | Liste des partenaires                 |
| ContactPage               | `/contact`                 | Formulaire de contact                 |
| EnquetePublicPage         | `/enquete/:token`          | Formulaire réponse entreprise         |

### Pages Admin (Protégées)

| Page                      | Route                      | Rôles autorisés                       |
|---------------------------|----------------------------|---------------------------------------|
| LoginPage                 | `/admin/login`             | Public                                |
| DashboardAdminPage        | `/admin`                   | Tous                                  |
| UsersPage                 | `/admin/utilisateurs`      | super_admin                           |
| IndicateursPage           | `/admin/indicateurs`       | editeur+                              |
| ValeursPage               | `/admin/valeurs`           | editeur+                              |
| EnquetesAdminPage         | `/admin/enquetes`          | editeur+                              |
| PublicationsAdminPage     | `/admin/publications`      | editeur+                              |
| ActualitesAdminPage       | `/admin/actualites`        | editeur+                              |
| ExportPage                | `/admin/export`            | Tous                                  |

### Composants Clés

#### KPICard
```jsx
// Carte indicateur avec valeur, tendance et variation
<KPICard
  titre="Indice IBIC"
  valeur={58}
  unite=""
  tendance="stable"        // hausse, baisse, stable
  variation={2.5}
  couleur="blue"
  icone={TrendingUp}
/>
```

#### LineChart (Recharts)
```jsx
// Graphique évolution temporelle
<LineChart
  data={[{ periode: 'T1 2024', industrie: 52, commerce: 61 }, ...]}
  lignes={[
    { cle: 'industrie', couleur: '#16a34a', nom: 'Industrie' },
    { cle: 'commerce', couleur: '#dc2626', nom: 'Commerce' }
  ]}
/>
```

#### DataTable
```jsx
// Tableau de données avec tri, filtre, export
<DataTable
  colonnes={[...]}
  donnees={[...]}
  filtrable
  triable
  exportable
  pagination
/>
```

---

## 🌐 INTERNATIONALISATION (FR/EN)

### Structure des traductions

```javascript
// utils/i18n.js
export const translations = {
  fr: {
    nav: {
      accueil: 'Accueil',
      apropos: 'À propos',
      industrie: 'Industrie',
      commerce: 'Commerce',
      donnees: 'Données',
      publications: 'Publications',
      actualites: 'Actualités',
      partenaires: 'Partenaires',
      contact: 'Contact'
    },
    dashboard: {
      titre: 'Baromètre Industrie et Commerce',
      sousTitre: 'Suivi de la performance économique nationale',
      indiceIBIC: 'Indice IBIC',
      secteurIndustrie: 'Secteur Industrie',
      secteurCommerce: 'Secteur Commerce',
      enHausse: 'En Hausse',
      enBaisse: 'En Baisse',
      stable: 'Stable',
      // ...
    },
    // ...
  },
  en: {
    nav: {
      accueil: 'Home',
      apropos: 'About',
      industrie: 'Industry',
      commerce: 'Trade',
      donnees: 'Data',
      publications: 'Publications',
      actualites: 'News',
      partenaires: 'Partners',
      contact: 'Contact'
    },
    // ...
  }
};
```

### LanguageContext

```jsx
// context/LanguageContext.jsx
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('fr');
  const t = (key) => /* récupère la traduction */;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

---

## 📊 CALCUL DE L'INDICE IBIC

### Formule

L'Indice du Baromètre Industrie et Commerce (IBIC) est calculé comme suit :

```python
def calculer_ibic(valeurs: dict) -> float:
    """
    Calcule l'indice IBIC basé sur les indicateurs pondérés.

    Composantes (pondérations) :
    - Production / Ventes : 20%
    - Chiffre d'affaires : 15%
    - Investissements : 15%
    - Emploi : 15%
    - Exportations : 10%
    - Stocks : 5%
    - Trésorerie : 10%
    - Perspectives : 10%

    Retourne un score de 0 à 100.
    """
    ponderations = {
        'production': 0.20,
        'chiffre_affaires': 0.15,
        'investissements': 0.15,
        'emploi': 0.15,
        'exportations': 0.10,
        'stocks': 0.05,
        'tresorerie': 0.10,
        'perspectives': 0.10
    }

    ibic = sum(valeurs.get(k, 50) * v for k, v in ponderations.items())
    return round(ibic, 2)
```

### Interprétation

| Score      | Interprétation | Couleur |
|------------|----------------|---------|
| 0-40       | Mauvais        | Rouge   |
| 40-60      | Stable         | Orange  |
| 60-100     | Bon            | Vert    |

---

## 🎨 CHARTE GRAPHIQUE

### Couleurs (inspirées du drapeau guinéen)

```css
:root {
  /* Couleurs principales */
  --color-primary: #1a365d;      /* Bleu marine (header/footer) */
  --color-industrie: #16a34a;    /* Vert (Industrie) */
  --color-commerce: #dc2626;     /* Rouge (Commerce) */
  --color-accent: #eab308;       /* Jaune/Or (accent) */

  /* Couleurs secondaires */
  --color-bg-light: #f0f7ff;     /* Fond clair */
  --color-text: #1f2937;         /* Texte principal */
  --color-text-light: #6b7280;   /* Texte secondaire */

  /* Tendances */
  --color-hausse: #16a34a;       /* Vert */
  --color-baisse: #dc2626;       /* Rouge */
  --color-stable: #f59e0b;       /* Orange */

  /* États */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Typographie

```css
/* Police principale */
font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;

/* Tailles */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
```

---

## 🐳 DOCKER

### docker-compose.yml

```yaml
version: '3.8'

services:
  bicgn-api:
    build:
      context: ./python-api
      dockerfile: Dockerfile
    container_name: bicgn-api
    ports:
      - "8091:8000"
    environment:
      - DATABASE_URL=postgresql://bicgn:bicgn_password@bicgn-postgres:5432/bicgn_db
    depends_on:
      - bicgn-postgres
    volumes:
      - ./python-api/logs:/app/logs
      - ./python-api/uploads:/app/uploads
    restart: unless-stopped

  bicgn-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: bicgn-frontend
    ports:
      - "3000:80"
    depends_on:
      - bicgn-api
    restart: unless-stopped

  bicgn-postgres:
    image: postgres:17.2-alpine
    container_name: bicgn-postgres
    environment:
      POSTGRES_USER: bicgn
      POSTGRES_PASSWORD: bicgn_password
      POSTGRES_DB: bicgn_db
    ports:
      - "5435:5432"
    volumes:
      - bicgn-postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  bicgn-postgres-data:
```

---

## 📋 DONNÉES INITIALES (SEED)

### Indicateurs Industrie

```sql
-- Catégorie : Production
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source) VALUES
(1, 'IND_PROD_IDX', 'Indice de production industrielle', 'Industrial Production Index', 'indice', 'INS'),
(1, 'IND_PROD_CAP', 'Taux d''utilisation des capacités', 'Capacity Utilization Rate', '%', 'Enquête'),
(1, 'IND_PROD_VOL', 'Volume de production', 'Production Volume', 'unités', 'Enquête'),
(1, 'IND_PROD_CMD', 'Commandes reçues', 'Orders Received', 'indice', 'Enquête');

-- Catégorie : Investissements
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source) VALUES
(2, 'IND_INV_MNT', 'Montant des investissements', 'Investment Amount', 'Mrd GNF', 'INS'),
(2, 'IND_INV_ACC', 'Accès au financement', 'Access to Finance', 'indice', 'Enquête'),
(2, 'IND_INV_PRJ', 'Projets industriels', 'Industrial Projects', 'nombre', 'Ministère');

-- etc. pour toutes les catégories...
```

### Régions de Guinée

```sql
INSERT INTO regions (code, nom, nom_en) VALUES
('NAT', 'National', 'National'),
('CKY', 'Conakry', 'Conakry'),
('BOK', 'Boké', 'Boké'),
('FAR', 'Faranah', 'Faranah'),
('KAN', 'Kankan', 'Kankan'),
('KIN', 'Kindia', 'Kindia'),
('LAB', 'Labé', 'Labé'),
('MAM', 'Mamou', 'Mamou'),
('NZE', 'N''Zérékoré', 'N''Zérékoré');
```

---

## ✅ CHECKLIST DE DÉVELOPPEMENT

### Phase 1 : Setup (Semaine 1)
- [ ] Initialiser le projet Python-API avec FastAPI
- [ ] Initialiser le projet Frontend avec Vite + React
- [ ] Configurer PostgreSQL et les migrations
- [ ] Implémenter l'authentification JWT
- [ ] Créer les modèles de base (users, secteurs, catégories)

### Phase 2 : Backend Core (Semaine 2)
- [ ] CRUD Indicateurs
- [ ] CRUD Valeurs avec validation workflow
- [ ] Service calcul IBIC
- [ ] API Baromètre / Dashboard
- [ ] Import Excel
- [ ] Export Excel/PDF

### Phase 3 : Frontend Public (Semaine 3)
- [ ] Layout public (Header, Footer)
- [ ] Page Accueil avec dashboard KPIs
- [ ] Pages Baromètre Industrie / Commerce
- [ ] Page Données avec filtres et export
- [ ] Pages Publications et Actualités
- [ ] Internationalisation FR/EN

### Phase 4 : Backend Métier (Semaine 3)
- [ ] Module Enquêtes
- [ ] Module Publications
- [ ] Module Actualités
- [ ] Notifications email

### Phase 5 : Frontend Admin (Semaine 4)
- [ ] Layout Admin (Sidebar, Topbar)
- [ ] Dashboard Admin
- [ ] Gestion Utilisateurs
- [ ] Gestion Indicateurs et Valeurs
- [ ] Gestion Enquêtes
- [ ] Gestion Publications / Actualités

### Phase 6 : Finalisation (Semaine 4)
- [ ] Tests
- [ ] Optimisations performance
- [ ] Documentation API
- [ ] Docker et déploiement
- [ ] Formation utilisateurs

---

## 🚀 COMMANDES DE DÉMARRAGE

### Backend
```bash
cd python-api
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8091
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up -d --build
```

---

FIN DU PROMPT CLAUDE CODE