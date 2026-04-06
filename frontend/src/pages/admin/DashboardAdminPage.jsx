import { useState, useEffect } from 'react';
import { Users, BarChart3, Database, ClipboardList, FileText, Newspaper } from 'lucide-react';
import client from '../../api/client';
import Loading from '../../components/common/Loading';

export default function DashboardAdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'Utilisateurs', value: stats?.utilisateurs || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Indicateurs', value: stats?.indicateurs || 0, icon: BarChart3, color: 'bg-industrie' },
    { label: 'Valeurs saisies', value: stats?.valeurs || 0, icon: Database, color: 'bg-purple-500' },
    { label: 'Enquêtes', value: stats?.enquetes || 0, icon: ClipboardList, color: 'bg-accent' },
    { label: 'Publications', value: stats?.publications || 0, icon: FileText, color: 'bg-commerce' },
    { label: 'Actualités', value: stats?.actualites || 0, icon: Newspaper, color: 'bg-teal-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-xl`}>
              <card.icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
