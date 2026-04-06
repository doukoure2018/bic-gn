import { Handshake } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const partenaires = [
  { src: '/images/partenaires/01_WorldBank_IFC.jpg', nom: 'Banque Mondiale / IFC', type: 'PTF' },
  { src: '/images/partenaires/02_BAD.webp', nom: 'Banque Africaine de Developpement', type: 'PTF' },
  { src: '/images/partenaires/03_Partenaire3.png', nom: 'Partenaire institutionnel', type: 'Institution' },
  { src: '/images/partenaires/04_Partenaire4.png', nom: 'Partenaire institutionnel', type: 'Institution' },
  { src: '/images/partenaires/05_GPC.png', nom: 'GPC', type: 'Prive' },
  { src: '/images/partenaires/06_SONAP.webp', nom: 'SONAP', type: 'Prive' },
  { src: '/images/partenaires/07_RioTinto.jpg', nom: 'Rio Tinto / SimFer', type: 'Prive' },
  { src: '/images/partenaires/08_APB.png', nom: 'APB', type: 'Institution' },
  { src: '/images/partenaires/09_SONOCO.webp', nom: 'SONOCO', type: 'Prive' },
  { src: '/images/partenaires/10_CIAO.webp', nom: 'CIAO', type: 'Prive' },
  { src: '/images/partenaires/11_Partenaire12.png', nom: 'Partenaire', type: 'Institution' },
  { src: '/images/partenaires/12_Partenaire14.png', nom: 'Partenaire', type: 'Institution' },
  { src: '/images/partenaires/13_Partenaire13.png', nom: 'Partenaire', type: 'Institution' },
  { src: '/images/partenaires/14_LONAGUI.png', nom: 'LONAGUI', type: 'Prive' },
  { src: '/images/partenaires/15_FAPGAZ.webp', nom: 'FAPGAZ', type: 'Prive' },
  { src: '/images/partenaires/16_AKIBA.png', nom: 'AKIBA', type: 'Prive' },
  { src: '/images/partenaires/17_Ministere.png', nom: 'Ministere de l\'Industrie et du Commerce', type: 'Ministere' },
  { src: '/images/partenaires/18_APIP.png', nom: 'APIP - Agence de Promotion des Investissements Prives', type: 'Institution' },
];

export default function PartenairesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy to-navy/80" />
        <div className="relative z-10 flex flex-col items-center px-4 py-14 text-center">
          <Handshake size={48} className="text-cream mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-cream">Nos Partenaires</h1>
          <p className="mt-2 text-cream/70 text-sm">Institutions et organismes partenaires du Barometre Industrie & Commerce</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {partenaires.map((p, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col items-center text-center hover:shadow-md transition group">
              <div className="h-20 w-full flex items-center justify-center mb-3">
                <img
                  src={p.src}
                  alt={p.nom}
                  className="max-h-16 max-w-full object-contain group-hover:scale-105 transition duration-300"
                />
              </div>
              <p className="text-xs font-medium text-gray-800 leading-tight">{p.nom}</p>
              <span className={`text-[9px] mt-1 px-2 py-0.5 rounded-full ${
                p.type === 'PTF' ? 'bg-navy/10 text-navy' :
                p.type === 'Ministere' ? 'bg-cred/10 text-cred' :
                p.type === 'Institution' ? 'bg-cgreen/10 text-cgreen' :
                'bg-gold/10 text-gold'
              }`}>{p.type}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
