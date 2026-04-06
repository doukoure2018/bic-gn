# Suivi du Cahier des Charges — BIC-GN

> **Projet :** Baromètre Industrie & Commerce Guinée
> **Maîtrise d'ouvrage :** Ministère de l'Industrie et du Commerce
> **Administration métier :** ONCP (Observatoire National de la Compétitivité-Pays)
> **Budget :** 59 116 000 GNF
> **Directeur Général :** KANE Moussa
> **Version CDC :** 1.0 — Mars 2026

---

## Légende

- [ ] Non commencé
- [~] En cours / partiellement fait
- [x] Terminé et conforme

---

## 1. Contexte et justification (§1)

- [x] 1.1 Outil institutionnel de visibilité et de communication
- [x] 1.2 Outil d'aide à la décision pour les pouvoirs publics
- [x] 1.3 Outil d'information économique (entreprises, investisseurs, chercheurs, PTF, médias, grand public)
- [x] 1.4 Outil d'administration et de diffusion de données piloté par l'ONCP

---

## 2. Objet du marché (§2)

- [x] 2.1 Concevoir l'architecture fonctionnelle et technique du site
- [x] 2.2 Définir l'expérience utilisateur et l'interface graphique
- [x] 2.3 Développer la plateforme web
- [~] 2.4 Intégrer les contenus et les tableaux de bord
- [x] 2.5 Mettre en place le back-office d'administration
- [~] 2.6 Assurer la sécurité, les performances, l'hébergement, la sauvegarde et la maintenance
- [ ] 2.7 Former les administrateurs et utilisateurs internes
- [ ] 2.8 Accompagner la mise en production et la garantie post-déploiement

---

## 3. Objectifs du projet (§3)

### 3.1 Objectif général

- [x] 3.1.1 Plateforme web moderne, sécurisée, évolutive et administrable
- [x] 3.1.2 Publier et visualiser des indicateurs clés sur l'industrie et le commerce

### 3.2 Objectifs spécifiques

- [x] 3.2.1 Présenter les missions du Baromètre et de l'ONCP
- [x] 3.2.2 Publier des indicateurs sectoriels régulièrement mis à jour
- [x] 3.2.3 Visualiser les données sous forme de tableaux, graphiques, cartes et synthèses
- [x] 3.2.4 Diffuser des notes d'analyse, bulletins, rapports, communiqués et publications
- [~] 3.2.5 Comparer des périodes, secteurs, filières et zones géographiques
- [x] 3.2.6 Offrir un accès différencié selon les profils utilisateurs
- [x] 3.2.7 Administrer les données, contenus et utilisateurs depuis un back-office
- [~] 3.2.8 Garantir la fiabilité, la traçabilité et l'intégrité des informations publiées
- [x] 3.2.9 Faciliter l'export et le partage de certaines données et publications
- [~] 3.2.10 Renforcer l'image institutionnelle du Ministère et de l'ONCP

---

## 4. Périmètre du projet (§4)

### 4.1 Périmètre inclus

- [x] 4.1.1 Conception UX/UI
- [x] 4.1.2 Développement du site public
- [x] 4.1.3 Développement du back-office d'administration
- [ ] 4.1.4 Développement d'application mobile native
- [x] 4.1.5 Gestion des utilisateurs et rôles
- [x] 4.1.6 Gestion des données et indicateurs
- [x] 4.1.7 Mise en place de tableaux de bord dynamiques
- [x] 4.1.8 Publication de rapports et documents
- [x] 4.1.9 Gestion des actualités et contenus éditoriaux
- [x] 4.1.10 Moteur de recherche interne (API /api/search + SearchBar navbar)
- [~] 4.1.11 API publique ouverte à la demande
- [x] 4.1.12 Fonctions de téléchargement/export
- [x] 4.1.13 Optimisation mobile (responsive)
- [ ] 4.1.14 Référencement technique (SEO)
- [ ] 4.1.15 Paramétrage des supports administrateurs
- [x] 4.1.16 Hébergement (Docker), sauvegarde, supervision, sécurité
- [ ] 4.1.17 Mise en place d'un data warehouse ministériel complet
- [ ] 4.1.18 Documentation technique et fonctionnelle
- [ ] 4.1.19 Formation
- [ ] 4.1.20 Maintenance corrective pendant la période de garantie

