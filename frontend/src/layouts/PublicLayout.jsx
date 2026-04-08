import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Factory, Store, BarChart3, FileText, Menu, X, Search, MapPin, Phone, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitch from '../components/common/LanguageSwitch';

const navLinks = [
  { key: 'accueil', path: '/', label: 'Accueil' },
  { key: 'apropos', path: '/a-propos', label: 'A Propos' },
  { key: 'industrie', path: '/barometre/industrie', label: 'Industrie' },
  { key: 'commerce', path: '/barometre/commerce', label: 'Commerce' },
  { key: 'donnees', path: '/donnees', label: 'Données' },
  { key: 'creer-entreprise', path: 'https://apip.gov.gn/comment-creer-mon-entreprise/', label: 'Créer mon Entreprise', external: true },
  { key: 'publications', path: '/publications', label: 'Publications' },
  { key: 'actualites', path: '/actualites', label: 'Actualités' },
  { key: 'partenaires', path: '/partenaires', label: 'Partenaires' },
  { key: 'contact', path: '/contact', label: 'Contact' },
];

const quickLinks = [
  { icon: Factory, label: 'Barometre Industrie', path: '/barometre/industrie', bg: 'bg-navy', text: 'text-cream' },
  { icon: Store, label: 'Barometre Commerce', path: '/barometre/commerce', bg: 'bg-cred', text: 'text-cream' },
  { icon: BarChart3, label: 'Donnees Statistiques', path: '/donnees', bg: 'bg-cgreen', text: 'text-cream' },
  { icon: FileText, label: 'Publications', path: '/publications', bg: 'bg-gold', text: 'text-navy' },
];

const secteurs = [
  { label: 'Extraction miniere', isic: '05-09', path: '/barometre/industrie' },
  { label: 'Industries manufacturieres', isic: '10-33', path: '/barometre/industrie' },
  { label: 'Construction', isic: '41-43', path: '/barometre/industrie' },
  { label: 'Commerce interieur', path: '/barometre/commerce' },
  { label: 'Commerce exterieur', path: '/barometre/commerce' },
];

