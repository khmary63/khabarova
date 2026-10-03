import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSiteSettings } from "@/lib/site-settings.functions";
import { SECTOR_SLUGS } from "@/lib/roi";

const BASE_URL = "https://neyromarket.com";
const STATIC_LASTMOD = "2026-07-27";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const settings = await getSiteSettings();

        const entries: { path: string; lastmod?: string; changefreq?: string; priority?: string }[] = [
          { path: "/", lastmod: STATIC_LASTMOD, changefreq: "weekly", priority: "1.0" },
          { path: "/msb", lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.8" },
          { path: "/b2b", lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.8" },
          { path: "/contacts", lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.6" },
          { path: "/privacy", lastmod: STATIC_LASTMOD, changefreq: "yearly", priority: "0.3" },
          { path: "/roi", lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.8" },
        ];

        SECTOR_SLUGS.filter((s) => s !== "obshchiy").forEach((s) => {
          entries.push({ path: `/roi/${s}`, lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.7" });
        });
        if (settings.apps) {
          entries.push({ path: "/apps", lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.7" });
        }
        if (settings.reviews) {
          entries.push({ path: "/reviews", lastmod: STATIC_LASTMOD, changefreq: "monthly", priority: "0.7" });
        }
        if (settings.blog) {
          entries.push({ path: "/blog", lastmod: STATIC_LASTMOD, changefreq: "daily", priority: "0.9" });

          const { data: posts } = await supabaseAdmin
            .from("posts")
            .select("slug, updated_at")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(1000);

          (posts ?? []).forEach((p) => {
            entries.push({
              path: `/blog/${encodeURIComponent(p.slug)}`,
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
