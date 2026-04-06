CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(300) NOT NULL,
    titre_en VARCHAR(300),
    type VARCHAR(50) NOT NULL CHECK (type IN ('rapport', 'note_conjoncture', 'etude', 'bulletin', 'methodologie')),
    secteur_id INTEGER REFERENCES secteurs(id),
    periode_id INTEGER REFERENCES periodes(id),
    resume TEXT,
    resume_en TEXT,
    fichier_url VARCHAR(500),
    fichier_url_en VARCHAR(500),
    image_couverture VARCHAR(500),
    est_publie BOOLEAN DEFAULT false,
    date_publication DATE,
    nombre_telechargements INTEGER DEFAULT 0,
    created_by VARCHAR(50) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
