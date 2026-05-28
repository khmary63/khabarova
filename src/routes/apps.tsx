import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/lib/site";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { listPortfolio, type PortfolioProject } from "@/lib/portfolio.functions";
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
              "Быстрая разработка веб-сервисов, сайтов и ИИ-инструментов методом вайбкодинга. Сайт за выходные от 50 000 ₽, ИИ-оптимизация процессов от 10 000 ₽, разработка приложений от 50 000 ₽.",
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

type AppItem = {
  title: string;
  description: string;
  tag: string;
  href?: string;
  status: "live" | "soon";
  badge?: string;
  image?: string;
  external?: boolean;
};

const apps: AppItem[] = [
  {
    title: "КроссПост",
    description:
      "Автоматизируйте свой контент-маркетинг! Наш сервис поможет вам публиковать посты во всех соцсетях одновременно. Экономьте время, увеличивайте охват.\nСоздавайте посты с помощью AI, оформляйте в стильных шаблонах и публикуйте сразу в Telegram, ВКонтакте и Макс. Планируйте контент на недели вперёд.",
    tag: "SaaS · Контент-маркетинг",
    href: "https://crosspost.neyromarket.com/",
    status: "live",
    badge: "Бесплатно / по подписке",
    image: new globalThis.URL("../assets/portfolio/crosspost.png", import.meta.url).href,
    external: true,
  },
  {
    title: "НейроМаркет — этот сайт",
    description:
      "Лендинг с ИИ-консультантом, демо-чатом, блогом и админкой. Полностью собран на вайбкодинге за несколько часов.",
    tag: "Лендинг + ИИ-чат",
    href: "/",
    status: "live",
  },
  {
    title: "ИИ-ассистент для записи",
    description:
      "Виджет, который общается с клиентами в WhatsApp/Telegram и сам записывает их в YCLIENTS без оператора.",
    tag: "SaaS · ИИ",
    status: "soon",
  },
  {
    title: "Генератор офферов",
    description:
      "Внутренний инструмент: за минуту делает структурированный оффер и продающий лендинг под нишу клиента.",
    tag: "Внутренний tool",
    status: "soon",
  },
];

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
    price: "от 50 000 ₽",
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
    price: "от 50 000 ₽",
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




function AppsPage() {
  const { portfolio } = Route.useLoaderData() as { portfolio: PortfolioProject[] };
  return (

    <div className="relative min-h-screen overflow-hidden bg-background">
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

        {/* Apps */}
        <section className="space-y-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Сам себе маркетолог
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {apps.map((app) => {
              const isLive = app.status === "live";
              return (
                <article
                  key={app.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:border-primary/50"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={`relative space-y-4 ${isLive ? "" : "opacity-70"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {app.tag}
                      </span>
                      <span
                        className={
                          isLive
                            ? "rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary"
                            : "rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-muted-foreground"
                        }
                      >
                        {isLive ? "В работе" : "Скоро"}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {app.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {app.description}
                    </p>
                    {app.href && (
                      <Link
                        to={app.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        Открыть
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

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
            {portfolio.map((p) => {
              let host = "";
              try {
                host = new globalThis.URL(p.url).hostname.replace(/^www\./, "");
              } catch {
                host = p.url;
              }
              return (
                <article
                  key={p.url}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-500 hover:border-primary/50"
                >
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-[4/3] overflow-hidden bg-neutral-900"
                    aria-label={`Открыть ${p.title}`}
                  >
                    <img
                      src={p.image_url}
                      alt={`Эскиз главной страницы ${p.title}`}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                      {p.tag}
                    </span>
                  </a>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {p.title}
                      </h3>
                      <div className="text-xs text-muted-foreground">{host}</div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-auto pt-2">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
                      >
                        Открыть
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
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
