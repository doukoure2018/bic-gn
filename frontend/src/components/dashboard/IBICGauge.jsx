export default function IBICGauge({ value = 50, size = 160 }) {
  const color = value < 40 ? '#dc2626' : value < 60 ? '#f59e0b' : '#16a34a';
  const label = value < 40 ? 'Mauvais' : value < 60 ? 'Stable' : 'Bon';
  const angle = (value / 100) * 180;
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  const startAngle = Math.PI;
  const endAngle = Math.PI - (angle * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy - r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy - r * Math.sin(endAngle);

  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <text x={cx} y={cy - 5} textAnchor="middle" className="text-3xl font-bold" fill={color}>
          {value}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" className="text-xs" fill="#6b7280">
          {label}
        </text>
      </svg>
    </div>
  );
}