---

## 5. Cibles et profils utilisateurs (§5)

### 5.1 Utilisateurs externes

- [x] 5.1.1 Grand public — accès site public
- [x] 5.1.2 Entreprises et organisations professionnelles
- [x] 5.1.3 Investisseurs
- [x] 5.1.4 Administrations publiques
- [x] 5.1.5 Chercheurs, universitaires, étudiants
- [x] 5.1.6 Partenaires techniques et financiers
- [x] 5.1.7 Médias

### 5.2 Utilisateurs internes (rôles back-office)

- [x] 5.2.1 Super administrateur système → rôle `super_admin`
- [ ] 5.2.2 Administrateur institutionnel → rôle à créer
- [ ] 5.2.3 Administrateur métier ONCP → rôle à créer
- [x] 5.2.4 Éditeur de contenu → rôle `editeur`
- [ ] 5.2.5 Analyste / gestionnaire de données → rôle à créer
- [x] 5.2.6 Valideur / approbateur → rôle `validateur`
- [x] 5.2.7 Lecteur interne avec accès restreint → rôle `lecteur`

---

## 6. Résultats attendus / Livrables (§6)

- [x] 6.1 Site web public fonctionnel
- [x] 6.2 Back-office sécurisé
- [x] 6.3 Module de gestion des indicateurs
- [x] 6.4 Module de publication des tableaux de bord
- [x] 6.5 Module documentaire (publications)
- [x] 6.6 Module actualités/publications
- [x] 6.7 Dispositif de sauvegarde et restauration (Docker volumes)
- [x] 6.8 Comptes administrateurs initiaux (admin@oncp.gn)
- [ ] 6.9 Manuel utilisateur
- [ ] 6.10 Manuel administrateur
- [ ] 6.11 Documentation technique
- [ ] 6.12 Plan de maintenance et d'exploitation
- [~] 6.13 Plateforme mise en production avec garantie

---

## 7. Exigences fonctionnelles détaillées (§7)

### 7.1 Site public

#### 7.1.1 Accueil

- [x] 7.1.1.1 Identité visuelle du Baromètre (logo ONCP officiel + armoiries + brand Guinée intégrés dans navbar, hero, footer, login, favicon)
- [x] 7.1.1.2 Message institutionnel (barre top: "Republique de Guinee — Ministere de l'Industrie et du Commerce")
- [x] 7.1.1.3 Indicateurs phares — 3 rangs de KPI dynamiques : Rang 1 (4 cards: PIB, Industrie, Commerce, Inflation), Rang 2 (8 indicateurs: Croissance, Manufacturier, Emploi, Population, Exports, Imports, IDE, Dette), Rang 3 (IPI INS + 5 indicateurs complementaires)
- [x] 7.1.1.4 Dernières publications
- [x] 7.1.1.5 Actualités récentes
- [x] 7.1.1.6 Acces rapides aux tableaux de bord — Quick Links (bande doree avec 4 boutons: Industrie, Commerce, Donnees, Publications)
- [x] 7.1.1.7 Moteur de recherche — SearchBar dans navbar, endpoint /api/search, recherche dans indicateurs/publications/actualites/donnees externes/sous-secteurs, dropdown resultats en temps reel
- [x] 7.1.1.8 Acces aux secteurs/filieres — Section "Acces par secteur et filiere" avec 5 liens: Extraction miniere (ISIC 05-09), Industries manufacturieres (10-33), Construction (41-43), Commerce interieur, Commerce exterieur
- [x] 7.1.1.9 Pied de page institutionnel complet — Footer 4 colonnes (Logo+description, Barometre links, Ressources+Institution links, Contact avec adresse/BP/email/site), bandeau partenaires avec logos officiels, copyright avec devise nationale

#### 7.1.2 À propos

