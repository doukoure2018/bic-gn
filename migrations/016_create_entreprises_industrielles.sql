-- Entreprises industrielles par sous-secteur
CREATE TABLE IF NOT EXISTS entreprises_industrielles (
    id SERIAL PRIMARY KEY,
    secteur_code VARCHAR(20) NOT NULL CHECK (secteur_code IN ('MINES', 'AGROINDUS', 'BTP', 'MANUFACTURES', 'ENERGIE')),
    nom_entreprise VARCHAR(200) NOT NULL,
    region VARCHAR(100) NOT NULL,
    prod_installee VARCHAR(100),
    prod_realisee VARCHAR(100),
    unite_production VARCHAR(50),
    emplois INTEGER DEFAULT 0,
    pct_emploi_femmes DECIMAL(5, 2) DEFAULT 0,
    nbre_emploi_femmes INTEGER DEFAULT 0,
    ide_recus DECIMAL(10, 2) DEFAULT 0,
    contraintes TEXT,
    date_maj DATE,
    statut VARCHAR(20) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'valide', 'publie')),
    saisi_par VARCHAR(50) REFERENCES users(id),
    valide_par VARCHAR(50) REFERENCES users(id),
    date_validation TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ent_ind_secteur ON entreprises_industrielles(secteur_code);
CREATE INDEX IF NOT EXISTS idx_ent_ind_statut ON entreprises_industrielles(statut);

-- Seed données initiales (statut publie)
INSERT INTO entreprises_industrielles (secteur_code, nom_entreprise, region, prod_installee, prod_realisee, unite_production, emplois, pct_emploi_femmes, nbre_emploi_femmes, ide_recus, contraintes, date_maj, statut) VALUES
-- MINES
('MINES', 'MinEx Guinea', 'Kindia', '1 200 000', '1 050 000', 't', 1500, 12, 180, 45, 'Faible teneur minerai', '2026-03-31', 'publie'),
('MINES', 'Alpha Metal', 'Nzérékoré', '950 000', '820 000', 't', 1100, 10, 110, 38, 'Infrastructure', '2026-02-15', 'publie'),
('MINES', 'Guinée Bauxite SA', 'Boké', '3 000 000', '2 750 000', 't', 4200, 15, 630, 110, 'Logistique portuaire', '2026-04-05', 'publie'),
('MINES', 'FerMiner', 'Kankan', '700 000', '550 000', 't', 850, 9, 77, 22, 'Disponibilité eau', '2026-01-20', 'publie'),
('MINES', 'AllSteel Mining', 'Mamou', '880 000', '820 000', 't', 1000, 11, 110, 30, 'Energie instable', '2026-03-10', 'publie'),
-- AGROINDUS
('AGROINDUS', 'AgroPlus', 'Conakry', '50 000', '48 200', 't', 420, 42, 176, 5, 'Matières premières', '2026-03-31', 'publie'),
('AGROINDUS', 'GrainMaster', 'Kindia', '75 000', '70 300', 't', 560, 38, 213, 8, 'Stockage', '2026-04-02', 'publie'),
('AGROINDUS', 'FruitCo', 'Labé', '30 000', '29 500', 't', 290, 47, 136, 3.2, 'Saisonnière', '2026-03-22', 'publie'),
('AGROINDUS', 'AgroEast', 'Nzérékoré', '60 000', '57 000', 't', 510, 40, 204, 6.4, 'Transport', '2026-04-01', 'publie'),
('AGROINDUS', 'NutriFoods', 'Boké', '80 000', '75 500', 't', 620, 44, 273, 9.1, 'Energie', '2026-03-28', 'publie'),
-- BTP
('BTP', 'BuildCon GN', 'Conakry', '500 000', '470 000', 'm²', 3400, 8, 272, 25, 'Accès financement', '2026-04-01', 'publie'),
('BTP', 'Roads & Infra', 'Kindia', '750 000', '720 000', 'm²', 4100, 6, 246, 33, 'Matières coûteuses', '2026-03-30', 'publie'),
('BTP', 'UrbanDev', 'Boké', '620 000', '600 000', 'm²', 3200, 12, 384, 27, 'Réglementation', '2026-03-27', 'publie'),
('BTP', 'BridgeWorks', 'Mamou', '480 000', '460 000', 'm²', 2900, 9, 261, 22, 'Pénurie main d''oeuvre', '2026-04-02', 'publie'),
('BTP', 'Housing SA', 'Kankan', '690 000', '660 000', 'm²', 3800, 11, 418, 29, 'Logistique', '2026-03-26', 'publie'),
-- MANUFACTURES
('MANUFACTURES', 'TextiConakry', 'Conakry', '1 000 000', '920 000', 'unités', 1200, 55, 660, 12, 'Matières premières', '2026-04-04', 'publie'),
('MANUFACTURES', 'FootWear GN', 'Kindia', '850 000', '780 000', 'unités', 980, 48, 470, 9.5, 'Technologies', '2026-03-21', 'publie'),
('MANUFACTURES', 'Paper & Pack SA', 'Mamou', '600 000', '580 000', 'unités', 710, 36, 256, 7, 'Logistique', '2026-04-03', 'publie'),
('MANUFACTURES', 'CraftMakers', 'Boké', '420 000', '400 000', 'unités', 560, 50, 280, 4.2, 'Marché local', '2026-03-29', 'publie'),
('MANUFACTURES', 'ElecParts', 'Kankan', '550 000', '510 000', 'unités', 690, 28, 193, 5.8, 'Energie', '2026-04-05', 'publie'),
-- ENERGIE
('ENERGIE', 'Guinée Energies', 'Conakry', '1 500', '1 400', 'GWh', 2100, 14, 294, 40, 'Fiabilité réseau', '2026-04-05', 'publie'),
('ENERGIE', 'SolarPower GN', 'Kindia', '850', '830', 'GWh', 780, 22, 172, 12, 'Saison', '2026-04-01', 'publie'),
('ENERGIE', 'HydroSea', 'Boké', '2 000', '1 970', 'GWh', 2900, 10, 290, 55, 'Démarrage turbine', '2026-03-31', 'publie'),
('ENERGIE', 'WindWest', 'Mamou', '650', '620', 'GWh', 520, 18, 94, 8, 'Vitesses vents', '2026-03-25', 'publie'),
('ENERGIE', 'BioFuel GN', 'Nzérékoré', '780', '760', 'GWh', 610, 25, 153, 10, 'Logistique', '2026-04-04', 'publie');
