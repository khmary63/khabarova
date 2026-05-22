import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { FAQ_ITEMS } from "@/components/sections/Faq";
import { VARIANTS, SITE } from "@/lib/site";

const cfg = VARIANTS.main;
const URL = "https://neyromarket.com/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: cfg.meta.title },
      { name: "description", content: cfg.meta.description },
      { property: "og:title", content: cfg.meta.title },
      { property: "og:description", content: cfg.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.brand,
          url: "https://neyromarket.com",
          email: SITE.email,
          telephone: SITE.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.city,
            addressCountry: "RU",
          },
          founder: { "@type": "Person", name: SITE.expert },
          sameAs: [SITE.vk, SITE.telegram],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.brand,
          url: "https://neyromarket.com",
          inLanguage: "ru-RU",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: () => <LandingPage config={cfg} />,
});
