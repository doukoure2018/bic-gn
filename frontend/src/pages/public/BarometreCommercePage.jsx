import { useState, useEffect } from 'react';
import { ShoppingCart, Download } from 'lucide-react';
import { getCommerce } from '../../api/barometre';
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

  useEffect(() => {
    getCommerce()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8">

          {/* KPI Commerce - Trading Economics + World Bank */}
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
                  <p className="text-xs text-gray-400 mt-1">Source: Trading Economics ({te?.annee || '—'})</p>
                </div>
              );
            })}
          </div>

          {/* Sous-secteurs commerce */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-cred/10 px-6 py-4 border-b">
              <h3 className="font-semibold text-cred flex items-center gap-2">
                <ShoppingCart size={20} /> Sous-secteurs commerciaux
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {sousSecteurs.map((ss) => (
                <div key={ss.code} className="border rounded-lg p-4 hover:border-cred/50 transition">
                  <p className="font-medium">{ss.nom}</p>
                  <p className="text-xs text-gray-500 mt-1">{ss.nom_en}</p>
                </div>
              ))}
            </div>
          </div>

          {/* World Bank indicators */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-800">Indicateurs macroéconomiques (Banque Mondiale)</h3>
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

          {/* Indicateurs détaillés */}
          {data?.indicateurs?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Indicateurs détaillés</h3>
                <a href="/api/export/donnees/COM" download className="no-underline">
                  <button className="flex items-center gap-1 bg-cred text-cream px-3 py-1.5 rounded text-xs font-medium cursor-pointer border-0 hover:bg-cred/90">
                    <Download size={14} /> Export Excel
                  </button>
                </a>
              </div>
              <div className="divide-y">
                {data.indicateurs.map((ind, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-red-50/30">
                    <div>
                      <p className="font-medium text-sm">{ind.nom}</p>
                      <p className="text-xs text-gray-500">{ind.categorie}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-cred">
                        {formatNumber(ind.valeur, 1)}
                        <span className="text-xs font-normal text-gray-500 ml-1">{ind.unite}</span>
                      </span>
                      {ind.tendance && <Badge status={ind.tendance}>{ind.tendance}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-navy/5 border border-navy/10 p-4">
            <p className="text-xs text-gray-500 text-center">
              Sources : Banque Mondiale • Trading Economics • SIMPRIX • BCRG • Douanes Guinée • Enquêtes ONCP
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
