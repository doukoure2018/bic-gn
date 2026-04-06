import { Factory, Store, BarChart3, FileText } from "lucide-react"

const links = [
  {
    label: "Barometre Industrie",
    icon: Factory,
    bg: "bg-[#0A1F44]",
    text: "text-[#F5F5F0]",
  },
  {
    label: "Barometre Commerce",
    icon: Store,
    bg: "bg-[#C41E3A]",
    text: "text-[#F5F5F0]",
  },
  {
    label: "Donnees Statistiques",
    icon: BarChart3,
    bg: "bg-[#2E8B57]",
    text: "text-[#F5F5F0]",
  },
  {
    label: "Publications",
    icon: FileText,
    bg: "bg-[#D4A829]",
    text: "text-[#0A1F44]",
  },
]

export function QuickLinks() {
  return (
    <section className="bg-[#D4A829] px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3">
        {links.map((link) => (
          <button
            key={link.label}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-105 ${link.bg} ${link.text}`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </button>
        ))}
      </div>
    </section>
  )
}
