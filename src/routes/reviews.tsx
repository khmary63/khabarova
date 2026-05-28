import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EurekaChatLauncher } from "@/components/EurekaChatLauncher";
import { SITE } from "@/lib/site";
import { Quote, Star } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { SITE_URL, breadcrumbSchema, ORG_ID } from "@/lib/seo";

const URL = `${SITE_URL}/reviews`;

export const Route = createFileRoute("/reviews")({
  loader: async () => {
    const s = await getSiteSettings();
    if (!s.reviews) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Отзывы клиентов — НейроМаркет" },
      {
        name: "description",
        content:
          "Отзывы предпринимателей и руководителей о работе с НейроМаркет: внедрение ИИ-продавцов, рост конверсии, автоматизация продаж.",
      },
      { property: "og:title", content: "Отзывы клиентов — НейроМаркет" },
      {
        property: "og:description",
        content: "Что говорят клиенты о внедрении ИИ-продавцов от Марии Хабаровой.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": ORG_ID,
          name: SITE.brand,
          url: SITE_URL,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "6",
            bestRating: "5",
            worstRating: "1",
          },
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
            itemReviewed: { "@id": ORG_ID },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: "Отзывы", path: "/reviews" },
          ]),
        ),
      },
    ],
  }),
  component: ReviewsPage,
});

type Review = {
  name: string;
  role: string;
  text: string;
  result?: string;
};

const reviews: Review[] = [
  {
    name: "Анна К.",
    role: "Владелица студии красоты",
    text:
      "Поставили ИИ-продавца на сайт и в WhatsApp — за две недели количество заявок выросло в 2 раза. Он отвечает мгновенно, даже ночью, и сам записывает клиентов.",
    result: "+112% заявок за 2 недели",
  },
  {
    name: "Дмитрий О.",
    role: "Руководитель отдела продаж, B2B SaaS",
    text:
      "Мария разобралась в нашей воронке, переписала скрипты и внедрила ИИ-ассистента, который квалифицирует лиды до встречи с менеджером. Команда наконец занимается только тёплыми клиентами.",
    result: "Время на квалификацию −70%",
  },
  {
    name: "Елена М.",
    role: "Основатель онлайн-школы",
    text:
      "Сначала боялась, что ИИ будет «деревянным». На деле клиенты пишут «спасибо за быстрый ответ» и не понимают, что общались с ботом. Конверсия в оплату выросла на 38%.",
    result: "+38% к конверсии в оплату",
  },
  {
    name: "Игорь С.",
    role: "Сеть автосервисов",
    text:
      "Внедрили ИИ-приёмщика заявок. Перестали терять звонки в нерабочее время — теперь все клиенты получают ответ и запись на удобное время автоматически.",
  },
  {
    name: "Ольга В.",
    role: "Маркетолог, агентство недвижимости",
    text:
      "Очень понравилось, что Мария не «продаёт ИИ ради ИИ», а сначала разобралась в бизнес-процессах. Получили реальный инструмент, а не игрушку.",
  },
  {
    name: "Павел Р.",
    role: "Фитнес-клуб премиум-сегмента",
    text:
      "ИИ-продавец встроен в наш сайт и Telegram. За месяц обработал больше 1 200 диалогов, до менеджеров доходят только готовые к покупке клиенты.",
    result: "1 200+ диалогов / месяц",
  },
];

function ReviewsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] -right-[10%] h-[40%] w-[30%] rounded-full bg-indigo-500/10 blur-[100px]"
      />

      <SiteHeader />

      <main className="container-page relative space-y-20 py-20 md:py-24">
        <header className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Star className="h-3 w-3 fill-current" />
            Отзывы клиентов
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Что говорят{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              клиенты
            </span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Реальные истории предпринимателей, которые внедрили ИИ-продавцов и
            автоматизировали отдел продаж
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <article
              key={r.name + r.role}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:border-primary/40"
            >
              <Quote className="h-7 w-7 text-primary/60" />
              <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">
                {r.text}
              </p>
              {r.result && (
                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {r.result}
                </div>
              )}
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="font-display text-sm font-bold text-foreground">
                  {r.name}
                </div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
            </article>
          ))}
        </section>

        <section className="group relative">
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-primary/20 opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative space-y-6 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-10 text-center md:p-14">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Хотите такой же результат?
            </h2>
            <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">
              Расскажите о своих задачах — подберём, как внедрить ИИ-продавца
              именно в ваш бизнес.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 hover:bg-[#25D366]/90 active:scale-95 sm:w-auto"
              >
                Написать в WhatsApp
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-[#229ED9] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#229ED9]/20 transition-all hover:scale-105 hover:bg-[#229ED9]/90 active:scale-95 sm:w-auto"
              >
                Написать в Telegram
              </a>
              <a
                href={SITE.max}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-2xl bg-foreground px-6 py-4 text-sm font-bold text-background shadow-lg transition-all hover:scale-105 hover:bg-foreground/90 active:scale-95 sm:w-auto"
              >
                Написать в Max
              </a>
              <a
                href="/#lead"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-foreground transition-all hover:bg-white/10 sm:w-auto"
              >
                Бесплатный ИИ-аудит
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <EurekaChatLauncher />
    </div>
  );
}
