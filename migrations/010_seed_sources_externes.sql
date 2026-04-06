-- Sources externes
INSERT INTO sources_externes (code, nom, type, url_base, description) VALUES
('WORLDBANK', 'Banque Mondiale (World Bank)', 'api_auto',
 'https://api.worldbank.org/v2/country/GIN/indicator/',
 'API gratuite - 13+ indicateurs macro-économiques annuels pour la Guinée. Aucune clé API requise.'),

('TRADINGECO', 'Trading Economics', 'api_semi',
 'https://api.tradingeconomics.com/',
 'API payante avec trial gratuit (100 requêtes). PIB, inflation, commerce, emploi. 20M+ indicateurs.'),

('OPENDATAAF', 'Guinea Open Data Portal (BAD/IMF)', 'api_auto',
 'https://guinea.opendataforafrica.org/',
 'Portail gratuit - données IMF/BAD formatées. Export JSON/Excel/SDMX.'),

('SIMPRIX', 'SIMPRIX - Système des Prix Guinée', 'scraping',
 'https://www.simprix.gov.gn/',
 'Plateforme gouvernementale - prix plafonds des denrées en temps réel (DNCIC).'),

('ANASA', 'ANASA - Statistiques Agricoles Guinée', 'import_manuel',
 'https://anasa.gov.gn/',
 'Annuaires statistiques agricoles, SIM-Guinée. Import Excel via back-office.'),

('FREEDOMH', 'Freedom House', 'api_semi',
 'https://freedomhouse.org/country/guinea',
 'Score liberté et gouvernance. Score 2026: 28/100.'),

('WACOMP', 'WACOMP Observatory (CEDEAO)', 'scraping',
 'https://wacomp-observatory.org/fr/',
 'Compétitivité et commerce intra-régional Afrique de l''Ouest.'),

('INS_GN', 'Institut National de la Statistique (INS)', 'import_manuel',
 NULL,
 'Source officielle IPI trimestriel, données nationales. Saisie manuelle par admin ou import Excel.')
ON CONFLICT (code) DO NOTHING;

-- Sous-secteurs industriels (ISIC Rév. 4)
INSERT INTO sous_secteurs (secteur_id, code, nom, nom_en, code_isic, poids, ordre) VALUES
(1, 'SS_MINES', 'Extraction minière (mines)', 'Mining and Quarrying', '05-09', 39.25, 1),
(1, 'SS_MANUF', 'Industries manufacturières', 'Manufacturing', '10-33', 43.61, 2),
(1, 'SS_CONST', 'Construction industrielle', 'Construction', '41-43', 17.41, 3),
(1, 'SS_ENERG', 'Production et distribution d''électricité, gaz et eau', 'Electricity, Gas and Water', '35-39', NULL, 4),
(1, 'SS_AGRO', 'Industries agro-alimentaires', 'Agro-food Industries', NULL, NULL, 5),
(1, 'SS_CHIM', 'Industries chimiques et matériaux', 'Chemical Industries', NULL, NULL, 6),
(1, 'SS_TEXT', 'Textile, habillement et cuir', 'Textiles, Clothing and Leather', NULL, NULL, 7),
(1, 'SS_METAL', 'Industries métallurgiques et produits métalliques', 'Metallurgy and Metal Products', NULL, NULL, 8),
(1, 'SS_BOIS', 'Industries du bois et papiers', 'Wood and Paper Industries', NULL, NULL, 9)
ON CONFLICT (code) DO NOTHING;

-- Sous-secteurs commerce
INSERT INTO sous_secteurs (secteur_id, code, nom, nom_en, poids, ordre) VALUES
(2, 'SS_COM_INT', 'Commerce intérieur', 'Domestic Trade', NULL, 1),
(2, 'SS_COM_EXT', 'Commerce extérieur', 'Foreign Trade', NULL, 2),
(2, 'SS_COM_GRO', 'Commerce de gros', 'Wholesale Trade', NULL, 3),
(2, 'SS_COM_DET', 'Commerce de détail', 'Retail Trade', NULL, 4),
(2, 'SS_ECOM', 'E-commerce', 'E-commerce', NULL, 5)
ON CONFLICT (code) DO NOTHING;

-- Contraintes entreprises
INSERT INTO contraintes (code, nom, nom_en, ordre) VALUES
('ELECTRICITE', 'Électricité', 'Electricity', 1),
('FISCALITE', 'Fiscalité', 'Taxation', 2),
('TRANSPORT', 'Transport', 'Transportation', 3),
('FINANCEMENT', 'Accès au financement', 'Access to Finance', 4),
('DOUANES', 'Douanes', 'Customs', 5),
('INFORMEL', 'Informel', 'Informal Sector', 6),
('INFRA', 'Infrastructures', 'Infrastructure', 7),
('CORRUPTION', 'Corruption', 'Corruption', 8)
ON CONFLICT (code) DO NOTHING;

