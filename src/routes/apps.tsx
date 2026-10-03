import { createFileRoute, notFound } from "@tanstack/react-router";
import { AgencyHeader as SiteHeader } from "@/components/agency/AgencyHeader";
import { SiteFooter } from "@/components/SiteFooter";

import { SITE } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { listPortfolio, type PortfolioProject } from "@/lib/portfolio.functions";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/seo";

const URL = `${SITE_URL}/apps`;

export const Route = createFileRoute("/apps")({
  loader: async () => {
    const s = await getSiteSettings();
    if (!s.apps) throw notFound();
    const { projects } = await listPortfolio();
    return { portfolio: projects };
  },

  head: () => ({
    meta: [
      { title: "Приложения и услуги вайбкодинга — НейроМаркет" },
      {
        name: "description",
        content:
          "Готовые приложения и услуги по вайбкодингу: быстрая разработка веб-сервисов, MVP, ИИ-инструментов и автоматизаций на заказ.",
      },
      { property: "og:title", content: "Приложения и услуги вайбкодинга" },
      {
        property: "og:description",
        content: "Готовые приложения и услуги по вайбкодингу от Марии Хабаровой: Сайт за выходные, ИИ-оптимизация процессов, разработка приложений.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          serviceSchema({
            name: "Вайбкодинг: Сайт за выходные и ИИ-оптимизация процессов под ключ",
            description:
              "Быстрая разработка веб-сервисов, сайтов и ИИ-инструментов методом вайбкодинга. Сайт за выходные от 20 000 ₽, ИИ-оптимизация процессов от 10 000 ₽, разработка приложений от 20 000 ₽.",
            url: "/apps",
            serviceType: "Вайбкодинг, разработка сайтов, интеграция ИИ",
          }),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Приложения и вайбкодинг", path: "/apps" },
          ]),
        ),
      },
    ],
  }),
  component: AppsPage,
});




type Service = {
  title: string;
  description: string;
  price: string;
  bullets: string[];
  featured?: boolean;
};

const services: Service[] = [
  {
    title: "Сайт за выходные",
    description:
      "Соберу полностью готовый к работе сайт, (мульти)лендинг, интернет-магазин.\nНа выходе — не просто сайт, \nа современный конверсионный маркетинговый инструмент для привлечения трафика.",
    price: "от 15 000 ₽",
    bullets: [
      "Дизайн в едином стиле",
      "База данных + авторизация",
      "Деплой на ваш домен",
      "Передача исходников",
      "SEO + GEO оптимизация",
      "Панель управления + аналитика",
      "Маркетинговые фишки (квизы, лид-магниты, формы)",
    ],
  },
  {
    title: "ИИ-оптимизация процессов",
    description:
      "Встраиваю ИИ-инструменты в ваши повседневные бизнес-процессы: генерация контента, разработка документов, администрирование, анализ данных, построение отчетности, подготовка презентаций и дашбордов, управление календарями, калькуляторы, генераторы коммерческих предложений и смет. Выберете рутинную задачу, которая вас \"достала\" и отдайте ее на выполнение ИИ.",
    price: "от 10 000 ₽",
    bullets: [
      "Подбор модели решения под задачу",
      "Промпт-инжиниринг",
      "Готовые ИИ-ассистенты для Perplexitу Spaces и других AI-платформ",
      "Инструкция по установке и использованию.",
    ],
    featured: true,
  },
  {
    title: "Разработка приложений",
    description:
      "Веб- и мобильные приложения под ваши цели и задачи. Генерация всех видов контента: текст, изображения, видео. Автоматизация через n8n.",
    price: "от 20 000 ₽",
    bullets: [
      "Индивидуальное решение под ваши цели и задачи. ",
      "Деплой на ваш домен",
      "Передача исходников",
      "База данных + авторизация",
      "SEO + GEO оптимизация",
      "Панель управления + аналитика",
      "Техническая поддержка приложения в чате",
      "Маркетинговые фишки (квизы, лид-магниты, формы)",
    ],
  },
];




function ProjectCard({ project: p }: { project: PortfolioProject }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 transition-all duration-500 hover:border-primary/50">
      <PortfolioGallery
        images={p.images}
        layout={p.layout}
        title={p.title}
        tag={p.tag}
      />
      <div className="flex flex-1 flex-col gap-3 px-2 pb-2 pt-5">
        <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
          {p.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {p.description}
        </p>
      </div>
    </article>
  );
}

function AppsPage() {
  const { portfolio } = Route.useLoaderData() as { portfolio: PortfolioProject[] };
  const webProjects = portfolio.filter((p) => p.layout !== "mobile");
  const mobileProjects = portfolio.filter((p) => p.layout === "mobile");
  return (

    <div className="agency nm-redesign nm-internal nm-internal-content relative min-h-screen overflow-hidden bg-background">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] -right-[10%] h-[40%] w-[30%] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <SiteHeader />

      <main className="container-page relative space-y-32 py-20 md:py-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl space-y-7 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Вайбкодинг · Приложения и услуги
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Магия{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              вайбкодинга
            </span>
          </h1>

          <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
            Здесь — мои продукты и услуги по быстрой разработке с ИИ.{"\n"}
            Собираю веб- и мобильные приложения, настраиваю ИИ-ассистентов и ИИ-агентов со сложной логикой работы, внутренние инструменты для бизнеса.{"\n"}
            Разрабатываю сайты, (мульти)лендинги, интернет-магазины за считанные часы вместо месяцев и по ценам в разы меньше, чем при стандартной разработке.{"\n"}
            Разрабатываю SEO-порталы, провожу SEO и GEO оптимизацию.{"\n"}
            Забудьте про платную рекламу — появились новые эффективные инструменты по привлечению органического трафика.
          </p>
        </header>

        {/* Services */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Услуги вайбкодинга
            </h2>
            <p className="text-muted-foreground">
              Беру в работу проекты, где важна скорость и качество исполнения.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.title}
                className={
                  s.featured
                    ? "space-y-6 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-8 ring-1 ring-primary/20"
                    : "space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-8"
                }
              >
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {s.title}
                  </h3>
                  <div className="text-sm font-bold tracking-tight text-primary">
                    {s.price}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <ul className="space-y-3">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <span
                        className={`h-1.5 w-1.5 flex-none rounded-full ${
                          s.featured ? "bg-primary" : "bg-primary/50"
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Портфолио проектов
            </h2>
            <p className="text-muted-foreground">
              Сайты, интернет-магазины и приложения, которые я уже запустила.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {webProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>

          {mobileProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {mobileProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>



        {/* CTA */}
        <section className="group relative">
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-primary/20 opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative space-y-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-10 text-center md:p-14">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Нужно собрать продукт быстро?
            </h2>
            <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">
              Напишите задачу — отвечу за пару часов и предложу формат: готовое
              приложение, услуга под ключ. Если задача для меня окажется слишком сложной — найду специалиста, который в состоянии ее выполнить.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Написать в WhatsApp
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#229ED9] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Написать в Telegram
              </a>
              <a
                href={SITE.max}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-900 shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                Написать в Max
              </a>
              <a
                href="/#lead"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-white/10"
              >
                Бесплатная консультация
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      
    </div>
  );
}
