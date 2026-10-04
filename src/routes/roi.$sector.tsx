import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AgencyHeader as SiteHeader } from "@/components/agency/AgencyHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RoiResult } from "@/components/roi/RoiResult";
import { RoiQuiz } from "@/components/roi/RoiQuiz";
import {
  SECTOR_SLUGS,
  SECTORS,
  calculateRoi,
  getSector,
  isSectorSlug,
} from "@/lib/roi";
import {
  SITE_URL,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/roi/$sector")({
  loader: ({ params }) => {
    if (!isSectorSlug(params.sector)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    if (!isSectorSlug(params.sector)) return {};
    const sector = getSector(params.sector);
    const r = calculateRoi({ sector: sector.slug, ...sector.defaults });
    const url = `${SITE_URL}/roi/${sector.slug}`;
    const title = `ROI ИИ-сотрудника ${sector.forLabel} — окупаемость и экономия | НейроМаркет`;
    const description = `Сколько экономит ИИ-сотрудник ${sector.forLabel}: до ${r.monthlySavings.toLocaleString("ru-RU")} ₽/мес на ФОТ, рост заявок и окупаемость за ${r.paybackDays} дней. Рассчитайте свой ROI.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            serviceSchema({
              name: `Внедрение ИИ-сотрудника ${sector.forLabel}`,
              description,
              url: `/roi/${sector.slug}`,
              serviceType: "Внедрение ИИ-сотрудников в продажи",
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema(sector.faq)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Главная", path: "/" },
              { name: "Калькулятор ROI", path: "/roi" },
              { name: sector.label, path: `/roi/${sector.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: RoiSectorPage,
});

function RoiSectorPage() {
  const { sector: slug } = Route.useParams();
  const sector = getSector(slug);
  const presetInput = { sector: sector.slug, ...sector.defaults };

  return (
    <div className="agency nm-redesign nm-internal nm-internal-content flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container-page max-w-3xl py-12 md:py-16">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            <Link to="/roi" className="hover:text-primary">
              Калькулятор ROI
            </Link>{" "}
            → {sector.label}
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            ROI ИИ-сотрудника {sector.forLabel}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {sector.intro}
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Ниже — ориентировочный расчёт по типовым показателям {sector.label.toLowerCase()}.
            Хотите цифры под свой бизнес — пройдите квиз ниже.
          </p>

          <div className="mt-8">
            <RoiResult input={presetInput} />
          </div>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Рассчитать под ваши показатели
            </h2>
            <div className="mt-4">
              <RoiQuiz initialSector={sector.slug} />
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Частые вопросы
            </h2>
            <div className="mt-4 space-y-3">
              {sector.faq.map((f) => (
                <details
                  key={f.q}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <summary className="cursor-pointer text-sm font-medium">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Другие ниши
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {SECTOR_SLUGS.filter((s) => s !== slug && s !== "obshchiy").map(
                (s) => (
                  <Link
                    key={s}
                    to="/roi/$sector"
                    params={{ sector: s }}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
                  >
                    {SECTORS[s].label}
                  </Link>
                ),
              )}
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
