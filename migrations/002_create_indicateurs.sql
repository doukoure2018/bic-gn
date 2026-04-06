CREATE TABLE IF NOT EXISTS secteurs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    nom VARCHAR(50) NOT NULL,
    nom_en VARCHAR(50),
    description TEXT,
    description_en TEXT,
    icone VARCHAR(50),
    couleur VARCHAR(7)
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    secteur_id INTEGER REFERENCES secteurs(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    nom_en VARCHAR(100),
    ordre INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS indicateurs (
    id SERIAL PRIMARY KEY,
    categorie_id INTEGER REFERENCES categories(id),
    code VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    nom_en VARCHAR(200),
    description TEXT,
    description_en TEXT,
    unite VARCHAR(50) NOT NULL,
    type_calcul VARCHAR(20) DEFAULT 'valeur',
    formule TEXT,
    source VARCHAR(100),
    periodicite VARCHAR(20) DEFAULT 'trimestriel',
    est_actif BOOLEAN DEFAULT true,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
