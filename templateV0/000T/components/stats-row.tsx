import { Factory, Store, Users, TrendingUp } from "lucide-react"

interface StatItem {
  icon: React.ReactNode
  label: string
  value: string
  unit?: string
}

export function StatsRow() {
  const stats: StatItem[] = [
    {
      icon: <Factory className="h-6 w-6 text-[#0A1F44]" />,
      label: "Production Industrielle",
      value: "78,5",
    },
    {
      icon: <Store className="h-6 w-6 text-[#2E8B57]" />,
      label: "Chiffre d'Affaires Commerce",
      value: "235",
      unit: "Mrd GNF",
    },
    {
      icon: <Users className="h-6 w-6 text-[#D4A829]" />,
      label: "Emplois",
      value: "980,000",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#C41E3A]" />,
      label: "Exportations",
      value: "175",
      unit: "Mrd GNF",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
            <p className="text-lg font-bold text-foreground">
              {stat.value}
              {stat.unit && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {stat.unit}
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
