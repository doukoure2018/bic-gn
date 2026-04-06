import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getIndicateurs, createIndicateur } from '../../api/indicateurs';
import client from '../../api/client';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';

export default function IndicateursPage() {
  const [indicateurs, setIndicateurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ categorie_id: '', code: '', nom: '', nom_en: '', unite: '', source: '', periodicite: 'trimestriel' });
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([
      getIndicateurs(),
      client.get('/ref/categories'),
    ]).then(([ind, cat]) => {
      setIndicateurs(ind.data);
      setCategories(cat.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createIndicateur({ ...form, categorie_id: parseInt(form.categorie_id) });
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur');
    }
  };

  if (loading) return <Loading />;

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'nom', label: 'Nom' },
    { key: 'unite', label: 'Unité' },
    { key: 'source', label: 'Source' },
    { key: 'periodicite', label: 'Périodicité' },
    { key: 'est_actif', label: 'Actif', render: (v) => <Badge status={v ? 'active' : 'inactive'}>{v ? 'Oui' : 'Non'}</Badge> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Indicateurs</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Ajouter</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <Table columns={columns} data={indicateurs} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvel indicateur" size="lg">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select value={form.categorie_id} onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Sélectionner...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          {[
            { name: 'code', label: 'Code', required: true },
            { name: 'nom', label: 'Nom (FR)', required: true },
            { name: 'nom_en', label: 'Nom (EN)' },
            { name: 'unite', label: 'Unité', required: true },
            { name: 'source', label: 'Source' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type="text" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          ))}
          <div className="col-span-2 flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
