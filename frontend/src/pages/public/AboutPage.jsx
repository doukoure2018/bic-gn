import { useState } from 'react';
import { Target, Eye, Building2, Landmark, BarChart3, Settings, BookOpen, HelpCircle, ChevronDown, ChevronUp, Factory, ShoppingCart, Users, TrendingUp, FileText, Shield } from 'lucide-react';

const TABS = [
  { id: 'presentation', icon: BarChart3, label: 'Présentation' },
  { id: 'mission', icon: Target, label: 'Mission & Vision' },
  { id: 'ministere', icon: Building2, label: 'Ministère' },
  { id: 'oncp', icon: Eye, label: 'ONCP' },
  { id: 'objectifs', icon: Target, label: 'Objectifs' },
  { id: 'gouvernance', icon: Settings, label: 'Gouvernance' },
  { id: 'methodologie', icon: BookOpen, label: 'Méthodologie' },
  { id: 'glossaire', icon: HelpCircle, label: 'Glossaire' },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('presentation');

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-navy to-navy/80 text-cream px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-3">
          <BarChart3 size={24} />
          <h1 className="text-lg font-bold">Guinée : A Propos du Baromètre</h1>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer bg-transparent ${
                activeTab === tab.id
                  ? 'border-navy text-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-5xl w-full px-4 py-6 lg:px-8">

        <div className="space-y-6">

          {/* Presentation */}
          {activeTab === 'presentation' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p>Le <strong>Barometre Industrie & Commerce de Guinee (BIC-GN)</strong> est une plateforme web institutionnelle et decisionnelle mise en place par le Ministere de l'Industrie et du Commerce, administree par l'Observatoire National de la Competitivite-Pays (ONCP).</p>
            <p className="mt-3">Elle est destinee a centraliser, structurer, publier et valoriser les donnees, indicateurs, analyses et publications relatifs aux secteurs de l'industrie et du commerce en Republique de Guinee.</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: Building2, label: 'Outil institutionnel de visibilite et de communication' },
                { icon: Landmark, label: 'Outil d\'aide a la decision pour les pouvoirs publics' },
                { icon: Users, label: 'Outil d\'information economique pour les entreprises, investisseurs, chercheurs et PTF' },
                { icon: Settings, label: 'Outil d\'administration et de diffusion de donnees pilote par l\'ONCP' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                  <item.icon className="h-4 w-4 text-navy mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Mission et Vision */}
          {activeTab === 'mission' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-cgreen/5 rounded-lg p-5 border border-cgreen/20">
                <h4 className="font-semibold text-cgreen text-sm mb-2">Mission</h4>
                <p className="text-xs text-gray-700 leading-relaxed">Renforcer la transparence, la disponibilite de l'information economique sectorielle, la lecture des tendances, ainsi que la capacite de suivi des performances des secteurs de l'industrie et du commerce en Republique de Guinee.</p>
              </div>
              <div className="bg-navy/5 rounded-lg p-5 border border-navy/20">
                <h4 className="font-semibold text-navy text-sm mb-2">Vision</h4>
                <p className="text-xs text-gray-700 leading-relaxed">Devenir la plateforme de reference pour la diffusion structuree, lisible et securisee d'indicateurs, d'analyses et de publications sur l'industrie et le commerce en Guinee, au service des decideurs, investisseurs et du grand public.</p>
              </div>
            </div>
          </div>
          )}

          {/* 7.1.2.3 — Role du Ministere */}
          {activeTab === 'ministere' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <img src="/images/armoirie.jpeg" alt="Armoiries" className="h-20 w-auto rounded shrink-0" />
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">Le <strong>Ministere de l'Industrie et du Commerce</strong> est la maitrise d'ouvrage du projet BIC-GN. Il est charge de :</p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-700">
                  <li className="flex items-start gap-1.5">• Definir les orientations strategiques du barometre</li>
                  <li className="flex items-start gap-1.5">• Valider les indicateurs prioritaires</li>
                  <li className="flex items-start gap-1.5">• Fournir les contenus, logos, chartes et donnees officielles</li>
                  <li className="flex items-start gap-1.5">• Faciliter les arbitrages fonctionnels</li>
                  <li className="flex items-start gap-1.5">• Organiser les sessions de validation</li>
                </ul>
                <p className="mt-3 text-[10px] text-gray-400">Adresse : Boulevard du Commerce, Quartier Almamyah, Conakry — www.mcipme.gov.gn</p>
              </div>
            </div>
          </div>
          )}

          {/* 7.1.2.4 — Role de l'ONCP */}
          {activeTab === 'oncp' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <img src="/images/logo-bicgn.jpeg" alt="ONCP" className="h-20 w-auto rounded shrink-0" />
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">L'<strong>ONCP</strong> est la maitrise d'ouvrage deleguee et l'administration metier du BIC-GN. Il est charge de :</p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-700">
                  <li>• Administrer la plateforme et piloter la diffusion des donnees</li>
                  <li>• Collecter, structurer et publier les indicateurs sectoriels</li>
                  <li>• Produire les analyses, rapports et notes de conjoncture</li>
                  <li>• Coordonner les enquetes aupres des entreprises</li>
                  <li>• Gerer les utilisateurs et les droits d'acces</li>
                  <li>• Assurer la fiabilite, la tracabilite et l'integrite des informations</li>
                </ul>
                <p className="mt-3 text-[10px] text-gray-500 italic">« Observer - Analyser - Eclairer l'action publique »</p>
                <p className="text-[10px] text-gray-400">Directeur General : KANE Moussa</p>
              </div>
            </div>
          </div>
          )}

          {/* 7.1.2.5 — Objectifs */}
          {activeTab === 'objectifs' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: BarChart3, text: 'Publier des indicateurs sectoriels regulierement mis a jour' },
                { icon: TrendingUp, text: 'Visualiser les donnees sous forme de tableaux, graphiques, cartes et syntheses' },
                { icon: FileText, text: 'Diffuser des notes d\'analyse, bulletins, rapports et publications' },
                { icon: Factory, text: 'Comparer des periodes, secteurs, filieres et zones geographiques' },
                { icon: Shield, text: 'Garantir la fiabilite, la tracabilite et l\'integrite des informations' },
                { icon: Users, text: 'Offrir un acces differencie selon les profils utilisateurs' },
                { icon: Settings, text: 'Administrer les donnees et contenus depuis un back-office securise' },
                { icon: ShoppingCart, text: 'Faciliter l\'export et le partage des donnees et publications' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white border rounded-lg p-3">
                  <item.icon className="h-4 w-4 text-cgreen mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* 7.1.2.6 — Gouvernance */}
          {activeTab === 'gouvernance' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-xs text-gray-700 mb-4">La gouvernance du BIC-GN repose sur un workflow de validation en 5 etapes et des roles differencies :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-navy mb-2">Workflow de publication</h4>
                <div className="space-y-2">
                  {['1. Saisie ou import des donnees', '2. Controle de coherence', '3. Validation metier (ONCP)', '4. Publication sur la plateforme', '5. Archivage et historisation'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-cream text-[10px] font-bold shrink-0">{i + 1}</span>
                      <span className="text-xs text-gray-700">{step.substring(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-navy mb-2">Profils utilisateurs internes</h4>
                <div className="space-y-1.5">
                  {[
                    { role: 'Super administrateur', desc: 'Acces total au systeme' },
                    { role: 'Administrateur institutionnel', desc: 'Gestion du contenu officiel' },
                    { role: 'Administrateur metier ONCP', desc: 'Pilotage des indicateurs' },
                    { role: 'Editeur de contenu', desc: 'Saisie des donnees et articles' },
                    { role: 'Analyste / Gestionnaire', desc: 'Analyse et gestion des donnees' },
                    { role: 'Valideur / Approbateur', desc: 'Validation avant publication' },
                    { role: 'Lecteur interne', desc: 'Consultation avec acces restreint' },
                  ].map((r) => (
                    <div key={r.role} className="flex items-center justify-between bg-gray-50 rounded p-2">
                      <span className="text-xs font-medium text-gray-800">{r.role}</span>
                      <span className="text-[10px] text-gray-500">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-navy mb-2">Sources des donnees</h4>
              <div className="flex flex-wrap gap-2">
                {['Banque Mondiale (API)', 'Trading Economics', 'INS Guinee', 'BCRG', 'SIMPRIX', 'ANASA', 'Douanes', 'Enquetes ONCP', 'Freedom House'].map((s) => (
                  <span key={s} className="text-[10px] bg-navy/5 text-navy px-2 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* 7.1.2.7 — Methodologie */}
          {activeTab === 'methodologie' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-navy mb-2">Indice synthetique IBIC</h4>
                <p className="text-xs text-gray-700 mb-3">L'Indice du Barometre Industrie et Commerce (IBIC) est calcule comme un indice pondere base sur les composantes suivantes :</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-gray-50 border-b">
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Composante</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">Ponderation</th>
                    </tr></thead>
                    <tbody>
                      {[
                        ['Production / Ventes', '20%'], ['Chiffre d\'affaires', '15%'], ['Investissements', '15%'],
                        ['Emploi', '15%'], ['Exportations', '10%'], ['Stocks', '5%'],
                        ['Tresorerie', '10%'], ['Perspectives', '10%'],
                      ].map(([comp, poids]) => (
                        <tr key={comp} className="border-b"><td className="px-3 py-2">{comp}</td><td className="px-3 py-2 text-right font-semibold">{poids}</td></tr>
                      ))}
                      <tr className="bg-navy/5 font-bold"><td className="px-3 py-2">Total</td><td className="px-3 py-2 text-right">100%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-navy mb-2">Interpretation de l'IBIC</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-cgreen/10 rounded-lg p-4 text-center border border-cgreen/20">
                    <p className="text-2xl font-bold text-cgreen">60-100</p><p className="text-xs text-gray-600 mt-1">Situation bonne</p>
                  </div>
                  <div className="bg-gold/10 rounded-lg p-4 text-center border border-gold/20">
                    <p className="text-2xl font-bold text-gold">40-60</p><p className="text-xs text-gray-600 mt-1">Situation stable</p>
                  </div>
                  <div className="bg-cred/10 rounded-lg p-4 text-center border border-cred/20">
                    <p className="text-2xl font-bold text-cred">0-40</p><p className="text-xs text-gray-600 mt-1">Situation mauvaise</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-navy mb-2">Calcul de l'IPI (Indice de Production Industrielle)</h4>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 space-y-1">
                  <p>IPI_sous-secteur = (Production actuelle / Production de base) x 100</p>
                  <p>IPI Total = Somme (IPI_i x Poids_i)</p>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-gray-50 border-b">
                      <th className="px-3 py-2 text-left">Sous-secteur</th>
                      <th className="px-3 py-2 text-right">Code ISIC</th>
                      <th className="px-3 py-2 text-right">Poids</th>
                    </tr></thead>
                    <tbody>
                      <tr className="border-b"><td className="px-3 py-2">Industries manufacturieres</td><td className="px-3 py-2 text-right">10-33</td><td className="px-3 py-2 text-right font-semibold">43,61%</td></tr>
                      <tr className="border-b"><td className="px-3 py-2">Extraction miniere</td><td className="px-3 py-2 text-right">05-09</td><td className="px-3 py-2 text-right font-semibold">39,25%</td></tr>
                      <tr className="border-b"><td className="px-3 py-2">Construction industrielle</td><td className="px-3 py-2 text-right">41-43</td><td className="px-3 py-2 text-right font-semibold">17,41%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-navy mb-2">Periodicite</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { freq: 'Trimestriel', desc: 'IPI, enquetes entreprises, indicateurs conjoncturels' },
                    { freq: 'Annuel', desc: 'Indicateurs macro (World Bank, INS), rapports barometre' },
                    { freq: 'Temps reel', desc: 'Prix denrees (SIMPRIX), taux de change' },
                  ].map((p) => (
                    <div key={p.freq} className="flex-1 min-w-[200px] bg-white border rounded-lg p-3">
                      <p className="text-xs font-semibold text-navy">{p.freq}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}

          {/* 7.1.2.8 — Glossaire */}
          {activeTab === 'glossaire' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-2">
              {[
                { term: 'IBIC', def: 'Indice du Barometre Industrie et Commerce — indicateur synthetique mesurant la sante economique des secteurs industriel et commercial (score 0-100).' },
                { term: 'IPI', def: 'Indice de Production Industrielle — mesure la variation de la production industrielle par rapport a une periode de reference (base 100).' },
                { term: 'ONCP', def: 'Observatoire National de la Competitivite Pays — organisme charge de l\'administration du barometre.' },
                { term: 'BIC-GN', def: 'Barometre Industrie & Commerce de Guinee — nom de la plateforme web.' },
                { term: 'ISIC', def: 'International Standard Industrial Classification (Rev. 4) — classification internationale des activites economiques (codes 05-43 pour l\'industrie).' },
                { term: 'PIB', def: 'Produit Interieur Brut — valeur totale des biens et services produits dans un pays.' },
                { term: 'IDE', def: 'Investissements Directs Etrangers — capitaux investis par des entites etrangeres dans le pays.' },
                { term: 'FBCF', def: 'Formation Brute de Capital Fixe — investissements en biens d\'equipement et infrastructures.' },
                { term: 'IPC', def: 'Indice des Prix a la Consommation — mesure l\'evolution du niveau general des prix.' },
                { term: 'INS', def: 'Institut National de la Statistique — source officielle des statistiques nationales.' },
                { term: 'BCRG', def: 'Banque Centrale de la Republique de Guinee — banque centrale, source des donnees monetaires et financieres.' },
                { term: 'SIMPRIX', def: 'Systeme d\'Information sur les Prix — plateforme gouvernementale de suivi des prix des denrees de premiere necessite.' },
                { term: 'PTF', def: 'Partenaires Techniques et Financiers — organisations internationales appuyant le developpement (Banque Mondiale, PNUD, ONUDI, etc.).' },
                { term: 'VA', def: 'Valeur Ajoutee — difference entre la valeur de la production et les consommations intermediaires.' },
                { term: 'GNF', def: 'Franc Guineen — monnaie nationale de la Republique de Guinee.' },
              ].map((item) => (
                <div key={item.term} className="flex items-start gap-3 border-b border-gray-100 pb-2">
                  <span className="bg-navy text-cream text-[10px] px-2 py-0.5 rounded font-bold shrink-0 mt-0.5">{item.term}</span>
                  <span className="text-xs text-gray-700">{item.def}</span>
                </div>
              ))}
            </div>
          </div>
          )}

        </div>
      </main>
    </div>
  );
}

