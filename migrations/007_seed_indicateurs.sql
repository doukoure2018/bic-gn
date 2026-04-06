-- Secteurs
INSERT INTO secteurs (code, nom, nom_en, icone, couleur) VALUES
('IND', 'Industrie', 'Industry', 'factory', '#16a34a'),
('COM', 'Commerce', 'Trade', 'shopping-cart', '#dc2626')
ON CONFLICT (code) DO NOTHING;

-- Catégories Industrie
INSERT INTO categories (secteur_id, code, nom, nom_en, ordre) VALUES
(1, 'IND_PROD', 'Production', 'Production', 1),
(1, 'IND_INV', 'Investissements', 'Investments', 2),
(1, 'IND_EMP', 'Emploi', 'Employment', 3),
(1, 'IND_EXP', 'Exportations', 'Exports', 4),
(1, 'IND_COUT', 'Coûts', 'Costs', 5),
(1, 'IND_CLIM', 'Climat des affaires', 'Business Climate', 6),
(1, 'IND_PERSP', 'Perspectives', 'Outlook', 7)
ON CONFLICT (code) DO NOTHING;

-- Catégories Commerce
INSERT INTO categories (secteur_id, code, nom, nom_en, ordre) VALUES
(2, 'COM_INT', 'Commerce intérieur', 'Domestic Trade', 1),
(2, 'COM_EXT', 'Commerce extérieur', 'Foreign Trade', 2),
(2, 'COM_PRI', 'Prix', 'Prices', 3),
(2, 'COM_STK', 'Stocks', 'Stocks', 4),
(2, 'COM_CTR', 'Contraintes', 'Constraints', 5),
(2, 'COM_PERSP', 'Perspectives', 'Outlook', 6)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Industrie - Production
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(1, 'IND_PROD_IDX', 'Indice de production industrielle', 'Industrial Production Index', 'indice', 'INS', 1),
(1, 'IND_PROD_CAP', 'Taux d''utilisation des capacités', 'Capacity Utilization Rate', '%', 'Enquête', 2),
(1, 'IND_PROD_VOL', 'Volume de production', 'Production Volume', 'unités', 'Enquête', 3),
(1, 'IND_PROD_CMD', 'Commandes reçues', 'Orders Received', 'indice', 'Enquête', 4)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Industrie - Investissements
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(2, 'IND_INV_MNT', 'Montant des investissements', 'Investment Amount', 'Mrd GNF', 'INS', 1),
(2, 'IND_INV_ACC', 'Accès au financement', 'Access to Finance', 'indice', 'Enquête', 2)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Industrie - Emploi
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(3, 'IND_EMP_EFF', 'Effectifs employés', 'Employed Workforce', 'nombre', 'Enquête', 1),
(3, 'IND_EMP_VAR', 'Variation emploi', 'Employment Variation', '%', 'INS', 2)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Industrie - Exportations
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(4, 'IND_EXP_VOL', 'Volume exportations', 'Export Volume', 'Mrd GNF', 'BCRG', 1),
(4, 'IND_EXP_VAR', 'Variation exportations', 'Export Variation', '%', 'BCRG', 2)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Commerce - Commerce intérieur
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(8, 'COM_INT_CA', 'Chiffre d''affaires commerce', 'Trade Turnover', 'Mrd GNF', 'INS', 1),
(8, 'COM_INT_VNT', 'Volume des ventes', 'Sales Volume', 'indice', 'Enquête', 2)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Commerce - Commerce extérieur
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(9, 'COM_EXT_IMP', 'Importations', 'Imports', 'Mrd GNF', 'BCRG', 1),
(9, 'COM_EXT_BAL', 'Balance commerciale', 'Trade Balance', 'Mrd GNF', 'BCRG', 2)
ON CONFLICT (code) DO NOTHING;

-- Indicateurs Commerce - Prix
INSERT INTO indicateurs (categorie_id, code, nom, nom_en, unite, source, ordre) VALUES
(10, 'COM_PRI_IPC', 'Indice des prix à la consommation', 'Consumer Price Index', 'indice', 'INS', 1),
(10, 'COM_PRI_INF', 'Taux d''inflation', 'Inflation Rate', '%', 'BCRG', 2)
ON CONFLICT (code) DO NOTHING;
