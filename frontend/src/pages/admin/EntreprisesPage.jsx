import { useState, useEffect } from 'react';
import { Plus, Check, Factory } from 'lucide-react';
import { getEntreprises, createEntreprise, validerSecteur } from '../../api/entreprises';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';

const SECTEURS = [
  { code: 'MINES', label: 'Mines & Métallurgie' },
  { code: 'AGROINDUS', label: 'Agro-industrie' },
  { code: 'BTP', label: 'BTP & Construction' },
  { code: 'MANUFACTURES', label: 'Manufactures légères' },
  { code: 'ENERGIE', label: 'Énergie' },
];

export default function EntreprisesPage() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterSecteur, setFilterSecteur] = useState('');
  const [form, setForm] = useState({
    secteur_code: 'MINES', nom_entreprise: '', region: '',
    prod_installee: '', prod_realisee: '', unite_production: 't',
    emplois: 0, pct_emploi_femmes: 0, nbre_emploi_femmes: 0,
    ide_recus: 0, contraintes: '', date_maj: '',
  });

  const load = () => {
    getEntreprises(filterSecteur || undefined).then((res) => { setEntreprises(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, [filterSecteur]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createEntreprise(form);
    setShowModal(false);
    load();
  };

  const handleValider = async (secteur) => {
    await validerSecteur(secteur);
    load();
  };

  if (loading) return <Loading />;

  const columns = [
    { key: 'secteur_code', label: 'Secteur', render: (v) => <Badge color="green">{v}</Badge> },
    { key: 'nom_entreprise', label: 'Entreprise' },
    { key: 'region', label: 'Région' },
    { key: 'emplois', label: 'Emplois' },
    { key: 'ide_recus', label: 'IDE (M$)' },
    { key: 'statut', label: 'Statut', render: (v) => <Badge status={v}>{v}</Badge> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Factory size={24} /> Entreprises industrielles</h1>
        <div className="flex gap-2">
          <select value={filterSecteur} onChange={(e) => setFilterSecteur(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Tous les secteurs</option>
            {SECTEURS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
          </select>
          <Button onClick={() => setShowModal(true)}><Plus size={18} /> Saisir</Button>
        </div>
      </div>

      {/* Boutons validation par secteur */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SECTEURS.map(s => (
          <Button key={s.code} variant="industrie" size="sm" onClick={() => handleValider(s.code)}>
            <Check size={14} /> Publier {s.label}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <Table columns={columns} data={entreprises} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Saisir une entreprise" size="lg">
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
            <select value={form.secteur_code} onChange={(e) => setForm({...form, secteur_code: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
              {SECTEURS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom entreprise</label>
            <input type="text" value={form.nom_entreprise} onChange={(e) => setForm({...form, nom_entreprise: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select value={form.region} onChange={(e) => setForm({...form, region: e.target.value})} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Sélectionner</option>
              {['Conakry','Boké','Kindia','Labé','Faranah','Nzérékoré','Mamou','Kankan'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unité production</label>
            <select value={form.unite_production} onChange={(e) => setForm({...form, unite_production: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
              <option value="t">Tonnes (t)</option>
              <option value="m²">Mètres carrés (m²)</option>
              <option value="unités">Unités</option>
              <option value="GWh">GWh</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prod. installée</label>
            <input type="text" value={form.prod_installee} onChange={(e) => setForm({...form, prod_installee: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prod. réalisée</label>
            <input type="text" value={form.prod_realisee} onChange={(e) => setForm({...form, prod_realisee: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emplois</label>
            <input type="number" value={form.emplois} onChange={(e) => setForm({...form, emplois: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">% Emploi femmes</label>
            <input type="number" step="0.1" value={form.pct_emploi_femmes} onChange={(e) => setForm({...form, pct_emploi_femmes: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IDE reçus (M USD)</label>
            <input type="number" step="0.1" value={form.ide_recus} onChange={(e) => setForm({...form, ide_recus: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraintes</label>
            <input type="text" value={form.contraintes} onChange={(e) => setForm({...form, contraintes: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="col-span-2 flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button type="submit">Saisir</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
