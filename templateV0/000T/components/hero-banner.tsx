import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-skyline.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/85 via-[#0A1F44]/75 to-[#0A1F44]/90" />

      <div className="relative z-10 flex flex-col items-center px-4 py-16 text-center md:py-24">
        <h1 className="font-mono text-2xl font-extrabold uppercase tracking-widest text-[#F5F5F0] md:text-4xl lg:text-5xl text-balance">
          {"Barometre Industrie & Commerce"}
        </h1>
        <div className="mt-3 inline-block rounded bg-[#D4A829] px-6 py-1">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#0A1F44]">
            Guinee
          </span>
        </div>
        <p className="mt-4 text-base text-[#F5F5F0]/80 md:text-lg">
          {"Suivi de la performance economique nationale"}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-2 border-[#F5F5F0] bg-transparent px-6 text-[#F5F5F0] hover:bg-[#F5F5F0] hover:text-[#0A1F44]"
          >
            Consulter Industrie
          </Button>
          <Button className="flex items-center gap-1 rounded-full bg-[#2E8B57] px-6 text-[#F5F5F0] hover:bg-[#2E8B57]/90">
            Consulter Commerce
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button className="rounded-full bg-[#C41E3A] px-6 text-[#F5F5F0] hover:bg-[#C41E3A]/90">
            {"Telecharger le Rapport"}
          </Button>
        </div>
      </div>
    </section>
  )
}
