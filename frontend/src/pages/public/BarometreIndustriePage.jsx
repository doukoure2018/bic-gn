import { useState, useEffect } from 'react';
import { Factory, TrendingUp, TrendingDown, Minus, Download, FileDown } from 'lucide-react';
import { getIndustrie } from '../../api/barometre';
import { useLanguage } from '../../hooks/useLanguage';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import Loading from '../../components/common/Loading';
import Badge from '../../components/common/Badge';
import { formatNumber } from '../../utils/formatters';

export default function BarometreIndustriePage() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndustrie()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const sousSecteurs = data?.sous_secteurs || [];
  const ipiData = data?.ipi_data || [];
  const wbData = data?.worldbank || [];
  const contraintes = data?.contraintes || [];
  const perspectives = data?.perspectives;

  const getWb = (code) => {
    const item = wbData.find(d => d.indicateur_code === code);
    return item ? { valeur: Number(item.valeur).toFixed(1), annee: item.annee, nom: item.indicateur_nom } : null;
  };

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-cgreen" />
        <div className="relative z-10 flex flex-col items-center px-4 py-14 text-center">
          <Factory size={48} className="text-cream mb-4" />
          <h1 className="font-mono text-2xl font-extrabold uppercase tracking-widest text-cream md:text-4xl">
            Baromètre Industrie
          </h1>
          <div className="mt-3 inline-block rounded bg-gold px-6 py-1">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-navy">Guinée</span>
          </div>
          <p className="mt-4 text-cream/80">Indicateurs du secteur industriel guinéen</p>
          <a href="/api/export/donnees/IND" download className="no-underline mt-6">
            <button className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy hover:bg-gold/90 transition cursor-pointer border-0 shadow-lg">
              <FileDown className="h-5 w-5" /> Telecharger le Rapport Industrie
            </button>
          </a>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8">

          {/* KPI World Bank */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: 'NV.IND.TOTL.ZS', color: '#0A1F44', fallback: '25.1' },
              { code: 'NV.IND.MANF.ZS', color: '#2E8B57', fallback: '12.8' },
              { code: 'SL.IND.EMPL.ZS', color: '#D4A829', fallback: '14.2' },
              { code: 'NE.EXP.GNFS.ZS', color: '#C41E3A', fallback: '41.4' },
            ].map(({ code, color, fallback }) => {
              const wb = getWb(code);
              return (
                <div key={code} className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{wb?.nom || code}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color }}>{wb?.valeur || fallback}%</p>
                  <p className="text-xs text-gray-400 mt-1">Source: World Bank ({wb?.annee || '—'})</p>
                </div>
              );
            })}
          </div>

          {/* Sous-secteurs industriels */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-cgreen/10 px-6 py-4 border-b">
              <h3 className="font-semibold text-cgreen flex items-center gap-2">
                <Factory size={20} /> Sous-secteurs industriels (classification ISIC)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Sous-secteur</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Code ISIC</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-600">Poids (%)</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600">Barre</th>
                  </tr>
                </thead>
                <tbody>
                  {sousSecteurs.map((ss) => (
                    <tr key={ss.code} className="border-b hover:bg-green-50/50">
                      <td className="px-6 py-3 font-medium">{ss.nom}</td>
                      <td className="px-6 py-3 text-gray-500">{ss.code_isic || '—'}</td>
                      <td className="px-6 py-3 text-right font-bold text-cgreen">
                        {ss.poids ? `${Number(ss.poids).toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-6 py-3 w-48">
                        {ss.poids && (
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cgreen rounded-full" style={{ width: `${Number(ss.poids)}%` }} />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* IPI Trimestriel (données réelles INS) */}
          {ipiData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Indice de Production Industrielle (IPI) — données INS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {ipiData.map((d, i) => (
                  <div key={i} className="border rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-500">T{d.trimestre} {d.annee}</p>
                    <p className="text-2xl font-bold text-cgreen mt-1">+{Number(d.valeur).toFixed(1)}%</p>
                    <p className="text-xs text-gray-400 mt-1">Variation glissement annuel</p>
                  </div>
                ))}
              </div>
              <LineChart
                data={ipiData.map(d => ({
                  periode: `T${d.trimestre} ${d.annee}`,
                  ipi: Number(d.valeur),
                }))}
                lines={[{ key: 'ipi', color: '#2E8B57', name: 'IPI (variation %)' }]}
                height={250}
              />
            </div>
          )}

          {/* Contraintes & Perspectives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contraintes */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Contraintes des entreprises industrielles
              </h3>
              {contraintes.length > 0 ? (
                <BarChart
                  data={contraintes.map(c => ({ name: c.nom, score: Number(c.score) }))}
                  bars={[{ key: 'score', color: '#C41E3A', name: 'Score (0-5)' }]}
                  xKey="name"
                  height={280}
                />
              ) : (
                <BarChart
                  data={[
                    { name: 'Électricité', score: 4.0 }, { name: 'Financement', score: 3.8 },
                    { name: 'Fiscalité', score: 3.5 }, { name: 'Infrastructures', score: 3.5 },
                    { name: 'Transport', score: 3.2 }, { name: 'Informel', score: 3.0 },
                    { name: 'Douanes', score: 2.8 }, { name: 'Corruption', score: 2.5 },
                  ]}
                  bars={[{ key: 'score', color: '#C41E3A', name: 'Score (0-5)' }]}
                  xKey="name"
                  height={280}
                />
              )}
            </div>

            {/* Perspectives */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Perspectives industrielles
              </h3>
              <PieChart
                data={[
                  { name: 'Optimiste', value: Number(perspectives?.optimiste || 40) },
                  { name: 'Stable', value: Number(perspectives?.stable || 35) },
                  { name: 'Pessimiste', value: Number(perspectives?.pessimiste || 25) },
                ]}
                height={280}
              />
              {perspectives?.nombre_repondants && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Basé sur {perspectives.nombre_repondants} entreprises interrogées
                </p>
              )}
            </div>
          </div>

          {/* Indicateurs détaillés */}
          {data?.indicateurs?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Indicateurs détaillés</h3>
                <a href="/api/export/donnees/IND" download className="no-underline">
                  <button className="flex items-center gap-1 bg-cgreen text-cream px-3 py-1.5 rounded text-xs font-medium cursor-pointer border-0 hover:bg-cgreen/90">
                    <Download size={14} /> Export Excel
                  </button>
                </a>
              </div>
              <div className="divide-y">
                {data.indicateurs.map((ind, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-green-50/30">
                    <div>
                      <p className="font-medium text-sm">{ind.nom}</p>
                      <p className="text-xs text-gray-500">{ind.categorie}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-cgreen">
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

          {/* Sources */}
          <div className="rounded-lg bg-navy/5 border border-navy/10 p-4">
            <p className="text-xs text-gray-500 text-center">
              Sources : INS Guinée (IPI trimestriel) • Banque Mondiale (indicateurs macro) • Enquêtes ONCP (contraintes, perspectives)
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
