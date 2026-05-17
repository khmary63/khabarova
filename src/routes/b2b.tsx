import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { VARIANTS } from "@/lib/site";

const cfg = VARIANTS.b2b;
const URL = "https://neyromarket.com/b2b";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: cfg.meta.title },
      { name: "description", content: cfg.meta.description },
      { property: "og:title", content: cfg.meta.title },
      { property: "og:description", content: cfg.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: () => <LandingPage config={cfg} />,
});
