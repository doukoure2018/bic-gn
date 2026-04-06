-- Table des prix des produits (SIMPRIX et autres sources)
CREATE TABLE IF NOT EXISTS prix_produits (
    id SERIAL PRIMARY KEY,
    code_produit VARCHAR(50) NOT NULL,
    nom_produit VARCHAR(200) NOT NULL,
    categorie VARCHAR(50) CHECK (categorie IN ('alimentaire', 'energie', 'construction', 'transport', 'autre')),
    prix_plafond DECIMAL(15, 2),
    prix_marche DECIMAL(15, 2),
    unite VARCHAR(50),
    region_id INTEGER REFERENCES regions(id),
    date_releve DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'SIMPRIX',
    variation DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code_produit, region_id, date_releve)
);

CREATE INDEX IF NOT EXISTS idx_prix_date ON prix_produits(date_releve);
CREATE INDEX IF NOT EXISTS idx_prix_produit ON prix_produits(code_produit);

-- Seed produits SIMPRIX (denrées de première nécessité)
INSERT INTO prix_produits (code_produit, nom_produit, categorie, prix_plafond, prix_marche, unite, date_releve, source) VALUES
('RIZ_LOCAL', 'Riz local', 'alimentaire', 8500, 9000, 'GNF/kg', '2025-12-01', 'SIMPRIX'),
('RIZ_IMPORTE', 'Riz importé', 'alimentaire', 9500, 10200, 'GNF/kg', '2025-12-01', 'SIMPRIX'),
('HUILE_PALME', 'Huile de palme', 'alimentaire', 18000, 19500, 'GNF/litre', '2025-12-01', 'SIMPRIX'),
('SUCRE', 'Sucre', 'alimentaire', 12000, 12500, 'GNF/kg', '2025-12-01', 'SIMPRIX'),
('FARINE_BLE', 'Farine de blé', 'alimentaire', 11000, 11800, 'GNF/kg', '2025-12-01', 'SIMPRIX'),
('LAIT_POUDRE', 'Lait en poudre', 'alimentaire', 45000, 48000, 'GNF/400g', '2025-12-01', 'SIMPRIX'),
('CIMENT', 'Ciment (sac 50kg)', 'construction', 85000, 90000, 'GNF/sac', '2025-12-01', 'SIMPRIX'),
('ESSENCE', 'Essence', 'energie', 12000, 12000, 'GNF/litre', '2025-12-01', 'SIMPRIX'),
('GASOIL', 'Gasoil', 'energie', 12000, 12000, 'GNF/litre', '2025-12-01', 'SIMPRIX'),
('GAZ_BUTANE', 'Gaz butane (bouteille 12kg)', 'energie', 120000, 130000, 'GNF/bout.', '2025-12-01', 'SIMPRIX')
ON CONFLICT DO NOTHING;
