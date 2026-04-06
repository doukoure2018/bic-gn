import { FileText, ChevronRight, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const publications = [
  { title: "Rapport Trimestriel 2024", type: "Rapport" },
  { title: "Note de Conjoncture Janvier 2024", type: "Note" },
]

const actualites = [
  {
    title: "Atelier sur la Competitivite",
    date: "07/2023",
  },
  {
    title: "Nouvelle Reforme Commerciale",
    date: "05/2023",
  },
  {
    title: "Investissements en Guinee",
    date: "01/2023",
  },
]

export function PublicationsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-none p-5 shadow-md">
        <h3 className="mb-4 text-base font-bold text-foreground">
          {"Dernieres Publications"}
        </h3>
        <div className="flex flex-col gap-3">
          {publications.map((pub) => (
            <div
              key={pub.title}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0A1F44]">
                  <FileText className="h-4 w-4 text-[#F5F5F0]" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {pub.title}
                </span>
              </div>
              <Button
                size="sm"
                className="bg-[#2E8B57] text-[#F5F5F0] text-xs hover:bg-[#2E8B57]/90"
              >
                Voir Toutes
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-none p-5 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Actualites</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            Voir Toutes
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {actualites.map((news) => (
            <div
              key={news.title}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-14 shrink-0 rounded bg-[#D4A829]/20" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {news.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {news.date}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#0A1F44] font-medium hover:text-[#0A1F44]/80"
              >
                Lire plus
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
