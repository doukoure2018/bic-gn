import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import BarometreIndustriePage from './pages/public/BarometreIndustriePage';
import BarometreCommercePage from './pages/public/BarometreCommercePage';
import DonneesPage from './pages/public/DonneesPage';
import PublicationsPage from './pages/public/PublicationsPage';
import ActualitesPage from './pages/public/ActualitesPage';
import ActualiteDetailPage from './pages/public/ActualiteDetailPage';
import PartenairesPage from './pages/public/PartenairesPage';
import ContactPage from './pages/public/ContactPage';
import EnquetePublicPage from './pages/public/EnquetePublicPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import UsersPage from './pages/admin/UsersPage';
import IndicateursPage from './pages/admin/IndicateursPage';
import ValeursPage from './pages/admin/ValeursPage';
import EnquetesAdminPage from './pages/admin/EnquetesAdminPage';
import PublicationsAdminPage from './pages/admin/PublicationsAdminPage';
import ActualitesAdminPage from './pages/admin/ActualitesAdminPage';
import ExportPage from './pages/admin/ExportPage';
import SourcesPage from './pages/admin/SourcesPage';
import EntreprisesPage from './pages/admin/EntreprisesPage';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';

import Loading from './components/common/Loading';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/admin/unauthorized" replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/barometre/industrie" element={<BarometreIndustriePage />} />
        <Route path="/barometre/commerce" element={<BarometreCommercePage />} />
        <Route path="/donnees" element={<DonneesPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/actualites" element={<ActualitesPage />} />
        <Route path="/actualites/:slug" element={<ActualiteDetailPage />} />
        <Route path="/partenaires" element={<PartenairesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/enquete/:token" element={<EnquetePublicPage />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdminPage />} />
        <Route path="utilisateurs" element={<ProtectedRoute requiredRole="super_admin"><UsersPage /></ProtectedRoute>} />
        <Route path="indicateurs" element={<ProtectedRoute requiredRole="editeur"><IndicateursPage /></ProtectedRoute>} />
        <Route path="valeurs" element={<ProtectedRoute requiredRole="editeur"><ValeursPage /></ProtectedRoute>} />
        <Route path="enquetes" element={<ProtectedRoute requiredRole="editeur"><EnquetesAdminPage /></ProtectedRoute>} />
        <Route path="entreprises" element={<ProtectedRoute requiredRole="editeur"><EntreprisesPage /></ProtectedRoute>} />
        <Route path="publications" element={<ProtectedRoute requiredRole="editeur"><PublicationsAdminPage /></ProtectedRoute>} />
        <Route path="actualites" element={<ProtectedRoute requiredRole="editeur"><ActualitesAdminPage /></ProtectedRoute>} />
        <Route path="export" element={<ExportPage />} />
        <Route path="sources" element={<ProtectedRoute requiredRole="editeur"><SourcesPage /></ProtectedRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
