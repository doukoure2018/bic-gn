import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import client from '../../api/client';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', nom: '', prenom: '', role: 'lecteur', phone: '' });
  const [error, setError] = useState('');

  const loadUsers = () => {
    client.get('/admin/users').then((res) => { setUsers(res.data); setLoading(false); });
  };

  useEffect(loadUsers, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/admin/users', form);
      setShowModal(false);
      setForm({ email: '', password: '', nom: '', prenom: '', role: 'lecteur', phone: '' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur');
    }
  };

  if (loading) return <Loading />;

  const columns = [
    { key: 'nom', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle', render: (v) => <Badge status={v}>{v}</Badge> },
    { key: 'status', label: 'Statut', render: (v) => <Badge status={v}>{v}</Badge> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Ajouter</Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <Table columns={columns} data={users} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvel utilisateur">
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleCreate} className="space-y-4">
          {[
            { name: 'nom', label: 'Nom', type: 'text', required: true },
            { name: 'prenom', label: 'Prénom', type: 'text' },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Mot de passe', type: 'password', required: true },
            { name: 'phone', label: 'Téléphone', type: 'text' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                required={field.required}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="lecteur">Lecteur</option>
              <option value="editeur">Éditeur</option>
              <option value="validateur">Validateur</option>
              <option value="super_admin">Super Admin</option>
            </select>
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
