import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { FAQ_ITEMS } from "@/components/sections/Faq";
import { VARIANTS } from "@/lib/site";
import {
  SITE_URL,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/lib/seo";

const cfg = VARIANTS.b2b;
const URL = `${SITE_URL}/b2b`;

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          serviceSchema({
            name: "ИИ-отдел продаж под ключ для B2B",
            description:
              "ИИ-отдел продаж для B2B: квалификация, прогрев, первый контакт, интеграция с CRM. Менеджеры работают только с горячими лидами.",
            url: "/b2b",
            serviceType: "ИИ-отдел продаж для B2B",
            audience: "B2B-компании, отделы продаж от 3 менеджеров",
          }),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(FAQ_ITEMS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Для B2B", path: "/b2b" },
          ]),
        ),
      },
    ],
  }),
  component: () => <LandingPage config={cfg} />,
});
