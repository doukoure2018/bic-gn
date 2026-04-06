import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: string
  status: string
  trend: "up" | "down" | "stable"
  color: string
  barColors: string[]
}

function KpiCard({ title, value, status, trend, color, barColors }: KpiCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor =
    trend === "up" ? "text-[#2E8B57]" : trend === "down" ? "text-[#C41E3A]" : "text-[#D4A829]"

  return (
    <Card className="flex flex-col gap-0 overflow-hidden border-none shadow-md">
      <div className="flex items-start justify-between p-4 pb-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color }}>
              {value}
            </span>
            <TrendIcon className={`h-5 w-5 ${trendColor}`} />
          </div>
        </div>
        <div className="rounded bg-muted p-1.5">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            {trend === "up" && (
              <polyline
                points="2,20 12,14 22,16 38,4"
                stroke={color}
                strokeWidth="2"
                fill="none"
              />
            )}
            {trend === "down" && (
              <polyline
                points="2,4 12,10 22,8 38,20"
                stroke={color}
                strokeWidth="2"
                fill="none"
              />
            )}
            {trend === "stable" && (
              <polyline
                points="2,14 12,12 22,14 38,12"
                stroke={color}
                strokeWidth="2"
                fill="none"
              />
            )}
          </svg>
        </div>
      </div>
      <div className="px-4 pb-2">
        <span className={`text-xs font-medium ${trendColor}`}>
          {status}
        </span>
      </div>
      <div className="flex h-1.5">
        {barColors.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    </Card>
  )
}

export function KpiCards() {
  const cards: KpiCardProps[] = [
    {
      title: "Indice IBIC",
      value: "58",
      status: "Situation Stable",
      trend: "stable",
      color: "#0A1F44",
      barColors: ["#2E8B57", "#D4A829", "#C41E3A", "#0A1F44"],
    },
    {
      title: "Secteur Industrie",
      value: "52",
      status: "En Baisse",
      trend: "down",
      color: "#C41E3A",
      barColors: ["#C41E3A", "#D4A829", "#0A1F44", "#2E8B57"],
    },
    {
      title: "Secteur Commerce",
      value: "61",
      status: "En Hausse",
      trend: "up",
      color: "#2E8B57",
      barColors: ["#2E8B57", "#0A1F44", "#D4A829", "#C41E3A"],
    },
    {
      title: "Inflation",
      value: "12,4%",
      status: "En Augmentation",
      trend: "up",
      color: "#D4A829",
      barColors: ["#D4A829", "#C41E3A", "#2E8B57", "#0A1F44"],
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  )
}
