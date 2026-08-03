import { createFileRoute } from "@tanstack/react-router";
import { FactoryLanding } from "@/components/FactoryLanding";

// Лендинг «Контент-завод». На домене factory.neyromarket.com корень сайта
// переписывается на этот роут в src/server.ts, поэтому лендинг открывается
// и как factory.neyromarket.com/, и как /factory на любом домене.

const TITLE = "Контент-завод на ИИ под ключ | НейроМаркет";
const DESCRIPTION =
  "Автоматизированный контент-завод на NOYA за 3–5 дней: система превращает идеи и материалы в готовые посты и сценарии, адаптирует их под площадки и публикует после согласования.";

export const Route = createFileRoute("/factory")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://factory.neyromarket.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://factory.neyromarket.com/" }],
  }),
  component: FactoryLanding,
});
