import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Store, Users, TrendingUp, DollarSign, FileText, ChevronRight, ChevronDown, Calendar, Globe, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { getDashboard } from '../../api/barometre';
import { getPublications } from '../../api/publications';
import { getActualites } from '../../api/actualites';
import KPICard from '../../components/dashboard/KPICard';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import Loading from '../../components/common/Loading';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function HomePage() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [publications, setPublications] = useState([]);
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboard().catch(() => ({ data: {} })),
      getPublications({ per_page: 2 }).catch(() => ({ data: [] })),
      getActualites({ per_page: 3 }).catch(() => ({ data: [] })),
    ]).then(([dash, pubs, actu]) => {
      setData(dash.data);
      setPublications(pubs.data);
      setActualites(actu.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  const wb = (code) => data?.worldbank?.find(d => d.indicateur_code === code);
  const te = (code) => data?.trading_economics?.find(d => d.indicateur_code === code);
  const fmtVal = (item) => item ? formatNumber(item.valeur, 1) : '—';

  const wbIndustrie = wb('NV.IND.TOTL.ZS');
  const wbManufact = wb('NV.IND.MANF.ZS');
  const wbInflation = wb('FP.CPI.TOTL.ZG');
  const wbExports = wb('NE.EXP.GNFS.ZS');
  const wbGDP = wb('NY.GDP.MKTP.CD');
  const wbGrowth = wb('NY.GDP.MKTP.KD.ZG');
  const wbEmploi = wb('SL.IND.EMPL.ZS');
  const wbPopulation = wb('SP.POP.TOTL');
  const teGDP = te('GDP');

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Hero with video background */}
      <section className="relative overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-skyline.jpg"
        >
          <source src="/images/videobg2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-navy/30" />
        <div className="relative z-10 flex flex-col items-center px-4 py-16 text-center md:py-24">
          <div className="overflow-hidden w-full max-w-4xl">
            <div className="flex animate-scroll-text gap-16 whitespace-nowrap">
              <span className="text-xl md:text-3xl italic font-light animate-shimmer">Mesurer aujourd'hui, orienter demain</span>
              <span className="text-xl md:text-3xl italic font-light text-gold">Transparence des chiffres, confiance des acteurs</span>
              <span className="text-xl md:text-3xl italic font-light animate-shimmer">L'industrie et le commerce sous le prisme de la performance</span>
              <span className="text-xl md:text-3xl italic font-light text-gold">Mesurer aujourd'hui, orienter demain</span>
              <span className="text-xl md:text-3xl italic font-light animate-shimmer">Transparence des chiffres, confiance des acteurs</span>
              <span className="text-xl md:text-3xl italic font-light text-gold">L'industrie et le commerce sous le prisme de la performance</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/barometre/industrie" className="no-underline"><button className="flex items-center gap-2 rounded-full bg-cgreen px-6 py-2.5 text-sm font-semibold text-cream hover:bg-cgreen/90 transition cursor-pointer border-0"><Factory className="h-4 w-4" /> Baromètre Industrie</button></Link>
            <Link to="/barometre/commerce" className="no-underline"><button className="flex items-center gap-2 rounded-full bg-cred px-6 py-2.5 text-sm font-semibold text-cream hover:bg-cred/90 transition cursor-pointer border-0"><Store className="h-4 w-4" /> Baromètre Commerce</button></Link>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8">

          {/* ====== INDICATEURS PHARES — Source: INS Guinée (stat-guinee.org) ====== */}

          {/* Rang 1 : Population + Indicateurs macro INS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Population Guinéenne"
              value="17 521 167"
              status="RGPH-4, 2025 — stat-guinee.org"
              trend="up"
              color="#0A1F44"
              barColors={['#2E8B57', '#D4A829', '#C41E3A', '#0A1F44']}
            />
            <KPICard
              title="Taux d'inflation"
              value="4,4%"
              status="Janvier 2026 — INS Guinée"
              trend="down"
              color="#C41E3A"
              barColors={['#C41E3A', '#D4A829', '#0A1F44', '#2E8B57']}
            />
            <KPICard
              title="Exportations"
              value="12 724,9 Mrd"
              status="Janvier 2026 — GNF — INS Guinée"
              trend="up"
              color="#2E8B57"
              barColors={['#2E8B57', '#0A1F44', '#D4A829', '#C41E3A']}
            />
            <KPICard
              title="Importations"
              value="10 724,7 Mrd"
              status="Janvier 2026 — GNF — INS Guinée"
              trend="stable"
              color="#D4A829"
              barColors={['#D4A829', '#C41E3A', '#2E8B57', '#0A1F44']}
            />
          </div>

          {/* Rang 2 : Indicateurs détaillés INS + World Bank */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: Users, label: 'Population totale', value: '17 521 167', detail: 'Dont 51,8% femmes', color: 'text-navy', src: 'RGPH-4 2025' },
              { icon: Users, label: 'Femmes', value: '9 068 256', detail: '51,8% de la population', color: 'text-cred', src: 'RGPH-4 2025' },
              { icon: TrendingUp, label: 'Variation Indice des prix', value: '0,6%', detail: 'Janv. 2026 / mois précédent', color: 'text-gold', src: 'INS Guinée' },
              { icon: DollarSign, label: 'PIB (provisoire 2024)', value: '217 089,3 Mrd GNF', detail: 'PIB par tête: 22,2 M GNF', color: 'text-navy', src: 'INS Guinée' },
              { icon: TrendingUp, label: 'Croissance PIB', value: '5,6%', detail: 'T3 2025: 6,6%', color: 'text-cgreen', src: 'INS Guinée 2024' },
              { icon: DollarSign, label: 'Dette extérieure', value: '4 718,8 M USD', detail: 'T4 2024', color: 'text-cred', src: 'INS Guinée' },
              { icon: DollarSign, label: 'Masse monétaire', value: '75 265,79 Mrd GNF', detail: 'Juin 2025', color: 'text-gold', src: 'INS Guinée' },
              { icon: Globe, label: 'Densité population', value: '71 hab/km²', detail: 'Urbain 38,7% | Rural 61,3%', color: 'text-navy', src: 'RGPH-4 2025' },
            ].map(({ icon: Icon, label, value, detail, color, src }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm border border-gray-100">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 truncate">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                  <p className="text-[9px] text-gray-400">{detail} — {src}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rang 3 : IPI trimestriel INS + indicateurs supplémentaires Trading Economics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* IPI INS */}
            {data?.ipi_data?.length > 0 && (
              <div className="rounded-lg bg-white p-5 shadow-md">
                <h3 className="mb-1 text-sm font-semibold text-gray-800">Indice de Production Industrielle (IPI)</h3>
                <p className="mb-3 text-[10px] text-gray-400">Source: INS Guinee — Variation glissement annuel</p>
                <div className="grid grid-cols-3 gap-3">
                  {data.ipi_data.map((d, i) => (
                    <div key={i} className="border rounded-lg p-3 text-center bg-cgreen/5">
                      <p className="text-[10px] text-gray-500 font-medium">T{d.trimestre} {d.annee}</p>
                      <p className="text-xl font-bold text-cgreen mt-0.5">+{Number(d.valeur).toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indicateurs Trading Economics supplémentaires */}
            <div className="rounded-lg bg-white p-5 shadow-md">
              <h3 className="mb-1 text-sm font-semibold text-gray-800">Indicateurs complementaires</h3>
              <p className="mb-3 text-[10px] text-gray-400">Source: Trading Economics {te('GDP')?.annee || ''}</p>
              <div className="space-y-2">
                {[
                  { label: 'Taux de chomage', d: te('UNEMPLOYMENT'), fmt: (v) => `${fmtVal(v)}%`, color: 'text-cred' },
                  { label: 'Taux d\'interet', d: te('INTEREST_RATE'), fmt: (v) => `${fmtVal(v)}%`, color: 'text-navy' },
                  { label: 'Inflation alimentaire', d: te('FOOD_INFLATION'), fmt: (v) => `${fmtVal(v)}%`, color: 'text-gold' },
                  { label: 'Investissements (FBCF % PIB)', d: wb('NE.GDI.FTOT.ZS'), fmt: (v) => `${fmtVal(v)}%`, color: 'text-cgreen', src: 'World Bank' },
                  { label: 'Commerce marchandises (% PIB)', d: wb('TG.VAL.TOTL.GD.ZS'), fmt: (v) => `${fmtVal(v)}%`, color: 'text-navy', src: 'World Bank' },
                ].map(({ label, d, fmt, color, src }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{label}</span>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${color}`}>{d ? fmt(d) : '—'}</span>
                      <span className="text-[9px] text-gray-400 ml-1">{src || 'TE'} {d?.annee || ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Graphiques — séries historiques World Bank */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow-md">
              <h3 className="mb-1 text-sm font-semibold text-gray-800">Evolution Industrie (% du PIB)</h3>
              <p className="mb-3 text-[10px] text-gray-400">Source: World Bank API — data.worldbank.org</p>
              {data?.evolution_industrie?.length > 0
                ? <LineChart data={data.evolution_industrie} lines={[{ key: 'valeur', color: '#0A1F44', name: 'Industrie % PIB' }]} height={250} />
                : <p className="text-gray-400 text-center py-12">Donnees non synchronisees</p>}
            </div>
            <div className="rounded-lg bg-white p-5 shadow-md">
              <h3 className="mb-1 text-sm font-semibold text-gray-800">Industrie vs Commerce (% PIB)</h3>
              <p className="mb-3 text-[10px] text-gray-400">Source: World Bank API</p>
              {data?.evolution_industrie_commerce?.length > 0
                ? <LineChart data={data.evolution_industrie_commerce} lines={[{ key: 'industrie', color: '#2E8B57', name: 'Industrie' }, { key: 'commerce', color: '#D4A829', name: 'Commerce' }]} height={250} />
                : <p className="text-gray-400 text-center py-12">Donnees non synchronisees</p>}
            </div>
          </div>

          {/* Contraintes & Perspectives */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow-md">
              <h3 className="mb-1 text-sm font-semibold text-gray-800">Contraintes des entreprises</h3>
              <p className="mb-3 text-[10px] text-gray-400">Source: Enquêtes ONCP</p>
              {data?.contraintes?.length > 0
                ? <BarChart data={data.contraintes.map(c => ({ name: c.nom, score: Number(c.score) }))} bars={[{ key: 'score', color: '#C41E3A', name: 'Score (0-5)' }]} xKey="name" height={250} colorByValue />
                : <p className="text-gray-400 text-center py-12">Données d'enquête non disponibles</p>}
            </div>
            <div className="rounded-lg bg-white p-5 shadow-md">
              <h3 className="mb-1 text-sm font-semibold text-gray-800">Perspectives économiques</h3>
              <p className="mb-3 text-[10px] text-gray-400">Source: Enquêtes ONCP</p>
              {data?.perspectives?.length > 0
                ? <PieChart data={[{ name: 'Optimiste', value: Number(data.perspectives[0]?.optimiste||0) }, { name: 'Stable', value: Number(data.perspectives[0]?.stable||0) }, { name: 'Pessimiste', value: Number(data.perspectives[0]?.pessimiste||0) }]} height={250} />
                : <p className="text-gray-400 text-center py-12">Données d'enquête non disponibles</p>}
            </div>
          </div>

          {/* Lien vers Prix moyens Commerce */}
          <Link to="/barometre/commerce" className="no-underline block">
            <div className="rounded-lg bg-gradient-to-r from-cred to-cred/80 shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-cream text-lg">Prix moyens des denrées de première nécessité</h3>
                  <p className="text-cream/70 text-sm mt-1">Consultez les prix par région — Source: SIMPRIX (simprix.gov.gn)</p>
                </div>
                <ChevronRight className="h-8 w-8 text-cream/60" />
              </div>
            </div>
          </Link>

          {/* Publications & Actualités */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow-md">
              <h3 className="mb-4 text-base font-bold text-gray-800">Dernieres Publications</h3>
              {publications.length > 0 ? publications.map((pub) => (
                <div key={pub.id} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 mb-2 hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-navy"><FileText className="h-4 w-4 text-cream" /></div>
                    <span className="text-sm font-medium">{pub.titre}</span>
                  </div>
                  <Link to="/publications" className="bg-cgreen text-cream text-xs px-3 py-1.5 rounded no-underline">Voir</Link>
                </div>
              )) : <p className="text-gray-400 text-sm">Aucune publication</p>}
            </div>
            <div className="rounded-lg bg-white p-5 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-800">Actualites</h3>
                <Link to="/actualites" className="text-xs text-gray-500 no-underline inline-flex items-center">Voir Toutes <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </div>
              {actualites.length > 0 ? actualites.map((news) => (
                <div key={news.id} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 mb-2 hover:bg-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-14 shrink-0 rounded bg-gold/20" />
                    <div>
                      <p className="text-sm font-medium">{news.titre}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="h-3 w-3" />{formatDate(news.date_publication)}</div>
                    </div>
                  </div>
                  <Link to={`/actualites/${news.slug}`} className="text-xs text-navy font-medium no-underline inline-flex items-center">Lire <ChevronRight className="ml-1 h-3 w-3" /></Link>
                </div>
              )) : <p className="text-gray-400 text-sm">Aucune actualité</p>}
            </div>
          </div>

          {/* Sources dynamiques */}
          <div className="rounded-lg bg-navy/5 border border-navy/10 p-4">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              {data?.sources?.map(s => (
                <span key={s.code} className="inline-flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${s.nb_donnees > 0 ? 'bg-cgreen' : 'bg-gray-300'}`} />
                  {s.nom} ({s.nb_donnees})
                </span>
              ))}
            </div>
          </div>

          {/* Partenaires */}
          <div className="rounded-lg bg-white shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-800 text-center">Nos Partenaires</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 items-center justify-items-center">
                {[
                  { src: '/images/partenaires/01_WorldBank_IFC.jpg', alt: 'World Bank / IFC' },
                  { src: '/images/partenaires/02_BAD.webp', alt: 'BAD' },
                  { src: '/images/partenaires/03_Partenaire3.png', alt: 'Partenaire' },
                  { src: '/images/partenaires/04_Partenaire4.png', alt: 'Partenaire' },
                  { src: '/images/partenaires/05_GPC.png', alt: 'GPC' },
                  { src: '/images/partenaires/06_SONAP.webp', alt: 'SONAP' },
                  { src: '/images/partenaires/07_RioTinto.jpg', alt: 'Rio Tinto / SimFer' },
                  { src: '/images/partenaires/08_APB.png', alt: 'APB' },
                  { src: '/images/partenaires/09_SONOCO.webp', alt: 'SONOCO' },
                  { src: '/images/partenaires/10_CIAO.webp', alt: 'CIAO' },
                  { src: '/images/partenaires/11_Partenaire12.png', alt: 'Partenaire' },
                  { src: '/images/partenaires/12_Partenaire14.png', alt: 'Partenaire' },
                  { src: '/images/partenaires/13_Partenaire13.png', alt: 'Partenaire' },
                  { src: '/images/partenaires/14_LONAGUI.png', alt: 'LONAGUI' },
                  { src: '/images/partenaires/15_FAPGAZ.webp', alt: 'FAPGAZ' },
                  { src: '/images/partenaires/16_AKIBA.png', alt: 'AKIBA' },
                  { src: '/images/partenaires/17_Ministere.png', alt: 'Ministere' },
                  { src: '/images/partenaires/18_APIP.png', alt: 'APIP' },
                ].map((p, i) => (
                  <img key={i} src={p.src} alt={p.alt} className="h-12 w-auto max-w-[80px] object-contain hover:scale-105 transition duration-300" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