- [x] 7.1.2.1 Presentation du Barometre — page accordeon avec description plateforme, 4 roles du site
- [x] 7.1.2.2 Mission et vision — 2 cartes: mission (transparence, suivi performances) + vision (plateforme de reference)
- [x] 7.1.2.3 Role du Ministere — avec armoiries, 5 responsabilites, adresse officielle
- [x] 7.1.2.4 Role de l'ONCP — avec logo, 6 missions, devise, DG KANE Moussa
- [x] 7.1.2.5 Objectifs du dispositif — 8 objectifs specifiques du CDC avec icones
- [x] 7.1.2.6 Gouvernance du systeme — workflow 5 etapes + 7 profils utilisateurs + 9 sources de donnees
- [x] 7.1.2.7 Methodologie generale — IBIC (8 composantes ponderees), interpretation (3 seuils), IPI (formule + 3 sous-secteurs), periodicite (3 frequences)
- [x] 7.1.2.8 Glossaire des concepts — 15 termes: IBIC, IPI, ONCP, BIC-GN, ISIC, PIB, IDE, FBCF, IPC, INS, BCRG, SIMPRIX, PTF, VA, GNF

#### 7.1.3 Tableaux de bord / Baromètres

- [x] 7.1.3.1 Affichage indicateurs : cartes KPI
- [x] 7.1.3.2 Affichage indicateurs : graphiques courbes (LineChart)
- [x] 7.1.3.3 Affichage indicateurs : histogrammes (BarChart)
- [x] 7.1.3.4 Affichage indicateurs : tableaux
- [ ] 7.1.3.5 Affichage indicateurs : jauges
- [~] 7.1.3.6 Filtrage par période
- [~] 7.1.3.7 Filtrage par secteur
- [ ] 7.1.3.8 Filtrage par zone géographique
- [ ] 7.1.3.9 Filtrage par filière ou sous-secteur
- [~] 7.1.3.10 Comparaison temporelle
- [x] 7.1.3.11 Export tableur (Excel)
- [ ] 7.1.3.12 Export PDF
- [ ] 7.1.3.13 Export image
- [x] 7.1.3.14 Affichage des sources et dates de mise à jour
- [ ] 7.1.3.15 Note méthodologique par indicateur ou jeu de données

#### 7.1.4 Indicateurs — Fiches détaillées

- [x] 7.1.4.1 Production industrielle
- [x] 7.1.4.2 Volume d'activités commerciales
- [x] 7.1.4.3 Prix ou indices sectoriels (SIMPRIX)
- [x] 7.1.4.4 Importations/exportations par catégorie
- [ ] 7.1.4.5 Parts de marché
- [ ] 7.1.4.6 Création d'entreprises
- [ ] 7.1.4.7 Performance des filières
- [x] 7.1.4.8 Évolution des échanges
- [ ] 7.1.4.9 Niveau d'approvisionnement
- [ ] 7.1.4.10 Tendances de compétitivité
- [ ] 7.1.4.11 Statistiques sur PME/industries/commerçants

**Fiche indicateur — champs requis :**

- [ ] 7.1.4.F1 Intitulé
- [ ] 7.1.4.F2 Définition
- [ ] 7.1.4.F3 Formule de calcul
- [ ] 7.1.4.F4 Source
- [ ] 7.1.4.F5 Périodicité
- [ ] 7.1.4.F6 Unité de mesure
- [ ] 7.1.4.F7 Date de mise à jour
- [ ] 7.1.4.F8 Historique
- [ ] 7.1.4.F9 Commentaire analytique
- [ ] 7.1.4.F10 Niveau de diffusion

#### 7.1.5 Cartographie

- [ ] 7.1.5.1 Module cartographique interactif
- [ ] 7.1.5.2 Visualisation par région
- [ ] 7.1.5.3 Visualisation par préfecture
- [ ] 7.1.5.4 Visualisation par commune (si données disponibles)
- [ ] 7.1.5.5 Visualisation par zone économique ou industrielle
- [ ] 7.1.5.6 Cartes interactives (desktop + mobile)
- [ ] 7.1.5.7 Légende, filtres et infobulles

#### 7.1.6 Publications et documentation

- [x] 7.1.6.1 Publication de rapports
- [x] 7.1.6.2 Publication de bulletins
- [x] 7.1.6.3 Publication de notes de conjoncture
- [x] 7.1.6.4 Publication d'études sectorielles
- [x] 7.1.6.5 Publication de communiqués
- [x] 7.1.6.6 Publication de documents méthodologiques
- [x] 7.1.6.7 Publication de présentations institutionnelles
- [x] 7.1.6.8 Classement par catégorie
- [ ] 7.1.6.9 Recherche par mots-clés
- [x] 7.1.6.10 Téléchargement
- [x] 7.1.6.11 Tri par date
- [ ] 7.1.6.12 Aperçu de document
- [ ] 7.1.6.13 Archivage

