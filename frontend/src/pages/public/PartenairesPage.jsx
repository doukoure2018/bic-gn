import { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import client from '../../api/client';
import Loading from '../../components/common/Loading';
import Badge from '../../components/common/Badge';
import { useLanguage } from '../../hooks/useLanguage';

export default function PartenairesPage() {
  const { t } = useLanguage();
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/ref/partenaires')
      .then((res) => setPartenaires(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Handshake size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{t('nav.partenaires')}</h1>
          <p className="text-white/80">Institutions et organismes partenaires</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partenaires.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Handshake size={32} className="text-gray-400" />
              </div>
              <h3 className="font-semibold mb-1">{p.nom}</h3>
              {p.type && <Badge color="blue">{p.type}</Badge>}
              {p.description && <p className="text-sm text-gray-500 mt-2">{p.description}</p>}
              {p.site_web && (
                <a href={p.site_web} target="_blank" rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline mt-2 inline-block">
                  Visiter le site
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
