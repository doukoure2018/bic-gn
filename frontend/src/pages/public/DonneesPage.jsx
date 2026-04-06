import { useState, useEffect } from 'react';
import { Download, Database } from 'lucide-react';
import { getValeurs } from '../../api/indicateurs';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useLanguage } from '../../hooks/useLanguage';

export default function DonneesPage() {
  const { t } = useLanguage();
  const [valeurs, setValeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [secteur, setSecteur] = useState('');

  useEffect(() => {
    setLoading(true);
    getValeurs({ per_page: 100 })
      .then((res) => setValeurs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'indicateur_code', label: 'Code' },
    { key: 'indicateur_nom', label: 'Indicateur' },
    { key: 'annee', label: 'Année' },
    { key: 'trimestre', label: 'T' },
    { key: 'valeur', label: 'Valeur', render: (v) => Number(v).toFixed(2) },
    { key: 'unite', label: 'Unité' },
    { key: 'variation', label: 'Variation', render: (v) => v != null ? `${v > 0 ? '+' : ''}${Number(v).toFixed(1)}%` : '-' },
    { key: 'tendance', label: 'Tendance', render: (v) => v ? <Badge status={v}>{v}</Badge> : '-' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Database size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.donneesStatistiques')}</h1>
          <p className="text-white/80">Explorez et téléchargez les données économiques</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <select
              value={secteur}
              onChange={(e) => setSecteur(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">Tous les secteurs</option>
              <option value="IND">Industrie</option>
              <option value="COM">Commerce</option>
            </select>
          </div>
          <div className="flex gap-2">
            <a href={`/api/export/valeurs/excel${secteur ? `?secteur=${secteur}` : ''}`} download>
              <Button variant="industrie" size="sm"><Download size={16} /> Export Excel</Button>
            </a>
          </div>
        </div>

        {loading ? <Loading /> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <Table columns={columns} data={valeurs} />
          </div>
        )}
      </section>
    </div>
  );
}
