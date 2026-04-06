CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    nom_en VARCHAR(100),
    geojson JSONB,
    population INTEGER,
    superficie DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS periodes (
    id SERIAL PRIMARY KEY,
    annee INTEGER NOT NULL,
    trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    est_publie BOOLEAN DEFAULT false,
    date_publication TIMESTAMP,
    UNIQUE(annee, trimestre)
);

CREATE TABLE IF NOT EXISTS valeurs (
    id SERIAL PRIMARY KEY,
    indicateur_id INTEGER REFERENCES indicateurs(id) ON DELETE CASCADE,
    periode_id INTEGER REFERENCES periodes(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id),
    valeur DECIMAL(15, 2) NOT NULL,
    valeur_precedente DECIMAL(15, 2),
    variation DECIMAL(8, 2),
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

CREATE TABLE IF NOT EXISTS indice_ibic (
    id SERIAL PRIMARY KEY,
    periode_id INTEGER REFERENCES periodes(id),
    secteur_id INTEGER REFERENCES secteurs(id),
    region_id INTEGER REFERENCES regions(id),
    valeur DECIMAL(5, 2) NOT NULL,
    variation DECIMAL(5, 2),
    tendance VARCHAR(10),
    interpretation VARCHAR(20) CHECK (interpretation IN ('bon', 'stable', 'mauvais')),
    composantes JSONB,
    UNIQUE(periode_id, secteur_id, region_id)
);
