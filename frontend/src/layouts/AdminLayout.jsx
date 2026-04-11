import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart3, Database, ClipboardList,
  FileText, Newspaper, Download, Globe, Factory, LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['lecteur'] },
  { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users, roles: ['super_admin'] },
  { label: 'Indicateurs', path: '/admin/indicateurs', icon: BarChart3, roles: ['editeur'] },
  { label: 'Valeurs', path: '/admin/valeurs', icon: Database, roles: ['editeur'] },
  { label: 'Entreprises', path: '/admin/entreprises', icon: Factory, roles: ['editeur'] },
  { label: 'Enquêtes', path: '/admin/enquetes', icon: ClipboardList, roles: ['editeur'] },
  { label: 'Publications', path: '/admin/publications', icon: FileText, roles: ['editeur'] },
  { label: 'Actualités', path: '/admin/actualites', icon: Newspaper, roles: ['editeur'] },
  { label: 'Sources données', path: '/admin/sources', icon: Globe, roles: ['editeur'] },
  { label: 'Export', path: '/admin/export', icon: Download, roles: ['lecteur'] },
];

export default function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredItems = menuItems.filter((item) => hasRole(item.roles[0]));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2 no-underline">
            <img src="/images/logo-bicgn.jpeg" alt="BIC-GN" className="h-10 w-auto rounded" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white cursor-pointer bg-transparent border-0"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline ${
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-white/60 text-xs mb-2">{user?.nom} ({user?.role})</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/70 hover:text-white text-sm cursor-pointer bg-transparent border-0">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden cursor-pointer"><Menu size={24} /></button>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/" className="text-sm text-primary hover:underline">Voir le site</Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
