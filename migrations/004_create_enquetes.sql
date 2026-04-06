CREATE TABLE IF NOT EXISTS entreprises (
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

CREATE TABLE IF NOT EXISTS enquetes (
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
    questions JSONB NOT NULL,
    nombre_cibles INTEGER DEFAULT 0,
    nombre_reponses INTEGER DEFAULT 0,
    created_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reponses_enquete (
    id SERIAL PRIMARY KEY,
    enquete_id INTEGER REFERENCES enquetes(id) ON DELETE CASCADE,
    entreprise_id INTEGER REFERENCES entreprises(id),
    token_acces VARCHAR(100) UNIQUE,
    reponses JSONB NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'complete', 'valide')),
    ip_address VARCHAR(45),
    date_debut TIMESTAMP,
    date_soumission TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
