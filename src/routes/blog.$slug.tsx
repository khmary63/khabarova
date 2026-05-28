import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EurekaChatLauncher } from "@/components/EurekaChatLauncher";
import { getPostBySlug } from "@/lib/blog.functions";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { renderMarkdown, extractFaq, wordCount } from "@/lib/markdown";
import { LeadMagnetForm } from "@/components/sections/LeadMagnetForm";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const s = await getSiteSettings();
    if (!s.blog) throw notFound();
    const { post } = await getPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return {
      post,
      html: renderMarkdown(post.content),
      faqs: extractFaq(post.content),
      words: wordCount(post.content),
    };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Статья" }] };
    const { post, faqs, words } = loaderData;
    const desc = post.excerpt || post.title;
    const url = `https://neyromarket.com/blog/${params.slug}`;
    const articleSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: desc,
      image: post.cover_image_url || undefined,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      author: {
        "@type": "Person",
        name: "Мария Хабарова",
        url: "https://neyromarket.com",
      },
      publisher: {
        "@type": "Organization",
        name: "НейроМаркет",
        url: "https://neyromarket.com",
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.tags?.join(", "),
      inLanguage: "ru-RU",
      wordCount: words || undefined,
    };
    const scripts: Array<{ type: string; children: string }> = [
      { type: "application/ld+json", children: JSON.stringify(articleSchema) },
    ];
    if (faqs.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      });
    }
    return {
      meta: [
        { title: `${post.title} — Блог НейроМаркет` },
        { name: "description", content: desc },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post.cover_image_url
          ? [{ property: "og:image", content: post.cover_image_url }]
          : []),
        ...(post.published_at
          ? [{ property: "article:published_time", content: post.published_at }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },

  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="container-page flex flex-1 items-center justify-center py-20 text-center">
        <div>
          <h1 className="font-display text-3xl font-semibold">Статья не найдена</h1>
          <p className="mt-2 text-muted-foreground">Возможно, она была удалена или ещё не опубликована.</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm"
          >
            Все статьи
          </Link>
        </div>
      </main>
      <SiteFooter />
      <EurekaChatLauncher />
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post, html } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <article className="container-page max-w-3xl py-12">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            ← Все статьи
          </Link>
          <header className="mt-6">
            {post.tags?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {post.tags.map((t: string) => (
                  <Link
                    key={t}
                    to="/blog"
                    search={{ tag: t }}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {post.title}
            </h1>
            {post.published_at && (
              <time className="mt-3 block text-sm text-muted-foreground">
                {new Date(post.published_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
          </header>
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
            />
          )}
          <div
            className="prose-blog mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {post.lead_magnet_enabled && post.lead_magnet_title && (
            <LeadMagnetForm
              slug={post.slug}
              title={post.lead_magnet_title}
              description={post.lead_magnet_description}
              buttonLabel={post.lead_magnet_button_label}
            />
          )}
        </article>
      </main>
      <SiteFooter />
      <EurekaChatLauncher />
    </div>
  );
}
