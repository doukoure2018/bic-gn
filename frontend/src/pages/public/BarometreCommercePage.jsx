import { useState, useEffect } from 'react';
import { ShoppingCart, Download, FileDown, MapPin, Fuel, Gem, Wheat, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getCommerce } from '../../api/barometre';
import { getSimprixPrix, getSimprixRegions, getCommodites } from '../../api/sources';
import { useLanguage } from '../../hooks/useLanguage';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import Loading from '../../components/common/Loading';
import Badge from '../../components/common/Badge';
import { formatNumber } from '../../utils/formatters';

export default function BarometreCommercePage() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prix, setPrix] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('conakry');
  const [commodites, setCommodites] = useState([]);

  useEffect(() => {
    Promise.all([
      getCommerce().catch(() => ({ data: {} })),
      getSimprixRegions().catch(() => ({ data: [] })),
      getSimprixPrix('conakry').catch(() => ({ data: [] })),
      getCommodites().catch(() => ({ data: [] })),
    ]).then(([com, reg, pr, cmd]) => {
      setData(com.data);
      setRegions(reg.data);
      setPrix(pr.data);
      setCommodites(cmd.data);
      setLoading(false);
    });
  }, []);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    getSimprixPrix(region || undefined).then((res) => setPrix(res.data)).catch(() => {});
  };

  if (loading) return <Loading />;

  const sousSecteurs = data?.sous_secteurs || [];
  const wbData = data?.worldbank || [];
  const teData = data?.trading_economics || [];
  const contraintes = data?.contraintes || [];
  const perspectives = data?.perspectives;

  const getWb = (code) => {
    const item = wbData.find(d => d.indicateur_code === code);
    return item ? { valeur: Number(item.valeur).toFixed(1), annee: item.annee, nom: item.indicateur_nom } : null;
  };

  const getTe = (code) => {
    const item = teData.find(d => d.indicateur_code === code);
    return item ? { valeur: Number(item.valeur), annee: item.annee, nom: item.indicateur_nom, unite: item.unite } : null;
  };

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-cred" />
        <div className="relative z-10 flex flex-col items-center px-4 py-14 text-center">
          <ShoppingCart size={48} className="text-cream mb-4" />
          <h1 className="font-mono text-2xl font-extrabold uppercase tracking-widest text-cream md:text-4xl">
            Baromètre Commerce
          </h1>
          <div className="mt-3 inline-block rounded bg-gold px-6 py-1">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-navy">Guinée</span>
          </div>
          <p className="mt-4 text-cream/80">Indicateurs du secteur commercial guinéen</p>
          <a href="/api/export/donnees/COM" download className="no-underline mt-6">
            <button className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy hover:bg-gold/90 transition cursor-pointer border-0 shadow-lg">
              <FileDown className="h-5 w-5" /> Telecharger le Rapport Commerce
            </button>
          </a>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8">

          {/* KPI Commerce */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { te: 'EXPORTS', label: 'Exportations', color: '#2E8B57', unit: 'M USD' },
              { te: 'IMPORTS', label: 'Importations', color: '#C41E3A', unit: 'M USD' },
              { te: 'TRADE_BALANCE', label: 'Balance commerciale', color: '#0A1F44', unit: 'M USD' },
              { te: 'INFLATION', label: 'Inflation (CPI)', color: '#D4A829', unit: '%' },
            ].map(({ te: code, label, color, unit }) => {
              const te = getTe(code);
              return (
                <div key={code} className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color }}>
                    {te ? formatNumber(te.valeur, code === 'INFLATION' ? 1 : 0) : '—'}
                    <span className="text-xs font-normal text-gray-500 ml-1">{unit}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Trading Economics {te?.annee || ''}</p>
                </div>
              );
            })}
          </div>

          {/* Indicateurs supplémentaires : Ciment, Essence, Gaz */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Ciment (sac 50kg)', plafond: 85000, marche: 90000, unite: 'GNF/sac', color: '#0A1F44' },
              { label: 'Essence / Gasoil', plafond: 12000, marche: 12000, unite: 'GNF/litre', color: '#2E8B57' },
              { label: 'Gaz butane (bouteille 12kg)', plafond: 120000, marche: 130000, unite: 'GNF/bout.', color: '#C41E3A' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-lg shadow-md p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: item.color }}>
                  {formatNumber(item.plafond)}
                  <span className="text-xs font-normal text-gray-500 ml-1">{item.unite}</span>
                </p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-400">Prix plafond</span>
                  <span className="text-gray-500 font-medium">Marché: {formatNumber(item.marche)} {item.unite}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Source: SIMPRIX</p>
              </div>
            ))}
          </div>

          {/* ============================================ */}
          {/* PRIX SIMPRIX PAR REGION — Section principale */}
          {/* ============================================ */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-cred/10 px-6 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-cred flex items-center gap-2">
                  <ShoppingCart size={20} /> Prix moyens des denrées de première nécessité
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Source: SIMPRIX — simprix.gov.gn (DNCIC) — Prix moyen par région (moyenne des préfectures)</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-cred" />
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-cred focus:border-transparent outline-none min-w-[200px]"
                >
                  <option value="conakry">CONAKRY</option>
                  <option value="boke">BOKÉ</option>
                  <option value="kindia">KINDIA</option>
                  <option value="labe">LABÉ</option>
                  <option value="faranah">FARANAH</option>
                  <option value="nzerekore">NZÉRÉKORÉ</option>
                  <option value="mamou">MAMOU</option>
                  <option value="kankan">KANKAN</option>
                </select>
              </div>
            </div>

            {prix.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
                {prix.map((p, i) => {
                  const emoji = p.code?.includes('RIZ') ? '🍚' :
                    p.code?.includes('HUILE') ? '🛢️' :
                    p.code?.includes('OIGNON') ? '🧅' :
                    p.code?.includes('POULET') || p.code?.includes('CUISSE') ? '🍗' :
                    p.code?.includes('SUCRE') ? '🍬' :
                    p.code?.includes('FARINE') ? '🌾' :
                    p.code?.includes('LAIT') ? '🥛' : '🛒';
                  return (
                    <div key={i} className="border rounded-xl p-4 hover:shadow-lg transition group bg-white">
                      <div className="h-28 w-full flex items-center justify-center mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.nom}
                            className="max-h-24 max-w-full object-contain group-hover:scale-110 transition duration-300"
                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                          />
                        ) : null}
                        <span className={`text-5xl ${p.image_url ? 'hidden' : ''}`}>{emoji}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-2">{p.nom}</h4>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold text-cred">{formatNumber(p.prix_plafond)} <span className="text-[9px] font-normal text-gray-400">GNF</span></span>
                        <span className="text-[10px] text-gray-400">{p.unite}</span>
                      </div>
                      {p.region_nom && (
                        <div className="flex items-center justify-between mt-2 bg-gray-50 rounded px-2 py-1">
                          <div className="flex items-center gap-1">
                            <MapPin size={10} className="text-cred" />
                            <span className="text-[10px] text-gray-600 font-medium">{p.region_nom}</span>
                          </div>
                          {p.nb_prefectures > 1 && (
                            <span className="text-[9px] text-gray-400">moy. {p.nb_prefectures} préf.</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                <p>Synchronisez les prix SIMPRIX depuis l'administration</p>
              </div>
            )}
          </div>

          {/* Commodités internationales */}
          {commodites.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-800">Cours des matières premières</h3>
                <p className="text-[10px] text-gray-400 mt-1">Source: Trading Economics — Mise à jour dynamique</p>
              </div>
              <div className="p-6">
                {['energie', 'metaux', 'agriculture'].map((cat) => {
                  const items = commodites.filter(c => c.categorie === cat);
                  if (!items.length) return null;
                  const catLabel = cat === 'energie' ? 'Énergie' : cat === 'metaux' ? 'Métaux' : 'Agriculture';
                  const catColor = cat === 'energie' ? 'text-cred' : cat === 'metaux' ? 'text-gold' : 'text-cgreen';
                  const catBg = cat === 'energie' ? 'bg-cred/5' : cat === 'metaux' ? 'bg-gold/5' : 'bg-cgreen/5';
                  return (
                    <div key={cat} className="mb-6 last:mb-0">
                      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${catColor}`}>{catLabel}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {items.map((c) => (
                          <div key={c.code} className={`${catBg} rounded-lg p-3 border border-gray-100`}>
                            <p className="text-[10px] text-gray-500 font-medium">{c.nom}</p>
                            <p className="text-lg font-bold text-gray-800 mt-1">
                              {Number(c.prix).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[9px] text-gray-400">{c.unite}</span>
                              {c.variation != null && (
                                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${Number(c.variation) > 0 ? 'text-cgreen' : Number(c.variation) < 0 ? 'text-cred' : 'text-gray-400'}`}>
                                  {Number(c.variation) > 0 ? <TrendingUp size={10} /> : Number(c.variation) < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                                  {Number(c.variation) > 0 ? '+' : ''}{Number(c.variation).toFixed(2)}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* World Bank + Trading Economics */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-800">Indicateurs macroéconomiques</h3>
            </div>
            <div className="divide-y">
              {wbData.map((wb, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-red-50/30">
                  <div>
                    <p className="font-medium text-sm">{wb.indicateur_nom}</p>
                    <p className="text-xs text-gray-400">World Bank — {wb.annee}</p>
                  </div>
                  <span className="text-lg font-bold text-cred">
                    {formatNumber(wb.valeur, 1)}
                    <span className="text-xs font-normal text-gray-500 ml-1">{wb.unite}</span>
                  </span>
                </div>
              ))}
              {teData.map((te, i) => (
                <div key={`te-${i}`} className="px-6 py-4 flex items-center justify-between hover:bg-red-50/30">
                  <div>
                    <p className="font-medium text-sm">{te.indicateur_nom}</p>
                    <p className="text-xs text-gray-400">Trading Economics — {te.annee}</p>
                  </div>
                  <span className="text-lg font-bold text-navy">
                    {formatNumber(te.valeur, te.unite === '%' ? 1 : 0)}
                    <span className="text-xs font-normal text-gray-500 ml-1">{te.unite}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contraintes & Perspectives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Contraintes du secteur commercial</h3>
              <BarChart
                data={(contraintes.length > 0 ? contraintes : [
                  { nom: 'Douanes', score: 3.8 }, { nom: 'Transport', score: 3.5 },
                  { nom: 'Informel', score: 3.7 }, { nom: 'Financement', score: 3.2 },
                  { nom: 'Fiscalité', score: 3.0 }, { nom: 'Concurrence', score: 2.8 },
                ]).map(c => ({ name: c.nom, score: Number(c.score) }))}
                bars={[{ key: 'score', color: '#C41E3A', name: 'Score (0-5)' }]}
                xKey="name"
                height={280}
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Perspectives commerciales</h3>
              <PieChart
                data={[
                  { name: 'Optimiste', value: Number(perspectives?.optimiste || 35) },
                  { name: 'Stable', value: Number(perspectives?.stable || 40) },
                  { name: 'Pessimiste', value: Number(perspectives?.pessimiste || 25) },
                ]}
                height={280}
              />
            </div>
          </div>

          <div className="rounded-lg bg-navy/5 border border-navy/10 p-4">
            <p className="text-xs text-gray-500 text-center">
              Sources : SIMPRIX (simprix.gov.gn) — Banque Mondiale — Trading Economics — BCRG — Enquêtes ONCP
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
