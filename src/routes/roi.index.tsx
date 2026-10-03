import { createFileRoute, Link } from "@tanstack/react-router";
import { AgencyHeader as SiteHeader } from "@/components/agency/AgencyHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RoiQuiz } from "@/components/roi/RoiQuiz";
import { SECTOR_SLUGS, SECTORS } from "@/lib/roi";
import {
  SITE_URL,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/lib/seo";

const URL = `${SITE_URL}/roi`;
const TITLE = "Калькулятор ROI ИИ-сотрудника — окупаемость за минуту | НейроМаркет";
const DESCRIPTION =
  "Бесплатный калькулятор окупаемости ИИ-сотрудника в продажах. Пройдите квиз и узнайте экономию ФОТ, рост заявок и срок окупаемости для вашей ниши.";

const QUIZ_FAQ = [
  {
    q: "Как считается окупаемость ИИ-сотрудника?",
    a: "Калькулятор учитывает экономию фонда оплаты труда (доля рутины, которую забирает ИИ, умноженная на численность и оклад с учётом налогов) и прогноз роста заявок за счёт мгновенных ответов 24/7.",
  },
  {
    q: "Калькулятор бесплатный?",
    a: "Да, расчёт бесплатный и показывается сразу после прохождения квиза. Для точного расчёта под ваши процессы есть бесплатный ИИ-аудит.",
  },
];

export const Route = createFileRoute("/roi/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          serviceSchema({
            name: "Калькулятор ROI ИИ-сотрудника в продажах",
            description:
              "Онлайн-калькулятор окупаемости ИИ-сотрудника: экономия ФОТ, рост заявок и срок окупаемости для вашей ниши.",
            url: "/roi",
            serviceType: "Внедрение ИИ-сотрудников в продажи",
            audience: "Малый и средний бизнес, B2B",
          }),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(QUIZ_FAQ)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Калькулятор ROI", path: "/roi" },
          ]),
        ),
      },
    ],
  }),
  component: RoiIndexPage,
});

function RoiIndexPage() {
  return (
    <div className="agency nm-redesign nm-internal nm-internal-content flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container-page max-w-3xl py-12 md:py-16">
          <div className="text-xs uppercase tracking-widest text-primary">
            Калькулятор ROI
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Узнайте, за сколько окупится ИИ-сотрудник в ваших продажах
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Ответьте на 5 вопросов — и получите расчёт экономии на фонде оплаты
            труда, прогноз роста заявок и срок окупаемости. Без регистрации, за минуту.
          </p>

          <div className="mt-8">
            <RoiQuiz />
          </div>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Расчёт по нишам
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Готовые расчёты окупаемости ИИ-сотрудника для разных сфер бизнеса:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SECTOR_SLUGS.filter((s) => s !== "obshchiy").map((slug) => (
                <Link
                  key={slug}
                  to="/roi/$sector"
                  params={{ sector: slug }}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
                >
                  {SECTORS[slug].label}
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
