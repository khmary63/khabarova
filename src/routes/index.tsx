import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { FAQ_ITEMS } from "@/components/sections/Faq";
import { VARIANTS, SITE } from "@/lib/site";
import {
  SITE_URL,
  organizationSchema,
  personSchema,
  websiteSchema,
  webPageSchema,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
  caseStudiesItemList,
} from "@/lib/seo";

const cfg = VARIANTS.main;
const URL = `${SITE_URL}/`;

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
      { name: "author", content: SITE.expert },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(organizationSchema()) },
      { type: "application/ld+json", children: JSON.stringify(personSchema()) },
      { type: "application/ld+json", children: JSON.stringify(websiteSchema()) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          webPageSchema({
            name: cfg.meta.title,
            description: cfg.meta.description,
            path: "/",
          }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          serviceSchema({
            name: "Внедрение ИИ-сотрудников в отдел продаж",
            description:
              "Внедряем ИИ-продавцов и нейроворонки под ключ: ответ за секунды 24/7, интеграция с CRM и мессенджерами. Первый результат за 7 дней, базовое внедрение — 2 недели.",
            url: "/",
            serviceType: "Внедрение ИИ-сотрудников в продажи",
            audience: "Малый и средний бизнес, B2B",
          }),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(caseStudiesItemList()) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(FAQ_ITEMS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Главная", path: "/" }])),
      },
    ],
  }),
  component: () => <LandingPage config={cfg} />,
});
