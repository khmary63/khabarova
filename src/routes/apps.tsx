import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/apps")({
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
        content: "Готовые приложения и услуги по вайбкодингу от Марии.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/apps" },
    ],
    links: [{ rel: "canonical", href: "/apps" }],
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
    title: "Скоро: ИИ-ассистент для записи",
    description:
      "Виджет, который общается с клиентами в WhatsApp/Telegram и сам записывает их в YCLIENTS без оператора.",
    tag: "SaaS · ИИ",
    status: "soon",
  },
  {
    title: "Скоро: Генератор офферов",
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
};

const services: Service[] = [
  {
    title: "MVP за выходные",
    description:
      "Соберу работающий прототип вашего продукта на вайбкодинге: лендинг, базу, авторизацию, оплату.",
    price: "от 60 000 ₽",
    bullets: [
      "Дизайн в едином стиле",
      "База данных + авторизация",
      "Деплой на ваш домен",
      "Передача исходников",
    ],
  },
  {
    title: "ИИ-фичи в существующий продукт",
    description:
      "Встраиваю ИИ-чат, генерацию контента, классификацию, голосового помощника в ваш сайт или приложение.",
    price: "от 35 000 ₽",
    bullets: [
      "Подбор модели под задачу",
      "Промпт-инжиниринг",
      "Интеграция с вашей CRM",
      "Метрики и логи",
    ],
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
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container-page py-16">
        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
            Вайбкодинг · Приложения и услуги
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Приложения, которые я собираю на вайбкодинге
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Здесь — мои продукты и услуги по быстрой разработке с ИИ. Собираю
            MVP, ИИ-фичи и внутренние инструменты для бизнеса.
          </p>
        </header>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Мои приложения</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <article
                key={app.title}
                className="flex flex-col rounded-2xl border border-border bg-surface/40 p-6 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {app.tag}
                  </span>
                  <span
                    className={
                      app.status === "live"
                        ? "rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary"
                        : "rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                    }
                  >
                    {app.status === "live" ? "В работе" : "Скоро"}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{app.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{app.description}</p>
                {app.href && (
                  <Link
                    to={app.href}
                    className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Открыть →
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Услуги вайбкодинга</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Беру в работу проекты, где важна скорость и качество исполнения.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.title}
                className="flex flex-col rounded-2xl border border-border bg-surface/40 p-6"
              >
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <div className="mt-1 text-sm text-primary">{s.price}</div>
                <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-2xl border border-border bg-surface/40 p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Нужно собрать продукт быстро?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Напишите задачу — отвечу за пару часов и предложу формат: готовое
            приложение, услуга под ключ или менторство.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Написать в WhatsApp
            </a>
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface"
            >
              Telegram
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
