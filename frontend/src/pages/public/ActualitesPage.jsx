import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { getActualites } from '../../api/actualites';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { useLanguage } from '../../hooks/useLanguage';
import { ACTUALITE_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function ActualitesPage() {
  const { t, lang } = useLanguage();
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    getActualites({ per_page: 50, categorie: catFilter || undefined })
      .then((res) => setActualites(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [catFilter]);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Newspaper size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{t('nav.actualites')}</h1>
          <p className="text-white/80">Dernières nouvelles économiques de la Guinée</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Toutes les catégories</option>
            {Object.entries(ACTUALITE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actualites.length > 0 ? actualites.map((actu) => (
              <Link key={actu.id} to={`/actualites/${actu.slug}`} className="no-underline group">
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <Newspaper size={48} className="text-gray-300" />
                  </div>
                  <div className="p-5">
                    {actu.categorie && <Badge color="blue">{ACTUALITE_CATEGORIES[actu.categorie] || actu.categorie}</Badge>}
                    <h3 className="font-semibold mt-2 mb-1 text-gray-800 group-hover:text-primary transition">{actu.titre}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{actu.extrait || ''}</p>
                    <p className="text-xs text-gray-400 mt-3">{formatDate(actu.date_publication, lang)}</p>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-20 text-gray-400">Aucune actualité</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
