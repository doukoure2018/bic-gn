"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const ibicData = [
  { year: "2019", value: 82 },
  { year: "2020-Q1", value: 85 },
  { year: "2020-Q2", value: 88 },
  { year: "2020-Q3", value: 84 },
  { year: "2020-Q4", value: 90 },
  { year: "2021-Q1", value: 92 },
  { year: "2021-Q2", value: 88 },
  { year: "2021-Q3", value: 86 },
  { year: "2021-Q4", value: 91 },
  { year: "2022-Q1", value: 94 },
  { year: "2022-Q2", value: 96 },
  { year: "2022-Q3", value: 95 },
  { year: "2022-Q4", value: 93 },
]

const comparisonData = [
  { quarter: "Q1 2021", industrie: 88, commerce: 82 },
  { quarter: "Q2 2021", industrie: 85, commerce: 86 },
  { quarter: "Q3 2021", industrie: 90, commerce: 84 },
  { quarter: "Q4 2021", industrie: 86, commerce: 90 },
  { quarter: "Q1 2022", industrie: 92, commerce: 88 },
  { quarter: "Q2 2022", industrie: 88, commerce: 92 },
  { quarter: "Q3 2022", industrie: 94, commerce: 90 },
  { quarter: "Q4 2022", industrie: 90, commerce: 94 },
]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-none p-5 shadow-md">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {"Evolution de l'Indice IBIC"}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ibicData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[75, 100]}
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0A1F44"
              strokeWidth={2}
              dot={{ r: 4, fill: "#0A1F44", stroke: "#FFF", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-none p-5 shadow-md">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Industrie vs Commerce
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="quarter"
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="industrie"
              name="Industrie"
              stroke="#2E8B57"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2E8B57" }}
            />
            <Line
              type="monotone"
              dataKey="commerce"
              name="Commerce"
              stroke="#D4A829"
              strokeWidth={2}
              dot={{ r: 3, fill: "#D4A829" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
