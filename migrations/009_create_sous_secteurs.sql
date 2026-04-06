-- Sous-secteurs industriels (classification ISIC)
CREATE TABLE IF NOT EXISTS sous_secteurs (
    id SERIAL PRIMARY KEY,
    secteur_id INTEGER REFERENCES secteurs(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    nom_en VARCHAR(200),
    code_isic VARCHAR(10),
    poids DECIMAL(5, 2),
    description TEXT,
    description_en TEXT,
    ordre INTEGER DEFAULT 0,
    est_actif BOOLEAN DEFAULT true
);

-- Contraintes des entreprises
CREATE TABLE IF NOT EXISTS contraintes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    nom_en VARCHAR(100),
    ordre INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contraintes_valeurs (
    id SERIAL PRIMARY KEY,
    contrainte_id INTEGER REFERENCES contraintes(id) ON DELETE CASCADE,
    secteur_id INTEGER REFERENCES secteurs(id),
    region_id INTEGER REFERENCES regions(id),
    periode_id INTEGER REFERENCES periodes(id),
    score DECIMAL(3, 1) NOT NULL CHECK (score BETWEEN 0 AND 5),
    nombre_repondants INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contrainte_id, secteur_id, region_id, periode_id)
);

-- Perspectives économiques
CREATE TABLE IF NOT EXISTS perspectives (
    id SERIAL PRIMARY KEY,
    secteur_id INTEGER REFERENCES secteurs(id),
    region_id INTEGER REFERENCES regions(id),
    periode_id INTEGER REFERENCES periodes(id),
    optimiste DECIMAL(5, 2) DEFAULT 0,
    stable DECIMAL(5, 2) DEFAULT 0,
    pessimiste DECIMAL(5, 2) DEFAULT 0,
    nombre_repondants INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(secteur_id, region_id, periode_id)
);

-- Sources de données externes
CREATE TABLE IF NOT EXISTS sources_externes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('api_auto', 'api_semi', 'import_manuel', 'scraping')),
    url_base VARCHAR(500),
    description TEXT,
    api_key VARCHAR(500),
    est_actif BOOLEAN DEFAULT true,
    derniere_sync TIMESTAMP,
    config JSONB DEFAULT '{}'
);

-- Données récupérées des sources externes
CREATE TABLE IF NOT EXISTS donnees_externes (
    id SERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES sources_externes(id) ON DELETE CASCADE,
    indicateur_code VARCHAR(100) NOT NULL,
    indicateur_nom VARCHAR(300),
    pays VARCHAR(10) DEFAULT 'GIN',
    annee INTEGER,
    trimestre INTEGER,
    valeur DECIMAL(20, 4),
    unite VARCHAR(50),
    date_donnee DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_id, indicateur_code, annee, trimestre)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_donnees_ext_source ON donnees_externes(source_id);
CREATE INDEX IF NOT EXISTS idx_donnees_ext_code ON donnees_externes(indicateur_code);
CREATE INDEX IF NOT EXISTS idx_donnees_ext_annee ON donnees_externes(annee);
CREATE INDEX IF NOT EXISTS idx_contraintes_val_periode ON contraintes_valeurs(periode_id);
