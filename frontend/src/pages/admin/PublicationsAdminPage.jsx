import { useState, useEffect } from 'react';
import { Plus, Eye } from 'lucide-react';
import { getPublications, createPublication, publierPublication } from '../../api/publications';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { PUBLICATION_TYPES } from '../../utils/constants';

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: '', type: 'rapport', resume: '', date_publication: '' });

  const load = () => {
    getPublications({ per_page: 100 })
      .then((res) => { setPublications(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createPublication(form);
    setShowModal(false);
    setForm({ titre: '', type: 'rapport', resume: '', date_publication: '' });
    load();
  };

  const handlePublier = async (id) => { await publierPublication(id); load(); };

  if (loading) return <Loading />;

  const columns = [
    { key: 'titre', label: 'Titre' },
    { key: 'type', label: 'Type', render: (v) => PUBLICATION_TYPES[v] || v },
    { key: 'est_publie', label: 'Publié', render: (v) => <Badge status={v ? 'publie' : 'brouillon'}>{v ? 'Oui' : 'Non'}</Badge> },
    { key: 'nombre_telechargements', label: 'Téléch.' },
    { key: 'date_publication', label: 'Date' },
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
        <h1 className="text-2xl font-bold">Publications</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Créer</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <Table columns={columns} data={publications} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle publication">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input type="text" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg">
              {Object.entries(PUBLICATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
            <textarea value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" rows="3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de publication</label>
            <input type="date" value={form.date_publication}
              onChange={(e) => setForm({ ...form, date_publication: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" />
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
