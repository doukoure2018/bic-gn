import { Download, FileSpreadsheet } from 'lucide-react';
import Button from '../../components/common/Button';

export default function ExportPage() {
  const exports = [
    { label: 'Indicateurs (tous)', url: '/api/export/indicateurs/excel', icon: FileSpreadsheet },
    { label: 'Indicateurs Industrie', url: '/api/export/indicateurs/excel?secteur=IND', icon: FileSpreadsheet },
    { label: 'Indicateurs Commerce', url: '/api/export/indicateurs/excel?secteur=COM', icon: FileSpreadsheet },
    { label: 'Valeurs (toutes)', url: '/api/export/valeurs/excel', icon: FileSpreadsheet },
    { label: 'Données Industrie', url: '/api/export/donnees/IND', icon: FileSpreadsheet },
    { label: 'Données Commerce', url: '/api/export/donnees/COM', icon: FileSpreadsheet },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Export des données</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exports.map((exp) => (
          <div key={exp.label} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center gap-4">
            <div className="bg-green-100 p-4 rounded-xl">
              <exp.icon size={32} className="text-industrie" />
            </div>
            <p className="font-medium text-center">{exp.label}</p>
            <a href={exp.url} download>
              <Button variant="industrie" size="sm">
                <Download size={16} /> Télécharger Excel
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
