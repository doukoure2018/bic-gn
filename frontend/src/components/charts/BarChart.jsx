import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

function getScoreColor(value) {
  if (value <= 2) return '#2E8B57';
  if (value <= 3) return '#D4A829';
  return '#C41E3A';
}

export default function BarChart({ data, bars, height = 300, xKey = 'name', colorByValue = false }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {bars.map((bar) => (
          <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} radius={[4, 4, 0, 0]}>
            {colorByValue && data.map((entry, i) => (
              <Cell key={i} fill={getScoreColor(entry[bar.key])} />
            ))}
          </Bar>
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );
}
