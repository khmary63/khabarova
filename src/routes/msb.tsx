import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { VARIANTS } from "@/lib/site";

const cfg = VARIANTS.msb;

export const Route = createFileRoute("/msb")({
  head: () => ({
    meta: [
      { title: cfg.meta.title },
      { name: "description", content: cfg.meta.description },
      { property: "og:title", content: cfg.meta.title },
      { property: "og:description", content: cfg.meta.description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <LandingPage config={cfg} />,
});
