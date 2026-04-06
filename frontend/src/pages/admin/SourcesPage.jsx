import { useState, useEffect } from 'react';
import { RefreshCw, Database, Globe, CheckCircle, XCircle } from 'lucide-react';
import { getSourcesStatus, syncWorldBank, syncAll, getWorldBankLatest } from '../../api/sources';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/formatters';

const TYPE_LABELS = {
  api_auto: { label: 'API Auto', color: 'green' },
  api_semi: { label: 'API Semi-auto', color: 'blue' },
  import_manuel: { label: 'Import manuel', color: 'yellow' },
  scraping: { label: 'Scraping', color: 'orange' },
};

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [wbData, setWbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const load = () => {
    Promise.all([
      getSourcesStatus(),
      getWorldBankLatest(),
    ]).then(([src, wb]) => {
      setSources(src.data);
      setWbData(wb.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSyncWB = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncWorldBank();
      setSyncResult(res.data);
      load();
    } catch (err) {
      setSyncResult({ error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncAll();
      setSyncResult(res.data);
      load();
    } catch (err) {
      setSyncResult({ error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <Loading />;

  const sourceColumns = [
    { key: 'nom', label: 'Source' },
    { key: 'type', label: 'Type', render: (v) => {
      const t = TYPE_LABELS[v] || { label: v, color: 'gray' };
      return <Badge color={t.color}>{t.label}</Badge>;
    }},
    { key: 'est_actif', label: 'Actif', render: (v) => v ? <CheckCircle size={16} className="text-cgreen" /> : <XCircle size={16} className="text-cred" /> },
    { key: 'nb_donnees', label: 'Données' },
    { key: 'derniere_sync', label: 'Dernière sync', render: (v) => v ? formatDate(v) : 'Jamais' },
  ];

  const wbColumns = [
    { key: 'indicateur_code', label: 'Code WB' },
    { key: 'indicateur_nom', label: 'Indicateur' },
    { key: 'annee', label: 'Année' },
    { key: 'valeur', label: 'Valeur', render: (v) => Number(v).toFixed(2) },
    { key: 'unite', label: 'Unité' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sources de données externes</h1>
        <div className="flex gap-2">
          <Button onClick={handleSyncWB} disabled={syncing} variant="industrie" size="sm">
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} /> Sync World Bank
          </Button>
          <Button onClick={handleSyncAll} disabled={syncing} size="sm">
            <Globe size={16} className={syncing ? 'animate-spin' : ''} /> Sync Toutes
          </Button>
        </div>
      </div>

      {syncResult && (
        <div className={`rounded-lg p-4 mb-6 ${syncResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {syncResult.error ? (
            <p>Erreur : {syncResult.error}</p>
          ) : (
            <p>
              Synchronisation terminée — {syncResult.worldbank?.total_synced || syncResult.total_synced || 0} points synchronisés
              {syncResult.worldbank && ` (World Bank: ${syncResult.worldbank.total_synced})`}
            </p>
          )}
        </div>
      )}

      {/* Sources overview */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database size={20} /> Sources configurées
          </h3>
        </div>
        <Table columns={sourceColumns} data={sources} />
      </div>

      {/* World Bank data */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe size={20} /> Données World Bank (dernières valeurs)
          </h3>
        </div>
        <Table columns={wbColumns} data={wbData} />
      </div>
    </div>
  );
}
