import { createFileRoute, Link } from "@tanstack/react-router";
import { PolicyBlocks } from "@/components/PolicyBlocks";
import { POLICY_BLOCKS } from "@/lib/policy-content";

const TITLE = "Политика в отношении обработки персональных данных — НейроМаркет";
const DESCRIPTION =
  "Политика конфиденциальности сайта neyromarket.com: какие данные мы собираем, зачем, кому передаём и как вы можете отозвать согласие.";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://neyromarket.com/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://neyromarket.com/privacy" }],
  }),
});

function PrivacyPage() {
  const [title, ...rest] = POLICY_BLOCKS;
  const heading = title.k === "h1" ? title.r.map((r) => r.t).join("") : "Политика конфиденциальности";
  return (
    <main className="bg-background">
      <article className="container-page max-w-3xl py-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Документы</div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {heading}
        </h1>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            ← На главную
          </Link>
          <Link
            to="/consent"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            Согласие на обработку данных
          </Link>
          <a
            href="/privacy-policy.pdf"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary hover:text-primary"
          >
            Скачать PDF
          </a>
        </div>

        <div className="prose prose-invert mt-10 max-w-none text-sm leading-relaxed text-foreground/90 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
          <PolicyBlocks blocks={rest} />

          <h2>Приложение № 1. Согласие на обработку персональных данных</h2>
          <p>
            Текст согласия размещён на отдельной странице:{" "}
            <Link to="/consent" className="underline hover:text-primary">
              https://neyromarket.com/consent
            </Link>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
