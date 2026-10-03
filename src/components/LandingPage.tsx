import { Hero } from "@/components/sections/Hero";
import { Pains } from "@/components/sections/Pains";
import { Services } from "@/components/sections/Services";
import { Audience } from "@/components/sections/Audience";
import { Cases } from "@/components/sections/Cases";
import { Demo } from "@/components/sections/Demo";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { Objections } from "@/components/sections/Objections";
import { Faq } from "@/components/sections/Faq";
import { Guarantees } from "@/components/sections/Guarantees";
import { LeadForm } from "@/components/sections/LeadForm";
import { FinalCta } from "@/components/sections/FinalCta";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import { openEurekaChat } from "@/lib/eureka";
import type { VariantConfig } from "@/lib/site";

export function LandingPage({ config }: { config: VariantConfig }) {
  return (
    <div className="landing-motion min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero config={config} onOpenChat={openEurekaChat} />
        <Pains config={config} />
        <Services />
        <Audience />
        <Cases config={config} />
        <Demo onOpenChat={openEurekaChat} />
        <About />
        <Process />
        <Guarantees />
        <Objections />
        <Faq />
        <LeadForm source={config.source} />
        <FinalCta />
      </main>
      <SiteFooter hideLocation={config.source === "main"} />
      
      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
}