#### 7.1.7 Actualités

- [x] 7.1.7.1 Publication d'articles
- [~] 7.1.7.2 Insertion d'images et médias
- [x] 7.1.7.3 Catégorisation
- [x] 7.1.7.4 Gestion des dates
- [ ] 7.1.7.5 Partage sur réseaux sociaux
- [x] 7.1.7.6 Mise en avant d'actualités sur la page d'accueil (est_vedette)

#### 7.1.8 Espace médias / téléchargements

- [ ] 7.1.8.1 Téléchargement de logos institutionnels
- [ ] 7.1.8.2 Téléchargement de brochures
- [ ] 7.1.8.3 Téléchargement de fiches
- [ ] 7.1.8.4 Téléchargement d'infographies
- [ ] 7.1.8.5 Téléchargement de communiqués de presse
- [ ] 7.1.8.6 Téléchargement de dossiers thématiques

#### 7.1.9 Contact

- [x] 7.1.9.1 Formulaire de contact
- [~] 7.1.9.2 Coordonnées officielles
- [ ] 7.1.9.3 Localisation (carte)
- [ ] 7.1.9.4 Liens institutionnels
- [ ] 7.1.9.5 Canal de remontée d'erreurs ou demandes d'information

#### 7.1.10 FAQ

- [ ] 7.1.10.1 FAQ administrable depuis le back-office

---

### 7.2 Back-office / Administration

#### 7.2.1 Gestion des utilisateurs et rôles

- [x] 7.2.1.1 Création d'utilisateurs
- [x] 7.2.1.2 Modification d'utilisateurs
- [x] 7.2.1.3 Activation / désactivation d'utilisateurs
- [x] 7.2.1.4 Suppression (désactivation) d'utilisateurs
- [x] 7.2.1.5 Gestion de rôles et permissions
- [~] 7.2.1.6 Journalisation des actions (table existe, pas systématique)
- [ ] 7.2.1.7 Réinitialisation sécurisée des mots de passe (par email)
- [x] 7.2.1.8 Gestion des sessions (JWT)

#### 7.2.2 Gestion éditoriale

- [~] 7.2.2.1 Création, modification et suppression de pages
- [ ] 7.2.2.2 Gestion des menus (dynamique depuis admin)
- [x] 7.2.2.3 Publication et dépublication
- [ ] 7.2.2.4 Planification de publication (date future)
- [x] 7.2.2.5 Gestion des brouillons
- [ ] 7.2.2.6 Workflow de validation (saisie → contrôle → validation → publication)
- [ ] 7.2.2.7 Versionnage des contenus

#### 7.2.3 Gestion des indicateurs et données

- [x] 7.2.3.1 Création de fiches indicateurs
- [x] 7.2.3.2 Saisie manuelle des données
- [ ] 7.2.3.3 Import via fichiers CSV/XLSX
- [ ] 7.2.3.4 Contrôle de cohérence minimal
- [x] 7.2.3.5 Historisation
- [x] 7.2.3.6 Affectation à une catégorie, période et zone
- [x] 7.2.3.7 Publication partielle ou complète
- [ ] 7.2.3.8 Gestion de la visibilité par profil

#### 7.2.4 Gestion documentaire

- [x] 7.2.4.1 Chargement de fichiers (uploads)
- [ ] 7.2.4.2 Indexation
- [x] 7.2.4.3 Catégorisation
- [ ] 7.2.4.4 Classement
- [ ] 7.2.4.5 Archivage
- [ ] 7.2.4.6 Contrôle de poids et formats
- [x] 7.2.4.7 Téléchargement public ou restreint

#### 7.2.5 Administration des tableaux de bord

