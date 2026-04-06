const colors = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800',
  orange: 'bg-orange-100 text-orange-800',
};

const statusColors = {
  hausse: 'green', baisse: 'red', stable: 'yellow',
  active: 'green', inactive: 'gray', suspended: 'red',
  brouillon: 'gray', valide: 'blue', publie: 'green',
  bon: 'green', mauvais: 'red',
  nouveau: 'blue', lu: 'yellow', traite: 'green', archive: 'gray',
  complete: 'green', en_cours: 'yellow', cloturee: 'orange',
};

export default function Badge({ children, color, status }) {
  const c = color || statusColors[status] || 'gray';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[c]}`}>
      {children || status}
    </span>
  );
}
