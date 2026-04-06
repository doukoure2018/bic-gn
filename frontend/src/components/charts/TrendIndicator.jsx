import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const config = {
  hausse: { icon: TrendingUp, color: 'text-hausse', bg: 'bg-green-100' },
  baisse: { icon: TrendingDown, color: 'text-baisse', bg: 'bg-red-100' },
  stable: { icon: Minus, color: 'text-stable', bg: 'bg-yellow-100' },
};

export default function TrendIndicator({ tendance = 'stable', variation, size = 'md' }) {
  const { icon: Icon, color, bg } = config[tendance] || config.stable;
  const sizes = { sm: 14, md: 18, lg: 24 };

  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      <span className={`${bg} p-1 rounded`}>
        <Icon size={sizes[size]} />
      </span>
      {variation != null && (
        <span className="text-sm font-medium">
          {variation > 0 ? '+' : ''}{variation}%
        </span>
      )}
    </span>
  );
}
