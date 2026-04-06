import { ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#16a34a', '#dc2626', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function PieChart({ data, height = 300, nameKey = 'name', valueKey = 'value' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey={valueKey} nameKey={nameKey} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RPieChart>
    </ResponsiveContainer>
  );
}