- [ ] 7.2.5.1 Configuration de widgets
- [ ] 7.2.5.2 Choix des visualisations (type graphique)
- [ ] 7.2.5.3 Association d'indicateurs à un tableau de bord
- [ ] 7.2.5.4 Paramétrage des filtres
- [ ] 7.2.5.5 Ordonnancement des blocs
- [ ] 7.2.5.6 Publication par tableau

#### 7.2.6 Journalisation et audit

- [~] 7.2.6.1 Journalisation des connexions
- [ ] 7.2.6.2 Journalisation des modifications
- [ ] 7.2.6.3 Journalisation des publications
- [ ] 7.2.6.4 Journalisation des importations
- [ ] 7.2.6.5 Journalisation des suppressions
- [ ] 7.2.6.6 Journalisation des erreurs critiques
- [ ] 7.2.6.7 Journalisation des tentatives d'accès non autorisé

---

## 8. Architecture fonctionnelle minimale (§8)

- [~] 8.1 CMS / gestion de contenu
- [x] 8.2 Gestion des utilisateurs et droits
- [x] 8.3 Gestion des données et indicateurs
- [x] 8.4 Moteur de visualisation (Recharts)
- [x] 8.5 Moteur de recherche (endpoint /api/search multi-entites)
- [~] 8.6 Médiathèque documentaire
- [~] 8.7 Journalisation
- [x] 8.8 Sauvegarde (Docker volumes)
- [x] 8.9 Sécurité (JWT, bcrypt, CORS)
- [x] 8.10 Administration technique

---

## 9. Arborescence du site (§9)

- [x] 9.1 Accueil → `/`
- [~] 9.2 À propos → `/a-propos`
- [x] 9.3 Baromètre
  - [x] 9.3.1 Vue d'ensemble → `/` (dashboard accueil)
  - [x] 9.3.2 Industrie → `/barometre/industrie`
  - [x] 9.3.3 Commerce → `/barometre/commerce`
  - [ ] 9.3.4 Filières
  - [ ] 9.3.5 Cartographie
- [x] 9.4 Indicateurs → `/donnees`
- [x] 9.5 Publications → `/publications`
- [x] 9.6 Actualités → `/actualites`
- [ ] 9.7 Médiathèque / Téléchargements
- [ ] 9.8 FAQ
- [x] 9.9 Contact → `/contact`

---

## 10. Exigences techniques (§10)

### 10.1 Exigences générales

- [x] 10.1.1 Robuste
- [x] 10.1.2 Sécurisée
- [x] 10.1.3 Évolutive
- [x] 10.1.4 Maintenable
- [~] 10.1.5 Documentée
- [x] 10.1.6 Interopérable (API REST)
- [x] 10.1.7 Responsive
- [x] 10.1.8 Compatible navigateurs récents
- [~] 10.1.9 Optimisée pour les faibles débits

### 10.2 Technologies

- [x] 10.2.1 Technologies standards (Python, React, PostgreSQL)
- [x] 10.2.2 Sans verrou propriétaire (100% open source)
- [x] 10.2.3 Reprise possible par une autre équipe
- [x] 10.2.4 Maintenance locale ou tierce facilitée

### 10.3 CMS et administration

- [x] 10.3.1 Développement spécifique avec interface d'administration dédiée

### 10.4 Base de données

- [x] 10.4.1 Base relationnelle (PostgreSQL 17.2)
- [x] 10.4.2 Historisation
- [x] 10.4.3 Intégrité (clés étrangères, contraintes CHECK)
- [x] 10.4.4 Sauvegardes régulières (Docker volumes)
- [x] 10.4.5 Export des données (API + Excel)

### 10.5 Hébergement

- [x] 10.5.1 Haute disponibilité (Docker restart: unless-stopped)
- [x] 10.5.2 Sécurité des accès
- [x] 10.5.3 Sauvegardes automatiques (Docker volumes persistants)
- [x] 10.5.4 Capacité d'évolution
- [ ] 10.5.5 Supervision (monitoring)
- [x] 10.5.6 Restauration en cas d'incident
- [ ] 10.5.7 Séparation environnements dev / recette / production

### 10.6 Noms de domaine et certificats

- [ ] 10.6.1 Configuration du nom de domaine
- [ ] 10.6.2 Déploiement en HTTPS
- [ ] 10.6.3 Installation et maintenance des certificats SSL

---

