import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { getPublications } from '../../api/publications';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { useLanguage } from '../../hooks/useLanguage';
import { PUBLICATION_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function PublicationsPage() {
  const { t, lang } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    getPublications({ per_page: 50, type: typeFilter || undefined })
      .then((res) => setPublications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [typeFilter]);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-dark to-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FileText size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{t('nav.publications')}</h1>
          <p className="text-white/80">Rapports, études et notes de conjoncture</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Tous les types</option>
            {Object.entries(PUBLICATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.length > 0 ? publications.map((pub) => (
              <div key={pub.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <FileText size={48} className="text-primary/30" />
                </div>
                <div className="p-5">
                  <Badge color="blue">{PUBLICATION_TYPES[pub.type] || pub.type}</Badge>
                  <h3 className="font-semibold mt-2 mb-1">{pub.titre}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{pub.resume || 'Aucun résumé'}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm text-gray-500">
                    <span>{formatDate(pub.date_publication, lang)}</span>
                    {pub.fichier_url && (
                      <a href={`/api/publications/${pub.id}/telecharger`} className="text-primary hover:underline inline-flex items-center gap-1">
                        <Download size={14} /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-20 text-gray-400">Aucune publication</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
