import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, status, trend = 'stable', color = '#0A1F44', barColors }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-cgreen' : trend === 'down' ? 'text-cred' : 'text-gold';

  const defaultBars = ['#2E8B57', '#D4A829', '#C41E3A', '#0A1F44'];
  const bars = barColors || defaultBars;

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-lg bg-white shadow-md">
      <div className="flex items-start justify-between p-4 pb-2">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color }}>{value}</span>
            <TrendIcon className={`h-5 w-5 ${trendColor}`} />
          </div>
        </div>
        <div className="rounded bg-gray-100 p-1.5">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            {trend === 'up' && (
              <polyline points="2,20 12,14 22,16 38,4" stroke={color} strokeWidth="2" fill="none" />
            )}
            {trend === 'down' && (
              <polyline points="2,4 12,10 22,8 38,20" stroke={color} strokeWidth="2" fill="none" />
            )}
            {trend === 'stable' && (
              <polyline points="2,14 12,12 22,14 38,12" stroke={color} strokeWidth="2" fill="none" />
            )}
          </svg>
        </div>
      </div>
      <div className="px-4 pb-2">
        <span className={`text-xs font-medium ${trendColor}`}>{status}</span>
      </div>
      <div className="flex h-1.5">
        {bars.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}
