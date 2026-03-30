import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { StatsSection } from "@/components/sections/StatsSection"
import { PricingSection } from "@/components/sections/PricingSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { DownloadSection } from "@/components/sections/DownloadSection"
import { CTASection } from "@/components/sections/CTASection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen bg-[#050a14]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <DownloadSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
