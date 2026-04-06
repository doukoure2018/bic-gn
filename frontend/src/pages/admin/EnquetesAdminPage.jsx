import { useState, useEffect } from 'react';
import { Plus, Play, Square } from 'lucide-react';
import { getEnquetes, createEnquete, lancerEnquete, cloturerEnquete } from '../../api/enquetes';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';

export default function EnquetesAdminPage() {
  const [enquetes, setEnquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: '', description: '', date_debut: '', date_fin: '', questions: '[]' });

  const load = () => { getEnquetes().then((res) => { setEnquetes(res.data); setLoading(false); }); };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createEnquete({
      ...form,
      questions: JSON.parse(form.questions),
    });
    setShowModal(false);
    load();
  };

  const handleLancer = async (id) => { await lancerEnquete(id); load(); };
  const handleCloturer = async (id) => { await cloturerEnquete(id); load(); };

  if (loading) return <Loading />;

  const columns = [
    { key: 'titre', label: 'Titre' },
    { key: 'statut', label: 'Statut', render: (v) => <Badge status={v}>{v}</Badge> },
    { key: 'nombre_cibles', label: 'Cibles' },
    { key: 'nombre_reponses', label: 'Réponses' },
    { key: 'date_debut', label: 'Début' },
    { key: 'date_fin', label: 'Fin' },
    {
      key: 'id', label: 'Actions', sortable: false,
      render: (v, row) => (
        <div className="flex gap-2">
          {row.statut === 'brouillon' && (
            <Button size="sm" variant="industrie" onClick={(e) => { e.stopPropagation(); handleLancer(v); }}>
              <Play size={14} /> Lancer
            </Button>
          )}
          {row.statut === 'active' && (
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleCloturer(v); }}>
              <Square size={14} /> Clôturer
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Enquêtes</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Créer</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <Table columns={columns} data={enquetes} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle enquête" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input type="text" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg" rows="3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
              <input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Questions (JSON)</label>
            <textarea value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm" rows="5"
              placeholder='[{"id":1,"texte":"Question ?","type":"radio","options":["Oui","Non"]}]' />
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
