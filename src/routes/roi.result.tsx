import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AgencyHeader as SiteHeader } from "@/components/agency/AgencyHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RoiResult } from "@/components/roi/RoiResult";
import {
  SECTOR_SLUGS,
  calculateRoi,
  getSector,
  isSectorSlug,
  type SectorSlug,
} from "@/lib/roi";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/seo";

const searchSchema = z.object({
  sector: fallback(
    z.enum(SECTOR_SLUGS as [SectorSlug, ...SectorSlug[]]),
    "obshchiy",
  ).default("obshchiy"),
  staff: fallback(z.number().int().min(0).max(200), 3).default(3),
  salary: fallback(z.number().int().min(0).max(1_000_000), 60000).default(60000),
  leads: fallback(z.number().int().min(0).max(1_000_000), 500).default(500),
  routine: fallback(z.number().int().min(0).max(100), 60).default(60),
});

export const Route = createFileRoute("/roi/result")({
  validateSearch: zodValidator(searchSchema),
  head: ({ match }) => {
    const s = match.search;
    const sector = getSector(s.sector);
    const r = calculateRoi(s);
    const title = `ROI ИИ-сотрудника ${sector.forLabel}: окупаемость ${r.paybackDays} дней | НейроМаркет`;
    const description = `Расчёт окупаемости ИИ-сотрудника ${sector.forLabel}: экономия ФОТ от ${r.monthlySavings.toLocaleString("ru-RU")} ₽/мес, +${r.extraLeads} заявок, окупаемость за ${r.paybackDays} дней.`;
    // Каноникал ведём на пресет-страницу ниши, чтобы не плодить тонкий контент.
    const canonical = isSectorSlug(s.sector)
      ? `${SITE_URL}/roi/${s.sector}`
      : `${SITE_URL}/roi`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        // Произвольные комбинации параметров не индексируем, но даём ходить по ссылкам.
        { name: "robots", content: "noindex, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Главная", path: "/" },
              { name: "Калькулятор ROI", path: "/roi" },
              { name: sector.label, path: `/roi/${s.sector}` },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            serviceSchema({
              name: `Внедрение ИИ-сотрудника ${sector.forLabel}`,
              description,
              url: `/roi/${s.sector}`,
              serviceType: "Внедрение ИИ-сотрудников в продажи",
            }),
          ),
        },
      ],
    };
  },
  component: RoiResultPage,
});

function RoiResultPage() {
  const search = Route.useSearch();
  return (
    <div className="agency nm-redesign nm-internal nm-internal-content flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container-page max-w-3xl py-12 md:py-16">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            <Link to="/roi" className="hover:text-primary">
              Калькулятор ROI
            </Link>{" "}
            → Результат
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Ваш расчёт окупаемости ИИ-сотрудника
          </h1>
          <div className="mt-8">
            <RoiResult input={search} />
          </div>
          <div className="mt-8">
            <Link
              to="/roi"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
            >
              ← Пересчитать
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
