import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EurekaChatLauncher } from "@/components/EurekaChatLauncher";
import { listPosts } from "@/lib/blog.functions";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { z } from "zod";

const searchSchema = z.object({ tag: z.string().trim().max(50).optional() });

export const Route = createFileRoute("/blog/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ tag: search.tag }),
  loader: async ({ deps }) => {
    const s = await getSiteSettings();
    if (!s.blog) throw notFound();
    return listPosts({ data: { tag: deps.tag } });
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "Блог НейроМаркет — ИИ-продавцы, кейсы, автоматизация, вайбкодинг" },
      {
        name: "description",
        content:
          "Статьи и кейсы об ИИ-продавцах, нейроворонках и автоматизации продаж для бизнеса в Самаре и по России.",
      },
      { property: "og:title", content: "Блог НейроМаркет" },
      { property: "og:description", content: "ИИ-продавцы, кейсы, автоматизация продаж, вайбкодинг." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://neyromarket.com/blog" },
    ],
    links: [{ rel: "canonical", href: "https://neyromarket.com/blog" }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "Блог НейроМаркет",
              url: "https://neyromarket.com/blog",
              inLanguage: "ru-RU",
              publisher: { "@id": "https://neyromarket.com/#organization" },
              blogPost: loaderData.posts.slice(0, 20).map((p: { title: string; slug: string; excerpt: string; published_at: string | null }) => ({
                "@type": "BlogPosting",
                headline: p.title,
                description: p.excerpt,
                url: `https://neyromarket.com/blog/${p.slug}`,
                datePublished: p.published_at,
                author: { "@type": "Person", name: "Мария Хабарова" },
              })),
            }),
          },
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Главная", item: "https://neyromarket.com/" },
                { "@type": "ListItem", position: 2, name: "Блог", item: "https://neyromarket.com/blog" },
              ],
            }),
          },
        ]
      : [],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts, tags } = Route.useLoaderData();
  const { tag } = Route.useSearch();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="container-page flex-1 py-12">
        <header className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-primary">Блог</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            ИИ-продавцы, кейсы, автоматизация, вайбкодинг
          </h1>
          <p className="mt-3 whitespace-pre-line text-muted-foreground">
            Практика внедрения ИИ-продавцов, нейроворонок, онлайн-записи и прочих "фишек".{"\n"}
            Без воды — только то, что работает на конверсию.
          </p>
        </header>

        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              to="/blog"
              search={{}}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                !tag
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Все
            </Link>
            {tags.map((t: string) => (
              <Link
                key={t}
                to="/blog"
                search={{ tag: t }}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  tag === t
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center text-muted-foreground">
            Пока нет статей{tag ? ` с тегом «${tag}»` : ""}. Загляните позже.
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p: typeof posts[number]) => (
              <li key={p.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary/50"
                >
                  {p.cover_image_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-background">
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t: string) => (
                        <span
                          key={t}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display text-lg font-semibold leading-snug">{p.title}</h2>
                    {p.excerpt && (
                      <p className="line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                    )}
                    {p.published_at && (
                      <time className="mt-auto text-xs text-muted-foreground">
                        {new Date(p.published_at).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
