import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getValeurs, createValeur, validerValeur } from '../../api/indicateurs';
import client from '../../api/client';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../hooks/useAuth';

export default function ValeursPage() {
  const { hasRole } = useAuth();
  const [valeurs, setValeurs] = useState([]);
  const [indicateurs, setIndicateurs] = useState([]);
  const [periodes, setPeriodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ indicateur_id: '', periode_id: '', valeur: '', source_donnee: '', notes: '' });

  const load = () => {
    Promise.all([
      getValeurs({ per_page: 100 }),
      client.get('/indicateurs'),
      client.get('/ref/periodes'),
    ]).then(([val, ind, per]) => {
      setValeurs(val.data);
      setIndicateurs(ind.data);
      setPeriodes(per.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createValeur({
      indicateur_id: parseInt(form.indicateur_id),
      periode_id: parseInt(form.periode_id),
      valeur: parseFloat(form.valeur),
      source_donnee: form.source_donnee,
      notes: form.notes,
    });
    setShowModal(false);
    load();
  };

  const handleValidate = async (id) => {
    await validerValeur(id);
    load();
  };

  if (loading) return <Loading />;

  const columns = [
    { key: 'indicateur_code', label: 'Code' },
    { key: 'indicateur_nom', label: 'Indicateur' },
    { key: 'annee', label: 'Année' },
    { key: 'trimestre', label: 'T' },
    { key: 'valeur', label: 'Valeur', render: (v) => Number(v).toFixed(2) },
    { key: 'unite', label: 'Unité' },
    { key: 'variation', label: 'Variation', render: (v) => v != null ? `${v > 0 ? '+' : ''}${Number(v).toFixed(1)}%` : '-' },
    { key: 'tendance', label: 'Tendance', render: (v) => v ? <Badge status={v}>{v}</Badge> : '-' },
    { key: 'statut', label: 'Statut', render: (v) => <Badge status={v}>{v}</Badge> },
    ...(hasRole('validateur') ? [{
      key: 'id', label: 'Actions', sortable: false,
      render: (v, row) => row.statut === 'brouillon' ? (
        <Button size="sm" variant="industrie" onClick={(e) => { e.stopPropagation(); handleValidate(v); }}>Valider</Button>
      ) : null,
    }] : []),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Valeurs des indicateurs</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Saisir</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table columns={columns} data={valeurs} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Saisir une valeur">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Indicateur</label>
            <select value={form.indicateur_id} onChange={(e) => setForm({ ...form, indicateur_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Sélectionner...</option>
              {indicateurs.map((i) => <option key={i.id} value={i.id}>{i.code} - {i.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select value={form.periode_id} onChange={(e) => setForm({ ...form, periode_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Sélectionner...</option>
              {periodes.map((p) => <option key={p.id} value={p.id}>T{p.trimestre} {p.annee}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
            <input type="number" step="0.01" value={form.valeur}
              onChange={(e) => setForm({ ...form, valeur: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input type="text" value={form.source_donnee}
              onChange={(e) => setForm({ ...form, source_donnee: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit">Saisir</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
