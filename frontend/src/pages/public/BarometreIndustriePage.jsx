import { useState, useEffect } from 'react';
import { Factory, FileDown, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { getIndustrie } from '../../api/barometre';
import { getEntreprisesPublic, getAgregation } from '../../api/entreprises';
import { useLanguage } from '../../hooks/useLanguage';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import Loading from '../../components/common/Loading';
import Badge from '../../components/common/Badge';
import { formatNumber } from '../../utils/formatters';

const SECTEUR_TABS = [
  { code: null, label: 'Vue d\'ensemble' },
  { code: 'MINES', label: 'MINES' },
  { code: 'AGROINDUS', label: 'AGROINDUS' },
  { code: 'BTP', label: 'BTP' },
  { code: 'MANUFACTURES', label: 'MANUFACTURES' },
  { code: 'ENERGIE', label: 'ENERGIE' },
];

const SECTEUR_LABELS = {
  MINES: 'Mines & Métallurgie',
  AGROINDUS: 'Agro-industrie',
  BTP: 'BTP & Construction',
  MANUFACTURES: 'Manufactures légères',
  ENERGIE: 'Énergie',
};

export default function BarometreIndustriePage() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [agregation, setAgregation] = useState([]);

  useEffect(() => {
    Promise.all([
      getIndustrie().catch(() => ({ data: {} })),
      getAgregation().catch(() => ({ data: [] })),
    ]).then(([ind, agr]) => {
      setData(ind.data);
      setAgregation(agr.data);
      setLoading(false);
    });
  }, []);

  const handleTabChange = (code) => {
    setActiveTab(code);
    if (code) {
      getEntreprisesPublic(code).then((res) => setEntreprises(res.data)).catch(() => setEntreprises([]));
    }
  };

  if (loading) return <Loading />;

  const wbData = data?.worldbank || [];
  const ipiData = data?.ipi_data || [];
  const contraintes = data?.contraintes || [];
  const perspectives = data?.perspectives;
  const sousSecteurs = data?.sous_secteurs || [];
  const currentAgr = activeTab ? agregation.find(a => a.secteur_code === activeTab) : null;

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-green-900 to-cgreen text-cream px-4 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Factory size={24} />
            <h1 className="text-lg font-bold">Guinée : Baromètre Industrie</h1>
          </div>
          <a href="/api/export/donnees/IND" download className="no-underline">
            <button className="flex items-center gap-1 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy hover:bg-gold/90 transition cursor-pointer border-0">
              <FileDown className="h-4 w-4" /> Rapport Industrie
            </button>
          </a>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-0 overflow-x-auto">
          {SECTEUR_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleTabChange(tab.code)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer bg-transparent ${
                activeTab === tab.code
                  ? 'border-cgreen text-cgreen'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">

        {/* ========== VUE D'ENSEMBLE ========== */}
        {activeTab === null && (
          <div className="flex flex-col gap-6">
            {/* KPI World Bank */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { code: 'NV.IND.TOTL.ZS', color: '#0A1F44', label: 'Industrie (% PIB)' },
                { code: 'NV.IND.MANF.ZS', color: '#2E8B57', label: 'Manufacturier (% PIB)' },
                { code: 'SL.IND.EMPL.ZS', color: '#D4A829', label: 'Emploi industriel (% total)' },
                { code: 'NE.EXP.GNFS.ZS', color: '#C41E3A', label: 'Exportations (% PIB)' },
              ].map(({ code, color, label }) => {
                const wb = wbData.find(d => d.indicateur_code === code);
                return (
                  <div key={code} className="bg-white rounded-lg shadow-sm border p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{wb?.indicateur_nom || label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color }}>{wb ? `${Number(wb.valeur).toFixed(1)}%` : '—'}</p>
                    <p className="text-[9px] text-gray-400 mt-1">World Bank {wb?.annee || ''}</p>
                  </div>
                );
              })}
            </div>

            {/* KPI agrégés par secteur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {agregation.map((agr) => (
                <div key={agr.secteur_code} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition cursor-pointer" onClick={() => handleTabChange(agr.secteur_code)}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{SECTEUR_LABELS[agr.secteur_code] || agr.secteur_code}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <Factory size={14} className="text-cgreen" />
                      <span className="text-xs text-gray-600 truncate">Prod: {agr.total_production ? `${formatNumber(agr.total_production)} ${agr.unite_production || ''}` : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-navy" />
                      <span className="text-xs text-gray-600">{formatNumber(agr.total_emplois)} emplois</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-gold" />
                      <span className="text-xs text-gray-600">{formatNumber(agr.total_ide, 1)} M USD IDE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sous-secteurs ISIC */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-cgreen/10 px-6 py-3 border-b">
                <h3 className="font-semibold text-cgreen text-sm">Sous-secteurs industriels (ISIC)</h3>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 border-b">
                  <th className="px-6 py-2 text-left font-semibold text-gray-600 text-xs">Sous-secteur</th>
                  <th className="px-6 py-2 text-left font-semibold text-gray-600 text-xs">ISIC</th>
                  <th className="px-6 py-2 text-right font-semibold text-gray-600 text-xs">Poids</th>
                </tr></thead>
                <tbody>
                  {sousSecteurs.map((ss) => (
                    <tr key={ss.code} className="border-b hover:bg-green-50/30">
                      <td className="px-6 py-2 text-xs">{ss.nom}</td>
                      <td className="px-6 py-2 text-xs text-gray-500">{ss.code_isic || '—'}</td>
                      <td className="px-6 py-2 text-xs text-right font-semibold text-cgreen">{ss.poids ? `${Number(ss.poids).toFixed(1)}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* IPI */}
            {ipiData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">IPI Trimestriel — INS Guinée</h3>
                <div className="grid grid-cols-3 gap-3">
                  {ipiData.map((d, i) => (
                    <div key={i} className="border rounded-lg p-3 text-center bg-cgreen/5">
                      <p className="text-[10px] text-gray-500">T{d.trimestre} {d.annee}</p>
                      <p className="text-xl font-bold text-cgreen">+{Number(d.valeur).toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contraintes & Perspectives */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Contraintes</h3>
                {contraintes.length > 0
                  ? <BarChart data={contraintes.map(c => ({ name: c.nom, score: Number(c.score) }))} bars={[{ key: 'score', color: '#C41E3A', name: 'Score' }]} xKey="name" height={220} colorByValue />
                  : <p className="text-gray-400 text-center py-8 text-sm">Données non disponibles</p>}
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Perspectives</h3>
                {perspectives
                  ? <PieChart data={[{ name: 'Optimiste', value: Number(perspectives.optimiste||0) }, { name: 'Stable', value: Number(perspectives.stable||0) }, { name: 'Pessimiste', value: Number(perspectives.pessimiste||0) }]} height={220} />
                  : <p className="text-gray-400 text-center py-8 text-sm">Données non disponibles</p>}
              </div>
            </div>

            <div className="rounded-lg bg-navy/5 border border-navy/10 p-3">
              <p className="text-[10px] text-gray-500 text-center">Sources : INS Guinée • Banque Mondiale • Enquêtes ONCP</p>
            </div>
          </div>
        )}

        {/* ========== ONGLET SOUS-SECTEUR ========== */}
        {activeTab !== null && (
          <div className="flex flex-col gap-6">
            {/* Agrégation */}
            {currentAgr && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Total emplois</p>
                  <p className="text-2xl font-bold text-cgreen">{formatNumber(currentAgr.total_emplois)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Emploi femmes</p>
                  <p className="text-2xl font-bold text-gold">{formatNumber(currentAgr.total_emploi_femmes)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">IDE reçus</p>
                  <p className="text-2xl font-bold text-cred">{formatNumber(currentAgr.total_ide, 1)} M$</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Production réalisée</p>
                  <p className="text-2xl font-bold text-navy">{currentAgr.total_production ? formatNumber(currentAgr.total_production) : '—'} <span className="text-sm font-normal">{currentAgr.unite_production || ''}</span></p>
                </div>
              </div>
            )}

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Emplois par entreprise</h3>
                <BarChart
                  data={entreprises.map(e => ({ name: e.nom_entreprise.substring(0, 15), emplois: e.emplois }))}
                  bars={[{ key: 'emplois', color: '#2E8B57', name: 'Emplois' }]}
                  xKey="name" height={250}
                />
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">IDE par entreprise (M USD)</h3>
                <BarChart
                  data={entreprises.map(e => ({ name: e.nom_entreprise.substring(0, 15), ide: Number(e.ide_recus) }))}
                  bars={[{ key: 'ide', color: '#D4A829', name: 'IDE (M$)' }]}
                  xKey="name" height={250}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
