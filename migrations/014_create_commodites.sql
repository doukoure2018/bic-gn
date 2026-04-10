-- Table des commodités internationales (Trading Economics)
CREATE TABLE IF NOT EXISTS commodites (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    nom_en VARCHAR(200),
    categorie VARCHAR(50) NOT NULL CHECK (categorie IN ('energie', 'metaux', 'agriculture')),
    prix DECIMAL(15, 4),
    unite VARCHAR(50),
    variation DECIMAL(8, 2),
    date_releve TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) DEFAULT 'Trading Economics',
    ordre INTEGER DEFAULT 0
);

-- Seed commodités
INSERT INTO commodites (code, nom, nom_en, categorie, unite, ordre) VALUES
('CRUDE_OIL', 'Pétrole brut', 'Crude Oil', 'energie', 'USD/Bbl', 1),
('BRENT', 'Brent', 'Brent', 'energie', 'USD/Bbl', 2),
('NATURAL_GAS', 'Gaz naturel', 'Natural Gas', 'energie', 'USD/MMBtu', 3),
('GASOLINE', 'Essence', 'Gasoline', 'energie', 'USD/Gal', 4),
('HEATING_OIL', 'Fioul', 'Heating Oil', 'energie', 'USD/Gal', 5),
('COAL', 'Charbon', 'Coal', 'energie', 'USD/T', 6),
('GOLD', 'Or', 'Gold', 'metaux', 'USD/oz', 1),
('SILVER', 'Argent', 'Silver', 'metaux', 'USD/oz', 2),
('COPPER', 'Cuivre', 'Copper', 'metaux', 'USD/Lbs', 3),
('PLATINUM', 'Platine', 'Platinum', 'metaux', 'USD/oz', 4),
('IRON_ORE', 'Minerai de fer', 'Iron Ore', 'metaux', 'USD/T', 5),
('ALUMINUM', 'Aluminium', 'Aluminum', 'metaux', 'USD/T', 6),
('LITHIUM', 'Lithium', 'Lithium', 'metaux', 'CNY/T', 7),
('WHEAT', 'Blé', 'Wheat', 'agriculture', 'USd/Bu', 1),
('RICE', 'Riz', 'Rice', 'agriculture', 'USD/cwt', 2),
('CORN', 'Maïs', 'Corn', 'agriculture', 'USd/Bu', 3),
('SOYBEANS', 'Soja', 'Soybeans', 'agriculture', 'USd/Bu', 4),
('SUGAR', 'Sucre', 'Sugar', 'agriculture', 'USd/Lbs', 5),
('COFFEE', 'Café', 'Coffee', 'agriculture', 'USd/Lbs', 6),
('COCOA', 'Cacao', 'Cocoa', 'agriculture', 'USD/T', 7),
('PALM_OIL', 'Huile de palme', 'Palm Oil', 'agriculture', 'MYR/T', 8)
ON CONFLICT (code) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_commodites_categorie ON commodites(categorie);
