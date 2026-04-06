import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-commerce mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-8">Accès non autorisé</p>
      <Link to="/admin/login"><Button>Se connecter</Button></Link>
    </div>
  );
}
