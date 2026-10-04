import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyBlocks } from "@/components/PolicyBlocks";
import { CONSENT_BLOCKS } from "@/lib/policy-content";

const TITLE = "Согласие на обработку персональных данных — НейроМаркет";

export const Route = createFileRoute("/consent")({
  component: ConsentPage,
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content:
          "Согласие на обработку персональных данных пользователя сайта neyromarket.com (Приложение № 1 к Политике конфиденциальности).",
      },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: "https://neyromarket.com/consent" },
    ],
    links: [{ rel: "canonical", href: "https://neyromarket.com/consent" }],
  }),
});

function ConsentPage() {
  return (
    <main className="bg-background">
      <article className="container-page max-w-3xl py-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Документы</div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Согласие на обработку персональных данных
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Приложение № 1 к{" "}
          <Link to="/privacy" className="underline hover:text-primary">
            Политике в отношении обработки персональных данных
          </Link>
          . Редакция от 4 октября 2026 г.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            ← На главную
          </Link>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            Политика конфиденциальности
          </Link>
        </div>

        <div className="prose prose-invert mt-10 max-w-none text-sm leading-relaxed text-foreground/90 md:text-base [&_p]:mt-4">
          <PolicyBlocks blocks={CONSENT_BLOCKS} />
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          ИП Хабарова Мария Павловна · ИНН 631212609521 · ОГРНИП 326632700064940 · 443125, г.
          Самара, ул. Ташкентская, д. 173 · neyromarket@yandex.ru
        </p>
      </article>
    </main>
  );
}
