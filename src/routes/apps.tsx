import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/lib/site";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/seo";

const URL = `${SITE_URL}/apps`;

export const Route = createFileRoute("/apps")({
  loader: async () => {
    const s = await getSiteSettings();
    if (!s.apps) throw notFound();
    return null;
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
        content: "Готовые приложения и услуги по вайбкодингу от Марии Хабаровой: MVP за выходные, ИИ-фичи в продукт, обучение.",
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
            name: "Вайбкодинг: MVP и ИИ-фичи под ключ",
            description:
              "Быстрая разработка веб-сервисов, MVP и ИИ-инструментов методом вайбкодинга. MVP за выходные от 60 000 ₽, ИИ-фичи в продукт от 35 000 ₽, менторство от 8 000 ₽/час.",
            url: "/apps",
            serviceType: "Вайбкодинг, MVP-разработка, интеграция ИИ",
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
};

const apps: AppItem[] = [
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
      "Соберу полностью готовый к работе сайт, (мульти)лендинг, интернет-магазин.",
    price: "от 30 000 ₽",
    bullets: [
      "Дизайн в едином стиле",
      "База данных + авторизация",
      "Деплой на ваш домен",
      "Передача исходников",
      "SEO + GEO оптимизация",
    ],
  },
  {
    title: "ИИ-фичи в продукт",
    description:
      "Встраиваю ИИ-чат, генерацию контента, классификацию, голосового помощника в ваш сайт или приложение.",
    price: "от 35 000 ₽",
    bullets: [
      "Подбор модели под задачу",
      "Промпт-инжиниринг",
      "Интеграция с вашей CRM",
      "Метрики и логи",
    ],
    featured: true,
  },
  {
    title: "Обучение вайбкодингу",
    description:
      "Личное менторство: научу собирать приложения через Lovable / Cursor, работать с ИИ-агентами и продавать результат.",
    price: "от 8 000 ₽ / час",
    bullets: [
      "Индивидуальная программа",
      "Разбор ваших проектов",
      "Доступ к шаблонам и промптам",
      "Поддержка в чате",
    ],
  },
];

function AppsPage() {
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
            Мои приложения
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
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 sm:w-auto"
              >
                Написать в WhatsApp
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-white/10 sm:w-auto"
              >
                Telegram
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