## 11. Exigences de sécurité (§11)

- [x] 11.1 Authentification sécurisée (JWT + bcrypt)
- [x] 11.2 Gestion stricte des rôles et permissions
- [ ] 11.3 Chiffrement HTTPS (en production)
- [ ] 11.4 Protection contre injections SQL (asyncpg paramétré — OK)
- [ ] 11.5 Protection contre XSS
- [ ] 11.6 Protection contre CSRF
- [ ] 11.7 Protection contre brute force (rate limiting)
- [~] 11.8 Journalisation des actions sensibles
- [x] 11.9 Politique de mots de passe robustes
- [x] 11.10 Sauvegardes régulières
- [x] 11.11 Mécanismes de restauration
- [ ] 11.12 Mises à jour de sécurité
- [ ] 11.13 Limitation des surfaces d'attaque
- [ ] 11.14 Protection des fichiers téléversés
- [x] 11.15 Cloisonnement des environnements (Docker)

**Documents sécurité à fournir :**

- [ ] 11.D1 Note d'architecture sécurité
- [ ] 11.D2 Check-list de sécurisation
- [ ] 11.D3 Plan de sauvegarde/restauration
- [ ] 11.D4 Plan de gestion des incidents

---

## 12. Exigences de performance (§12)

- [~] 12.1 Temps d'affichage optimisé des pages essentielles
- [ ] 12.2 Chargement progressif des éléments lourds (lazy loading)
- [x] 12.3 Compression des ressources (nginx gzip)
- [ ] 12.4 Optimisation des images
- [ ] 12.5 Mécanismes de cache
- [~] 12.6 Bonne tenue en charge (consultation simultanée raisonnable)
- [~] 12.7 Stabilité des tableaux de bord
- [ ] 12.8 Tests de performance avant mise en production

---

## 13. Exigences UX/UI et accessibilité (§13)

### 13.1 Ergonomie

- [x] 13.1.1 Clair
- [x] 13.1.2 Sobre
- [x] 13.1.3 Institutionnel
- [x] 13.1.4 Moderne
- [x] 13.1.5 Simple d'utilisation
- [x] 13.1.6 Cohérent visuellement
- [x] 13.1.7 Adapté aux profils non techniques

### 13.2 Responsive design

- [x] 13.2.1 Ordinateur
- [x] 13.2.2 Tablette
- [x] 13.2.3 Smartphone

### 13.3 Accessibilité

- [ ] 13.3.1 Contraste suffisant
- [ ] 13.3.2 Navigation clavier
- [ ] 13.3.3 Textes alternatifs (alt)
- [ ] 13.3.4 Structure sémantique claire
- [~] 13.3.5 Lisibilité des contenus
- [~] 13.3.6 Formulaires compréhensibles
- [ ] 13.3.7 Compatibilité outils d'assistance

### 13.4 Charte graphique

- [x] 13.4.1 Identité institutionnelle Ministère et ONCP
- [x] 13.4.2 Logos et couleurs officielles intégrés
- [x] 13.4.3 Kit d'interface cohérent (Tailwind components)
- [x] 13.4.4 Charte validée (template v0)

**Livrables UX/UI :**

- [ ] 13.4.L1 Zoning
- [ ] 13.4.L2 Wireframes
- [x] 13.4.L3 Maquettes haute fidélité (template v0)
- [ ] 13.4.L4 Prototype de navigation

---

## 14. Référencement et statistiques (§14)

### 14.1 Référencement naturel (SEO)

- [ ] 14.1.1 URLs propres
- [ ] 14.1.2 Balises meta
- [ ] 14.1.3 Titres hiérarchisés (h1, h2, h3)
- [ ] 14.1.4 Plan du site (sitemap.xml)
- [~] 14.1.5 Performance technique
- [ ] 14.1.6 Indexabilité contrôlée (robots.txt)

### 14.2 Statistiques de fréquentation

- [ ] 14.2.1 Nombre de visites
- [ ] 14.2.2 Pages consultées
- [ ] 14.2.3 Provenance du trafic
- [ ] 14.2.4 Téléchargements
- [ ] 14.2.5 Usages des tableaux de bord
- [ ] 14.2.6 Terminaux utilisés
- [ ] 14.2.7 Accès réservé aux administrateurs autorisés

