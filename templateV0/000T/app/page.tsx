import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { KpiCards } from "@/components/kpi-cards"
import { ChartsSection } from "@/components/charts-section"
import { StatsRow } from "@/components/stats-row"
import { PublicationsSection } from "@/components/publications-section"
import { QuickLinks } from "@/components/quick-links"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <HeroBanner />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8">
          <KpiCards />
          <ChartsSection />
          <StatsRow />
          <PublicationsSection />
        </div>
      </main>

      <QuickLinks />
      <SiteFooter />
    </div>
  )
}
