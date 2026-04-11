import { ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const DEFAULT_COLORS = ['#16a34a', '#eab308', '#dc2626', '#3b82f6', '#8b5cf6', '#ec4899'];

const NAME_COLORS = {
  'Optimiste': '#2E8B57',
  'Stable': '#D4A829',
  'Pessimiste': '#C41E3A',
};

export default function PieChart({ data, height = 300, nameKey = 'name', valueKey = 'value' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey={valueKey} nameKey={nameKey} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={i} fill={NAME_COLORS[entry[nameKey]] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RPieChart>
    </ResponsiveContainer>
  );
}