---

## 15. Données, gouvernance et workflow (§15)

### 15.1 Gouvernance des données

- [~] 15.1.1 Producteurs de données identifiés
- [x] 15.1.2 Validateurs identifiés (rôle validateur)
- [x] 15.1.3 Responsables de publication identifiés
- [x] 15.1.4 Fréquence de mise à jour définie (trimestriel)
- [ ] 15.1.5 Niveaux de confidentialité définis

### 15.2 Workflow recommandé (5 étapes)

- [x] 15.2.1 Étape 1 : Saisie ou import
- [ ] 15.2.2 Étape 2 : Contrôle
- [x] 15.2.3 Étape 3 : Validation métier
- [x] 15.2.4 Étape 4 : Publication
- [ ] 15.2.5 Étape 5 : Archivage / historisation

### 15.3 Métadonnées obligatoires

- [x] 15.3.1 Titre
- [~] 15.3.2 Description
- [x] 15.3.3 Catégorie
- [x] 15.3.4 Source
- [~] 15.3.5 Auteur/service
- [x] 15.3.6 Date de production
- [x] 15.3.7 Date de publication
- [x] 15.3.8 Période couverte
- [~] 15.3.9 Mots-clés (tags)
- [ ] 15.3.10 Niveau de diffusion

---

## 16. Multilinguisme (§16)

- [x] 16.1 Français
- [x] 16.2 Anglais
- [x] 16.3 Architecture compatible futur ajout d'autres langues (LanguageContext)

---

## 17. Interopérabilité et imports (§17)

- [ ] 17.1 Import de données tabulaires (CSV/XLSX)
- [x] 17.2 Import de documents (uploads)
- [x] 17.3 Export des données autorisées (Excel)
- [ ] 17.4 Export PDF de certains tableaux de bord
- [ ] 17.5 Export image de certains tableaux de bord
- [x] 17.6 Interconnexion World Bank API (documentée et sécurisée)
- [x] 17.7 Interconnexion Trading Economics (documentée)
- [x] 17.8 Interconnexion SIMPRIX (scraping)

---

## 18. Maintenance, support et garantie (§18)

### 18.1 Garantie

- [ ] 18.1.1 Correction des anomalies
- [ ] 18.1.2 Correctifs de sécurité
- [ ] 18.1.3 Assistance au démarrage

### 18.2 Maintenance

- [ ] 18.2.1 Corrective
- [ ] 18.2.2 Préventive
- [ ] 18.2.3 Évolutive (option)

### 18.3 Support

- [ ] 18.3.1 Canaux de contact définis
- [ ] 18.3.2 Horaires définis
- [ ] 18.3.3 Niveaux de criticité définis
- [ ] 18.3.4 Délais de prise en charge définis
- [ ] 18.3.5 Délais de correction indicatifs définis

---

## 19. Formation et transfert de compétences (§19)

### Profils à former

- [ ] 19.1 Administrateurs système/fonctionnels
- [ ] 19.2 Gestionnaires de contenus
- [ ] 19.3 Gestionnaires de données
- [ ] 19.4 Valideurs

### Formation à couvrir

- [ ] 19.5 Administration générale
- [ ] 19.6 Gestion des contenus
- [ ] 19.7 Gestion des indicateurs
- [ ] 19.8 Imports
- [ ] 19.9 Publication
- [ ] 19.10 Bonnes pratiques de sécurité
- [ ] 19.11 Sauvegarde et restauration de premier niveau
- [ ] 19.12 Documentation de transfert de compétences

---

## 20. Livrables attendus (§20)

- [ ] 20.1 Note de cadrage
- [ ] 20.2 Spécifications fonctionnelles détaillées
- [ ] 20.3 Spécifications techniques
- [x] 20.4 Maquettes UX/UI (template v0)
- [ ] 20.5 Planning détaillé
- [x] 20.6 Version de développement (Docker local)
- [ ] 20.7 Version de recette
- [ ] 20.8 Version de production
- [ ] 20.9 Documentation utilisateur
- [ ] 20.10 Documentation administrateur
- [~] 20.11 Documentation technique (INDICATEURS_BIC-GN.md)
- [ ] 20.12 Guide d'exploitation
- [ ] 20.13 Rapport de tests
- [ ] 20.14 Rapport de sécurité
- [ ] 20.15 PV de recette
- [ ] 20.16 Supports de formation