-- Mapping indicateurs World Bank
INSERT INTO donnees_externes (source_id, indicateur_code, indicateur_nom, annee, valeur, unite) VALUES
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NV.IND.TOTL.ZS', 'Industrie (% du PIB)', 2024, 25.12, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NV.IND.TOTL.ZS', 'Industrie (% du PIB)', 2023, 25.73, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NV.IND.TOTL.ZS', 'Industrie (% du PIB)', 2022, 26.50, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NV.IND.TOTL.ZS', 'Industrie (% du PIB)', 2021, 28.82, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NV.IND.MANF.ZS', 'Manufacturier (% du PIB)', 2022, 12.75, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NV.IND.MANF.ZS', 'Manufacturier (% du PIB)', 2021, 11.42, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'SL.IND.EMPL.ZS', 'Emploi industriel (% total)', 2025, 14.15, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'SL.IND.EMPL.ZS', 'Emploi industriel (% total)', 2024, 14.03, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'SL.IND.EMPL.ZS', 'Emploi industriel (% total)', 2023, 13.96, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'FP.CPI.TOTL.ZG', 'Inflation (% annuel)', 2024, 8.12, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'FP.CPI.TOTL.ZG', 'Inflation (% annuel)', 2023, 7.80, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'FP.CPI.TOTL.ZG', 'Inflation (% annuel)', 2022, 10.49, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'FP.CPI.TOTL.ZG', 'Inflation (% annuel)', 2021, 12.60, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NE.EXP.GNFS.ZS', 'Exportations (% du PIB)', 2024, 41.39, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NE.EXP.GNFS.ZS', 'Exportations (% du PIB)', 2023, 44.13, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NE.IMP.GNFS.ZS', 'Importations (% du PIB)', 2024, 38.50, '%'),
((SELECT id FROM sources_externes WHERE code='WORLDBANK'), 'NE.IMP.GNFS.ZS', 'Importations (% du PIB)', 2023, 36.20, '%')
ON CONFLICT (source_id, indicateur_code, annee, trimestre) DO NOTHING;

-- Données IPI réelles INS (du fichier Excel ONCP)
INSERT INTO donnees_externes (source_id, indicateur_code, indicateur_nom, annee, trimestre, valeur, unite, metadata) VALUES
((SELECT id FROM sources_externes WHERE code='INS_GN'), 'IPI_TOTAL', 'IPI Total (variation)', 2025, 1, 11.0, '%', '{"vs": "T4-2024", "source_detail": "INS rapports IPI T1-2025"}'),
((SELECT id FROM sources_externes WHERE code='INS_GN'), 'IPI_TOTAL', 'IPI Total (variation)', 2025, 2, 5.0, '%', '{"vs": "T2-2024", "source_detail": "INS via Eco-Finance Guinée"}'),
((SELECT id FROM sources_externes WHERE code='INS_GN'), 'IPI_TOTAL', 'IPI Total (variation)', 2025, 3, 10.4, '%', '{"vs": "T3-2024", "source_detail": "INS publication harmonisée T3-2025"}')
ON CONFLICT (source_id, indicateur_code, annee, trimestre) DO NOTHING;

-- Trading Economics data
INSERT INTO donnees_externes (source_id, indicateur_code, indicateur_nom, annee, valeur, unite) VALUES
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'GDP', 'PIB', 2025, 25.33, 'Milliards USD'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'GDP_GROWTH', 'Croissance PIB', 2025, 5.6, '%'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'UNEMPLOYMENT', 'Taux de chômage', 2025, 5.2, '%'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'INFLATION', 'Inflation (CPI)', 2025, 4.4, '%'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'FOOD_INFLATION', 'Inflation alimentaire', 2025, 9.6, '%'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'EXPORTS', 'Exportations', 2025, 3641, 'Millions USD'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'IMPORTS', 'Importations', 2025, 2676, 'Millions USD'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'TRADE_BALANCE', 'Balance commerciale', 2025, 965, 'Millions USD'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'INTEREST_RATE', 'Taux d''intérêt', 2025, 9.5, '%'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'POPULATION', 'Population', 2025, 14.36, 'Millions'),
((SELECT id FROM sources_externes WHERE code='TRADINGECO'), 'PUBLIC_DEBT', 'Dette publique (% PIB)', 2025, 33.6, '%')
ON CONFLICT (source_id, indicateur_code, annee, trimestre) DO NOTHING;

-- Freedom House
INSERT INTO donnees_externes (source_id, indicateur_code, indicateur_nom, annee, valeur, unite, metadata) VALUES
((SELECT id FROM sources_externes WHERE code='FREEDOMH'), 'FREEDOM_SCORE', 'Score liberté globale', 2026, 28, '/100', '{"statut": "Not Free", "droits_politiques": 6, "libertes_civiles": 22}')
ON CONFLICT (source_id, indicateur_code, annee, trimestre) DO NOTHING;

-- Contraintes entreprises (données exemple du fichier Excel)
INSERT INTO contraintes_valeurs (contrainte_id, secteur_id, region_id, periode_id, score, nombre_repondants)
SELECT c.id, 1, (SELECT id FROM regions WHERE code='CKY'), (SELECT id FROM periodes WHERE annee=2025 AND trimestre=1), s.score, 50
FROM (VALUES
    ('ELECTRICITE', 4.0), ('FISCALITE', 3.5), ('TRANSPORT', 3.2),
    ('FINANCEMENT', 3.8), ('DOUANES', 2.8), ('INFORMEL', 3.0),
    ('INFRA', 3.5), ('CORRUPTION', 2.5)
) AS s(code, score)
JOIN contraintes c ON c.code = s.code
ON CONFLICT DO NOTHING;

-- Perspectives (données exemple du fichier Excel)
INSERT INTO perspectives (secteur_id, region_id, periode_id, optimiste, stable, pessimiste, nombre_repondants)
VALUES
(1, (SELECT id FROM regions WHERE code='CKY'), (SELECT id FROM periodes WHERE annee=2025 AND trimestre=1), 40, 35, 25, 50),
(2, (SELECT id FROM regions WHERE code='CKY'), (SELECT id FROM periodes WHERE annee=2025 AND trimestre=1), 35, 40, 25, 45)
ON CONFLICT DO NOTHING;
