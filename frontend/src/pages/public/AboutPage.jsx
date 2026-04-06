import { useState } from 'react';
import { Target, Eye, Building2, Landmark, BarChart3, Settings, BookOpen, HelpCircle, ChevronDown, ChevronUp, Factory, ShoppingCart, Users, TrendingUp, FileText, Shield } from 'lucide-react';

const sections = [
  { id: 'presentation', icon: BarChart3, title: '7.1.2.1 — Presentation du Barometre' },
  { id: 'mission', icon: Target, title: '7.1.2.2 — Mission et Vision' },
  { id: 'ministere', icon: Building2, title: '7.1.2.3 — Role du Ministere' },
  { id: 'oncp', icon: Eye, title: '7.1.2.4 — Role de l\'ONCP' },
  { id: 'objectifs', icon: Target, title: '7.1.2.5 — Objectifs du dispositif' },
  { id: 'gouvernance', icon: Settings, title: '7.1.2.6 — Gouvernance du systeme' },
  { id: 'methodologie', icon: BookOpen, title: '7.1.2.7 — Methodologie generale' },
  { id: 'glossaire', icon: HelpCircle, title: '7.1.2.8 — Glossaire des concepts' },
];

export default function AboutPage() {
  const [openSection, setOpenSection] = useState('presentation');

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy to-navy/80" />
        <div className="relative z-10 flex flex-col items-center px-4 py-14 text-center">
          <img src="/images/logo-bicgn.jpeg" alt="BIC-GN ONCP" className="h-24 w-auto rounded-lg shadow-xl mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-cream">A Propos du Barometre</h1>
          <p className="mt-2 text-cream/70 text-sm max-w-2xl">
            Plateforme institutionnelle et decisionnelle pour le suivi de la performance economique de l'industrie et du commerce en Republique de Guinee
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {/* Navigation rapide */}
        <nav className="flex flex-wrap gap-2 mb-8 justify-center">
          {sections.map((s) => (
            <button key={s.id} onClick={() => { toggle(s.id); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                openSection === s.id ? 'bg-navy text-cream border-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-navy'
              }`}
            >{s.title.split(' — ')[1]}</button>
          ))}
        </nav>

        <div className="space-y-4">

          {/* 7.1.2.1 — Presentation */}
          <SectionBlock id="presentation" icon={BarChart3} title="Presentation du Barometre Industrie & Commerce"
            isOpen={openSection === 'presentation'} onToggle={() => toggle('presentation')}>
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
          </SectionBlock>

          {/* 7.1.2.2 — Mission et Vision */}
          <SectionBlock id="mission" icon={Target} title="Mission et Vision"
            isOpen={openSection === 'mission'} onToggle={() => toggle('mission')}>
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
          </SectionBlock>

          {/* 7.1.2.3 — Role du Ministere */}
          <SectionBlock id="ministere" icon={Building2} title="Role du Ministere de l'Industrie et du Commerce"
            isOpen={openSection === 'ministere'} onToggle={() => toggle('ministere')}>
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
          </SectionBlock>

          {/* 7.1.2.4 — Role de l'ONCP */}
          <SectionBlock id="oncp" icon={Eye} title="Role de l'ONCP — Observatoire National de la Competitivite Pays"
            isOpen={openSection === 'oncp'} onToggle={() => toggle('oncp')}>
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
          </SectionBlock>

          {/* 7.1.2.5 — Objectifs */}
          <SectionBlock id="objectifs" icon={Target} title="Objectifs du dispositif"
            isOpen={openSection === 'objectifs'} onToggle={() => toggle('objectifs')}>
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
          </SectionBlock>

          {/* 7.1.2.6 — Gouvernance */}
          <SectionBlock id="gouvernance" icon={Settings} title="Gouvernance du systeme"
            isOpen={openSection === 'gouvernance'} onToggle={() => toggle('gouvernance')}>
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
          </SectionBlock>

          {/* 7.1.2.7 — Methodologie */}
          <SectionBlock id="methodologie" icon={BookOpen} title="Methodologie generale"
            isOpen={openSection === 'methodologie'} onToggle={() => toggle('methodologie')}>
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
          </SectionBlock>

          {/* 7.1.2.8 — Glossaire */}
          <SectionBlock id="glossaire" icon={HelpCircle} title="Glossaire des concepts"
            isOpen={openSection === 'glossaire'} onToggle={() => toggle('glossaire')}>
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
          </SectionBlock>

        </div>
      </main>
    </div>
  );
}

function SectionBlock({ id, icon: Icon, title, isOpen, onToggle, children }) {
  return (
    <div id={id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer bg-transparent border-0 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
            <Icon className="h-4 w-4 text-navy" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-sm text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}
