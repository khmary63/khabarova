import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSiteSettings } from "@/lib/site-settings.functions";

const BASE_URL = "https://neyromarket.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const settings = await getSiteSettings();

        const entries: { path: string; lastmod?: string; changefreq?: string; priority?: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/msb", changefreq: "monthly", priority: "0.8" },
          { path: "/b2b", changefreq: "monthly", priority: "0.8" },
          { path: "/contacts", changefreq: "monthly", priority: "0.6" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
        ];
        if (settings.apps) {
          entries.push({ path: "/apps", changefreq: "monthly", priority: "0.7" });
        }
        if (settings.reviews) {
          entries.push({ path: "/reviews", changefreq: "monthly", priority: "0.7" });
        }
        if (settings.blog) {
          entries.push({ path: "/blog", changefreq: "daily", priority: "0.9" });

          const { data: posts } = await supabaseAdmin
            .from("posts")
            .select("slug, updated_at")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(1000);

          (posts ?? []).forEach((p) => {
            entries.push({
              path: `/blog/${p.slug}`,
              lastmod: p.updated_at,
              changefreq: "monthly",
              priority: "0.7",
            });
          });
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
