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

const cfg = VARIANTS.msb;
const URL = `${SITE_URL}/msb`;

export const Route = createFileRoute("/msb")({
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
            name: "ИИ-продавец для малого бизнеса",
            description:
              "ИИ-сотрудник в отдел продаж малого бизнеса. Запуск за 2–3 недели без программистов, окупается за 30 дней. Платите как за часть оклада менеджера.",
            url: "/msb",
            serviceType: "ИИ-продавец для малого бизнеса",
            audience: "Малый бизнес, услуги, локальные сервисы",
          }),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(FAQ_ITEMS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Для малого бизнеса", path: "/msb" },
          ]),
        ),
      },
    ],
  }),
  component: () => <LandingPage config={cfg} />,
});
