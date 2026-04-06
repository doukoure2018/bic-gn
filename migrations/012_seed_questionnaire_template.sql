-- Template questionnaire officiel ONCP pour collecte des indicateurs industriels
-- Basé sur le document: Questionnaire_Collecte_Indicateurs_Industrie.md

INSERT INTO enquetes (titre, titre_en, description, description_en, secteur_id, date_debut, date_fin, statut, questions, created_by)
VALUES (
    'Questionnaire de Collecte des Indicateurs Industriels - ONCP',
    'Industrial Indicators Collection Questionnaire - ONCP',
    'Questionnaire officiel administré par l''Observatoire National de la Compétitivité Pays pour la collecte trimestrielle des indicateurs industriels de Guinée.',
    'Official questionnaire administered by the National Competitiveness Observatory for quarterly collection of Guinea''s industrial indicators.',
    1,
    '2026-01-01',
    '2026-12-31',
    'brouillon',
    '[
        {
            "id": 1,
            "section": "Informations générales",
            "section_en": "General Information",
            "texte": "Quel est le sous-secteur industriel de votre entreprise ?",
            "texte_en": "What is your company''s industrial sub-sector?",
            "type": "select",
            "obligatoire": true,
            "options": ["Extraction minière", "Industries manufacturières", "Construction industrielle", "Énergie, gaz et eau", "Agro-alimentaire", "Chimie et matériaux", "Textile, habillement et cuir", "Métallurgie", "Bois et papier", "Autre"]
        },
        {
            "id": 2,
            "section": "Informations générales",
            "texte": "Dans quelle région est située votre entreprise ?",
            "type": "select",
            "obligatoire": true,
            "options": ["Conakry", "Boké", "Faranah", "Kankan", "Kindia", "Labé", "Mamou", "N''Zérékoré"]
        },
        {
            "id": 3,
            "section": "Informations générales",
            "texte": "Quelle est la taille de votre entreprise ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["TPE (1-10 employés)", "PME (11-250 employés)", "Grande entreprise (250+ employés)"]
        },
        {
            "id": 4,
            "section": "Production industrielle",
            "section_en": "Industrial Production",
            "texte": "Comment a évolué votre volume de production ce trimestre par rapport au trimestre précédent ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["En forte hausse (+10% et plus)", "En hausse (+1 à +10%)", "Stable (0%)", "En baisse (-1 à -10%)", "En forte baisse (-10% et plus)"]
        },
        {
            "id": 5,
            "section": "Production industrielle",
            "texte": "Quel est votre taux d''utilisation des capacités de production (en %) ?",
            "type": "number",
            "obligatoire": true,
            "min": 0,
            "max": 100
        },
        {
            "id": 6,
            "section": "Production industrielle",
            "texte": "Comment ont évolué vos commandes reçues ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["En forte hausse", "En hausse", "Stables", "En baisse", "En forte baisse"]
        },
        {
            "id": 7,
            "section": "Production industrielle",
            "texte": "Quel est le niveau actuel de vos stocks de produits finis ?",
            "type": "radio",
            "options": ["Supérieur à la normale", "Normal", "Inférieur à la normale"]
        },
        {
            "id": 8,
            "section": "Finances et investissements",
            "section_en": "Finance and Investments",
            "texte": "Comment a évolué votre chiffre d''affaires ce trimestre ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["En forte hausse", "En hausse", "Stable", "En baisse", "En forte baisse"]
        },
        {
            "id": 9,
            "section": "Finances et investissements",
            "texte": "Avez-vous réalisé des investissements ce trimestre ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["Oui, importants", "Oui, modérés", "Non"]
        },
        {
            "id": 10,
            "section": "Finances et investissements",
            "texte": "Comment évaluez-vous votre accès au financement bancaire ?",
            "type": "radio",
            "options": ["Très facile", "Facile", "Difficile", "Très difficile", "Pas de demande"]
        },
        {
            "id": 11,
            "section": "Finances et investissements",
            "texte": "Comment se présente votre situation de trésorerie ?",
            "type": "radio",
            "options": ["Excédentaire", "Équilibrée", "Déficitaire"]
        },
        {
            "id": 12,
            "section": "Emploi",
            "section_en": "Employment",
            "texte": "Comment ont évolué vos effectifs ce trimestre ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["Recrutements significatifs", "Légers recrutements", "Effectif stable", "Légers licenciements", "Licenciements significatifs"]
        },
        {
            "id": 13,
            "section": "Emploi",
            "texte": "Quel est l''effectif actuel de votre entreprise ?",
            "type": "number",
            "obligatoire": true,
            "min": 1
        },
        {
            "id": 14,
            "section": "Commerce et exportations",
            "section_en": "Trade and Exports",
            "texte": "Votre entreprise exporte-t-elle ses produits ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["Oui, principalement", "Oui, partiellement", "Non"]
        },
        {
            "id": 15,
            "section": "Commerce et exportations",
            "texte": "Comment ont évolué vos exportations ?",
            "type": "radio",
            "options": ["En forte hausse", "En hausse", "Stables", "En baisse", "En forte baisse", "Non applicable"]
        },
        {
            "id": 16,
            "section": "Coûts de production",
            "section_en": "Production Costs",
            "texte": "Comment ont évolué vos coûts d''énergie ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["En forte hausse", "En hausse", "Stables", "En baisse"]
        },
        {
            "id": 17,
            "section": "Coûts de production",
            "texte": "Comment ont évolué vos coûts de transport ?",
            "type": "radio",
            "options": ["En forte hausse", "En hausse", "Stables", "En baisse"]
        },
        {
            "id": 18,
            "section": "Coûts de production",
            "texte": "Comment ont évolué vos coûts de matières premières ?",
            "type": "radio",
            "options": ["En forte hausse", "En hausse", "Stables", "En baisse"]
        },
        {
            "id": 19,
            "section": "Contraintes",
            "section_en": "Constraints",
            "texte": "Classez les principales contraintes de votre entreprise (1 = la plus importante) :",
            "type": "ranking",
            "obligatoire": true,
            "options": ["Électricité", "Fiscalité", "Transport", "Accès au financement", "Douanes", "Secteur informel", "Infrastructures", "Corruption"]
        },
        {
            "id": 20,
            "section": "Contraintes",
            "texte": "Évaluez la sévérité de chaque contrainte (1=faible, 5=très élevé) :",
            "type": "matrix",
            "options": ["Électricité", "Fiscalité", "Transport", "Accès au financement", "Douanes", "Informel", "Infrastructures", "Corruption"],
            "echelle": [1, 2, 3, 4, 5]
        },
        {
            "id": 21,
            "section": "Perspectives",
            "section_en": "Outlook",
            "texte": "Comment voyez-vous l''évolution de votre production au prochain trimestre ?",
            "type": "radio",
            "obligatoire": true,
            "options": ["Optimiste (hausse attendue)", "Stable (pas de changement)", "Pessimiste (baisse attendue)"]
        },
        {
            "id": 22,
            "section": "Perspectives",
            "texte": "Comment voyez-vous l''évolution de vos investissements dans les 6 prochains mois ?",
            "type": "radio",
            "options": ["En hausse", "Stables", "En baisse"]
        },
        {
            "id": 23,
            "section": "Perspectives",
            "texte": "Comment voyez-vous l''évolution de l''emploi dans votre entreprise ?",
            "type": "radio",
            "options": ["Recrutements prévus", "Effectif stable", "Réductions prévues"]
        },
        {
            "id": 24,
            "section": "Perspectives",
            "texte": "Remarques ou commentaires supplémentaires :",
            "type": "text",
            "obligatoire": false
        }
    ]',
    'admin-001'
) ON CONFLICT DO NOTHING;
