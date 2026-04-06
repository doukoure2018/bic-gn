-- Régions de Guinée
INSERT INTO regions (code, nom, nom_en) VALUES
('NAT', 'National', 'National'),
('CKY', 'Conakry', 'Conakry'),
('BOK', 'Boké', 'Boké'),
('FAR', 'Faranah', 'Faranah'),
('KAN', 'Kankan', 'Kankan'),
('KIN', 'Kindia', 'Kindia'),
('LAB', 'Labé', 'Labé'),
('MAM', 'Mamou', 'Mamou'),
('NZE', 'N''Zérékoré', 'N''Zérékoré')
ON CONFLICT (code) DO NOTHING;

-- Périodes 2023
INSERT INTO periodes (annee, trimestre, date_debut, date_fin) VALUES
(2023, 1, '2023-01-01', '2023-03-31'),
(2023, 2, '2023-04-01', '2023-06-30'),
(2023, 3, '2023-07-01', '2023-09-30'),
(2023, 4, '2023-10-01', '2023-12-31')
ON CONFLICT (annee, trimestre) DO NOTHING;

-- Périodes 2024
INSERT INTO periodes (annee, trimestre, date_debut, date_fin) VALUES
(2024, 1, '2024-01-01', '2024-03-31'),
(2024, 2, '2024-04-01', '2024-06-30'),
(2024, 3, '2024-07-01', '2024-09-30'),
(2024, 4, '2024-10-01', '2024-12-31')
ON CONFLICT (annee, trimestre) DO NOTHING;

-- Périodes 2025
INSERT INTO periodes (annee, trimestre, date_debut, date_fin) VALUES
(2025, 1, '2025-01-01', '2025-03-31'),
(2025, 2, '2025-04-01', '2025-06-30'),
(2025, 3, '2025-07-01', '2025-09-30'),
(2025, 4, '2025-10-01', '2025-12-31')
ON CONFLICT (annee, trimestre) DO NOTHING;

-- Utilisateur administrateur par défaut
-- Mot de passe: Admin@2024
INSERT INTO users (id, email, password_hash, nom, prenom, role, status) VALUES
('admin-001', 'admin@oncp.gn', '$2b$12$AbQSD3khfmwbmZYDdqa6nekrYRNnb5q5SeuCFt9rUDD0BJmfeBG8m', 'Administrateur', 'ONCP', 'super_admin', 'active')
ON CONFLICT (id) DO NOTHING;

-- Partenaires par défaut
INSERT INTO partenaires (nom, nom_en, type, ordre) VALUES
('Ministère de l''Industrie', 'Ministry of Industry', 'ministere', 1),
('Ministère du Commerce', 'Ministry of Trade', 'ministere', 2),
('Banque Centrale de la République de Guinée (BCRG)', 'Central Bank of Guinea (BCRG)', 'institution', 3),
('Institut National de la Statistique (INS)', 'National Institute of Statistics (INS)', 'institution', 4)
ON CONFLICT DO NOTHING;
