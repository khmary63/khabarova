import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contacts")({
  component: ContactsPage,
  head: () => ({
    meta: [
      { title: "Контакты и реквизиты — НейроМаркет, Мария Хабарова" },
      {
        name: "description",
        content:
          "Контакты, реквизиты ИП и документы проекта «НейроМаркет | ИИ для бизнеса».",
      },
      { property: "og:title", content: "Контакты — НейроМаркет" },
      {
        property: "og:description",
        content: "Контакты, реквизиты и документы проекта «НейроМаркет».",
      },
      { property: "og:url", content: "https://neyromarket.com/contacts" },
    ],
    links: [{ rel: "canonical", href: "https://neyromarket.com/contacts" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: SITE.brand,
          legalName: "ИП Хабарова Мария Павловна",
          url: "https://neyromarket.com",
          email: SITE.email,
          telephone: SITE.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: "ул. Ташкентская, 173",
            addressLocality: SITE.city,
            postalCode: "443125",
            addressCountry: "RU",
          },
          founder: { "@type": "Person", name: SITE.expert },
          sameAs: [SITE.vk, SITE.telegram],
        }),
      },
    ],
  }),
});

function ContactsPage() {
  return (
    <main className="bg-background">
      <article className="container-page max-w-3xl py-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Контакты
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Связаться с нами
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Регион оказания услуг: Россия и страны СНГ.
        </p>

        <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Документы
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/privacy" className="hover:text-primary">
                Политика конфиденциальности
              </Link>
              {" · "}
              <a
                href="/privacy-policy.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                PDF
              </a>
            </li>
            <li className="text-muted-foreground">
              Работаем по договору и NDA
            </li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Контакты и реквизиты
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
            <dt className="text-muted-foreground">Получатель</dt>
            <dd>ИП Хабарова Мария Павловна</dd>

            <dt className="text-muted-foreground">ИНН</dt>
            <dd>631212609521</dd>

            <dt className="text-muted-foreground">ОГРНИП</dt>
            <dd>326632700064940</dd>

            <dt className="text-muted-foreground">Адрес</dt>
            <dd>г. Самара, ул. Ташкентская, 173</dd>

            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a href={SITE.emailHref} className="hover:text-primary">
                {SITE.email}
              </a>
            </dd>

            <dt className="text-muted-foreground">Телефон</dt>
            <dd>
              <a href={SITE.phoneHref} className="hover:text-primary">
                {SITE.phone}
              </a>
              {" · "}
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                WhatsApp
              </a>
            </dd>

            <dt className="text-muted-foreground">Telegram</dt>
            <dd>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                Telegram-канал
              </a>
            </dd>

            <dt className="text-muted-foreground">Max</dt>
            <dd>
              <a
                href={SITE.max}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                Бизнес-канал в Max
              </a>
            </dd>
          </dl>
        </section>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            ← На главную
          </Link>
        </div>
      </article>
    </main>
  );
}
