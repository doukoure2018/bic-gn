-- Table produits SIMPRIX avec images et prix par région
CREATE TABLE IF NOT EXISTS simprix_produits (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    unite VARCHAR(50),
    image_url VARCHAR(500),
    ordre INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS simprix_prix (
    id SERIAL PRIMARY KEY,
    produit_id INTEGER REFERENCES simprix_produits(id) ON DELETE CASCADE,
    region_code VARCHAR(50) NOT NULL,
    region_nom VARCHAR(100) NOT NULL,
    prix_plafond DECIMAL(15, 2),
    date_releve DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(produit_id, region_code, date_releve)
);

CREATE INDEX IF NOT EXISTS idx_simprix_prix_region ON simprix_prix(region_code);
CREATE INDEX IF NOT EXISTS idx_simprix_prix_date ON simprix_prix(date_releve);

-- Seed produits SIMPRIX
INSERT INTO simprix_produits (code, nom, unite, ordre) VALUES
('RIZ_5_50', 'Riz importé 5% brisures (50kg)', 'GNF/50kg', 1),
('RIZ_25_50', 'Riz importé 25% brisures (50kg)', 'GNF/50kg', 2),
('RIZ_5_25', 'Riz importé 5% brisures (25kg)', 'GNF/25kg', 3),
('HUILE_20', 'Huile végétale (20L)', 'GNF/20L', 4),
('OIGNON_25', 'Oignon (25kg)', 'GNF/25kg', 5),
('POULET_10', 'Poulet entier importé (10kg)', 'GNF/10kg', 6),
('CUISSE_10', 'Cuisse de poulet importé (10kg)', 'GNF/10kg', 7),
('SUCRE_50', 'Sucre (50kg)', 'GNF/50kg', 8),
('FARINE_50', 'Farine (50kg)', 'GNF/50kg', 9),
('LAIT_25', 'Lait en poudre (25kg)', 'GNF/25kg', 10)
ON CONFLICT (code) DO NOTHING;
