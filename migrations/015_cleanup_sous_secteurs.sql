-- Désactiver les sous-secteurs non utilisés
UPDATE sous_secteurs SET est_actif = false WHERE code IN ('SS_TEXT', 'SS_METAL', 'SS_BOIS', 'SS_CHIM');
