import { useState, useEffect } from 'react';
import { Plus, Eye } from 'lucide-react';
import { getActualites, createActualite, publierActualite } from '../../api/actualites';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { ACTUALITE_CATEGORIES } from '../../utils/constants';

export default function ActualitesAdminPage() {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: '', categorie: 'economie', contenu: '', extrait: '' });

  const load = () => {
    getActualites({ per_page: 100 })
      .then((res) => { setActualites(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createActualite(form);
    setShowModal(false);
    setForm({ titre: '', categorie: 'economie', contenu: '', extrait: '' });
    load();
  };

  const handlePublier = async (id) => { await publierActualite(id); load(); };

  if (loading) return <Loading />;

  const columns = [
    { key: 'titre', label: 'Titre' },
    { key: 'categorie', label: 'Catégorie', render: (v) => ACTUALITE_CATEGORIES[v] || v },
    { key: 'est_publie', label: 'Publié', render: (v) => <Badge status={v ? 'publie' : 'brouillon'}>{v ? 'Oui' : 'Non'}</Badge> },
    { key: 'vues', label: 'Vues' },
    {
      key: 'id', label: 'Actions', sortable: false,
      render: (v, row) => !row.est_publie ? (
        <Button size="sm" variant="industrie" onClick={(e) => { e.stopPropagation(); handlePublier(v); }}>
          <Eye size={14} /> Publier
        </Button>
      ) : null,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Actualités</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Créer</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <Table columns={columns} data={actualites} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle actualité" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input type="text" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg">
              {Object.entries(ACTUALITE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
            <input type="text" value={form.extrait} onChange={(e) => setForm({ ...form, extrait: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea value={form.contenu} onChange={(e) => setForm({ ...form, contenu: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" rows="6" required />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