const footerLinks = {
  barometre: [
    { label: 'Vue d\'ensemble', path: '/' },
    { label: 'Industrie', path: '/barometre/industrie' },
    { label: 'Commerce', path: '/barometre/commerce' },
    { label: 'Donnees statistiques', path: '/donnees' },
  ],
  publications: [
    { label: 'Rapports', path: '/publications' },
    { label: 'Actualites', path: '/actualites' },
    { label: 'Partenaires', path: '/partenaires' },
  ],
  institution: [
    { label: 'A propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ],
};

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 2) { setResults([]); setIsOpen(false); return; }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.results || []);
      setIsOpen(true);
    } catch { setResults([]); }
  };

  const typeLabels = { indicateur: 'Indicateur', publication: 'Publication', actualite: 'Actualite', donnee: 'Donnee', sous_secteur: 'Secteur' };
  const typeColors = { indicateur: 'bg-cgreen', publication: 'bg-navy', actualite: 'bg-cred', donnee: 'bg-gold', sous_secteur: 'bg-cgreen' };

  return (
    <div className="relative">
      <div className="flex items-center bg-cream/15 border border-cream/30 rounded-lg px-3 py-1.5">
        <Search className="h-3.5 w-3.5 text-cream/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Rechercher..."
          className="bg-transparent text-cream text-xs placeholder:text-cream/50 outline-none w-32 lg:w-48 px-2"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-80 overflow-auto">
          <div className="p-2 text-[10px] text-gray-400 border-b">{results.length} resultat(s) pour "{query}"</div>
          {results.map((r, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 cursor-pointer bg-transparent"
              style={{ border: 'none', borderBottom: '1px solid #f9fafb' }}
              onMouseDown={() => { navigate(r.url); setIsOpen(false); setQuery(''); }}
            >
              <span className={`${typeColors[r.type] || 'bg-gray-400'} text-white text-[9px] px-1.5 py-0.5 rounded font-medium`}>
                {typeLabels[r.type] || r.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-800 truncate">{r.titre}</p>
                {r.detail && <p className="text-[10px] text-gray-400 truncate">{r.detail}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PublicLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar - 2 lignes */}
      <header className="sticky top-0 z-50 shadow-lg">

        {/* Ligne 1 (blanc) : Armoirie+texte (gauche) | Simandou (centre) | Logo ONCP (droite) */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
            <Link to="/" className="flex flex-col items-center no-underline shrink-0">
              {location.pathname === '/' ? (
                <>
                  <img src="/images/armoirie.png" alt="Republique de Guinee" className="h-16 w-auto" />
                  <p className="text-[11px] text-navy font-bold leading-tight mt-1 hidden sm:block">Republique de Guinee</p>
                  <p className="text-[10px] text-gray-500 leading-tight hidden sm:block">Ministere de l'Industrie et du Commerce</p>
                </>
              ) : (
                <img src="/images/logo-barometre.png" alt="Barometre Industrie & Commerce" style={{ height: '5.5rem' }} className="w-auto" />
              )}
            </Link>
            <img src="/images/simandou2040.png" alt="Programme Simandou 2040" style={{ height: '8rem' }} className="w-auto hidden md:block" />
            <img src="/images/logo-oncp.png" alt="ONCP" style={{ height: '6rem' }} className="w-auto hidden sm:block" />
          </div>
        </div>

        {/* Ligne 2 (navy) : Menu | Recherche | FR/EN */}
        <div className="bg-navy text-cream">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 flex items-center justify-between gap-2">
            <nav className="hidden xl:flex items-center gap-0.5 py-2">
              {navLinks.map((link) => (
                link.external ? (
                  <a key={link.key} href={link.path} target="_blank" rel="noopener noreferrer"
                    className="rounded px-3 py-2 text-xs font-medium transition-colors no-underline hover:bg-gold/20 text-gold"
                  >{link.label}</a>
                ) : (
                  <Link key={link.key} to={link.path}
                    className={`rounded px-3 py-2 text-xs font-medium transition-colors no-underline hover:bg-gold/20 ${
                      location.pathname === link.path ? 'bg-gold/20 text-gold font-semibold' : 'text-cream/80'
                    }`}
                  >{link.label}</Link>
                )
              ))}
            </nav>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="rounded p-2 text-cream xl:hidden hover:bg-gold/20 cursor-pointer bg-transparent border-0 py-2"
            >{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            <div className="hidden xl:flex items-center gap-3">
              <SearchBar />
              <LanguageSwitch />
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav className="bg-navy border-t border-cream/10 px-4 pb-4 xl:hidden">
            {navLinks.map((link) => (
              link.external ? (
                <a key={link.key} href={link.path} target="_blank" rel="noopener noreferrer"
                  className="block rounded px-3 py-2 text-sm transition-colors no-underline hover:bg-gold/20 text-gold"
                  onClick={() => setMenuOpen(false)}
                >{link.label}</a>
              ) : (
                <Link key={link.key} to={link.path}
                  className={`block rounded px-3 py-2 text-sm transition-colors no-underline hover:bg-gold/20 ${
                    location.pathname === link.path ? 'text-gold font-semibold' : 'text-cream/80'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >{link.label}</Link>
              )
            ))}
            <div className="mt-2 px-3"><LanguageSwitch /></div>
          </nav>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* 7.1.1.8 — Acces secteurs/filieres */}
      <section className="bg-gray-100 px-4 py-6 border-t">
        <div className="mx-auto max-w-5xl">
          <h3 className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Acces par secteur et filiere</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {secteurs.map((s) => (
              <Link key={s.label} to={s.path}
                className="flex items-center gap-1.5 bg-white border rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:border-navy hover:text-navy transition no-underline"
              >
                {s.label}
                {s.isic && <span className="text-[9px] text-gray-400">ISIC {s.isic}</span>}
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* 7.1.1.9 — Footer institutionnel complet */}
      <footer>
        <div className="bg-navy px-4 py-10">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/images/logo-bicgn.png" alt="BIC-GN" className="h-28 w-auto mb-3" />
              <p className="text-xs text-cream/60 leading-relaxed">
                Plateforme de suivi de la performance economique nationale, promue par l'Observatoire National de la Competitivite Pays.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Barometre</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {footerLinks.barometre.map((l) => (
                  <li key={l.path}><Link to={l.path} className="text-xs text-cream/60 hover:text-cream no-underline transition">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Ressources</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {footerLinks.publications.map((l) => (
                  <li key={l.path}><Link to={l.path} className="text-xs text-cream/60 hover:text-cream no-underline transition">{l.label}</Link></li>
                ))}
              </ul>
              <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 mt-4">Institution</h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {footerLinks.institution.map((l) => (
                  <li key={l.path}><Link to={l.path} className="text-xs text-cream/60 hover:text-cream no-underline transition">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Contact</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                <li className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gold mt-0.5 shrink-0" />
                  <span className="text-xs text-cream/60">Boulevard du Commerce, Quartier Almamyah, Conakry, Republique de Guinee</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span className="text-xs text-cream/60">BP: 13</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span className="text-xs text-cream/60">info@mcipme.gov.gn</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span className="text-xs text-cream/60">www.mcipme.gov.gn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-5">
          <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-8">
            <img src="/images/simandou2040.png" alt="Programme Simandou 2040" className="h-20 w-auto" />
            <div className="h-12 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xs font-semibold text-navy">Ministere de l'Industrie et du Commerce</p>
              <p className="text-[10px] text-gray-400">Republique de Guinee</p>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <img src="/images/logo-bicgn.png" alt="BIC-GN" className="h-20 w-auto" />
            <div className="h-12 w-px bg-gray-200" />
            <img src="/images/guinee-brand.jpeg" alt="Guinee" className="h-14 w-auto" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-4 pt-4 border-t text-[10px] text-gray-400">
            <span>Ministere de l'Industrie</span><span>Ministere du Commerce</span>
            <span>BCRG</span><span>INS</span><span>Chambre de Commerce</span>
          </div>
        </div>

        <div className="bg-navy px-4 py-3">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-cream/50">© 2026 ONCP — Observatoire National de la Competitivite Pays</p>
            <p className="text-[10px] text-cream/40 italic">Travail - Justice - Solidarite</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