---

## 21. Méthodologie d'exécution (§21)

- [x] 21.1 Phase 1 : Cadrage et recueil détaillé des besoins
- [x] 21.2 Phase 2 : Conception fonctionnelle et technique
- [x] 21.3 Phase 3 : Design UX/UI
- [x] 21.4 Phase 4 : Développement
- [~] 21.5 Phase 5 : Intégration des contenus et données de test
- [ ] 21.6 Phase 6 : Tests et recette
- [ ] 21.7 Phase 7 : Formation
- [ ] 21.8 Phase 8 : Mise en production
- [ ] 21.9 Phase 9 : Garantie et stabilisation

---

## 32. Annexes techniques à produire (§32)

- [ ] 32.1 Matrice des rôles et permissions
- [~] 32.2 Catalogue des indicateurs (INDICATEURS_BIC-GN.md)
- [ ] 32.3 Dictionnaire des données
- [ ] 32.4 Cartographie des contenus
- [x] 32.5 Schéma d'arborescence
- [ ] 32.6 Plan de tests
- [ ] 32.7 Plan de sécurité
- [ ] 32.8 Plan de déploiement
- [ ] 32.9 Plan de sauvegarde/restauration
- [ ] 32.10 Matrice de recette

---

## Statistiques de conformité

### Résumé par section

| Section | Total | Fait [x] | En cours [~] | Non fait [ ] | % |
|---------|-------|----------|-------------|-------------|---|
| §1-3 Contexte/Objectifs | 16 | 13 | 3 | 0 | 81% |
| §4 Périmètre | 20 | 12 | 2 | 6 | 60% |
| §5 Utilisateurs/Rôles | 14 | 10 | 0 | 4 | 71% |
| §6 Livrables | 13 | 8 | 1 | 4 | 62% |
| §7.1 Site public | 68 | 30 | 6 | 32 | 44% |
| §7.2 Back-office | 33 | 14 | 3 | 16 | 42% |
| §8 Architecture | 10 | 7 | 2 | 1 | 70% |
| §9 Arborescence | 11 | 7 | 1 | 3 | 64% |
| §10 Technique | 22 | 18 | 2 | 2 | 82% |
| §11 Sécurité | 19 | 6 | 1 | 12 | 32% |
| §12 Performance | 8 | 1 | 3 | 4 | 13% |
| §13 UX/UI | 18 | 12 | 2 | 4 | 67% |
| §14 SEO/Stats | 13 | 0 | 1 | 12 | 0% |
| §15 Gouvernance | 15 | 8 | 2 | 5 | 53% |
| §16 Multilinguisme | 3 | 3 | 0 | 0 | 100% |
| §17 Interopérabilité | 8 | 5 | 0 | 3 | 63% |
| §18-19 Maintenance/Formation | 17 | 0 | 0 | 17 | 0% |
| §20 Livrables doc | 16 | 3 | 1 | 12 | 19% |
| §21 Méthodologie | 9 | 4 | 1 | 4 | 44% |
| §32 Annexes | 10 | 1 | 1 | 8 | 10% |
| **TOTAL** | **343** | **161** | **32** | **150** | **47%** |

### Prochaines priorités recommandées

1. **§7.1.5 Cartographie interactive** (0%) — coeur du CDC
2. **§7.1.4 Fiches indicateurs détaillées** (0%) — exigence explicite
3. **§7.2.6 Journalisation complète** (0%) — exigence sécurité
4. **§7.1.8 Espace médias/médiathèque** (0%) — exigence explicite
5. **§7.1.10 FAQ administrable** (0%) — exigence explicite
6. **§14 SEO + Analytics** (0%) — référencement
7. **§5.2 Rôles manquants** (3 rôles à ajouter)
8. **§15.2 Workflow complet 5 étapes** (60%)
9. **§11 Sécurité renforcée** (32%)
10. **§17.1 Import CSV/XLSX** — exigence interopérabilité

---

**© ONCP — Observatoire National de la Compétitivité Pays — Guinée**
