CREATE TABLE IF NOT EXISTS actualites (
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
    est_vedette BOOLEAN DEFAULT false,
    date_publication TIMESTAMP,
    auteur VARCHAR(100),
    tags JSONB,
    vues INTEGER DEFAULT 0,
    created_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partenaires (
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

CREATE TABLE IF NOT EXISTS contacts (
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

CREATE TABLE IF NOT EXISTS logs_activite (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entite VARCHAR(50),
    entite_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
