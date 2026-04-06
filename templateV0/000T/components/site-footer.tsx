import { Factory, Store, BarChart3, FileText } from "lucide-react"

const categories = [
  {
    label: "Barometre Industrie",
    icon: Factory,
    color: "border-[#0A1F44]",
    iconBg: "bg-[#0A1F44]",
  },
  {
    label: "Barometre Commerce",
    icon: Store,
    color: "border-[#C41E3A]",
    iconBg: "bg-[#C41E3A]",
  },
  {
    label: "Donnees Statistiques",
    icon: BarChart3,
    color: "border-[#2E8B57]",
    iconBg: "bg-[#2E8B57]",
  },
  {
    label: "Publications",
    icon: FileText,
    color: "border-[#D4A829]",
    iconBg: "bg-[#D4A829]",
  },
]

const partners = [
  { name: "Ministere de l'Industrie", color: "#0A1F44" },
  { name: "Ministere du Commerce", color: "#2E8B57" },
  { name: "BCRG", color: "#D4A829" },
  { name: "INS", color: "#C41E3A" },
]

export function SiteFooter() {
  return (
    <footer>
      {/* Categories Banner */}
      <div className="bg-[#0A1F44] px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className={`flex items-center gap-3 rounded-lg border-2 bg-card px-5 py-3 ${cat.color}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded ${cat.iconBg}`}
              >
                <cat.icon className="h-4 w-4 text-[#F5F5F0]" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="bg-card px-4 py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: p.color }}
              >
                <span className="text-xs font-bold text-[#F5F5F0]">
                  {p.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#0A1F44] px-4 py-3 text-center">
        <p className="text-xs text-[#F5F5F0]/60">
          {"© 2024 ONCP - Observatoire National du Commerce et des Prix. Tous droits reserves."}
        </p>
      </div>
    </footer>
  )
}
