import { Hero } from "@/components/sections/Hero";
import { Pains } from "@/components/sections/Pains";
import { Services } from "@/components/sections/Services";
import { Cases } from "@/components/sections/Cases";
import { Demo } from "@/components/sections/Demo";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { Objections } from "@/components/sections/Objections";
import { LeadForm } from "@/components/sections/LeadForm";
import { FinalCta } from "@/components/sections/FinalCta";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import type { VariantConfig } from "@/lib/site";

export function LandingPage({ config }: { config: VariantConfig }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero config={config} />
        <Pains config={config} />
        <Services />
        <Cases config={config} />
        <Demo />
        <About />
        <Process />
        <Objections />
        <LeadForm source={config.source} />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyMobileCta />
      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
}
