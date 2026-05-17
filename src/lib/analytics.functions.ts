import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ---------- Public tracking ----------

const pageViewSchema = z.object({
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(1000).optional().nullable(),
  session_id: z.string().trim().max(100).optional().nullable(),
  user_agent: z.string().trim().max(500).optional().nullable(),
});

export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => pageViewSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("page_views").insert({
      path: data.path,
      referrer: data.referrer || null,
      session_id: data.session_id || null,
      user_agent: data.user_agent || null,
    });
    if (error) {
      console.error("[trackPageView]", error);
      return { ok: false as const };
    }
    return { ok: true as const };
  });

const clickSchema = z.object({
  path: z.string().trim().min(1).max(500),
  label: z.string().trim().min(1).max(200),
  target: z.string().trim().max(500).optional().nullable(),
  session_id: z.string().trim().max(100).optional().nullable(),
});

export const trackClick = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => clickSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("click_events").insert({
      path: data.path,
      label: data.label,
      target: data.target || null,
      session_id: data.session_id || null,
    });
    if (error) {
      console.error("[trackClick]", error);
      return { ok: false as const };
    }
    return { ok: true as const };
  });

// ---------- Admin aggregations ----------

const adminSchema = z.object({
  token: z.string().min(1),
  days: z.number().int().min(1).max(365).default(30),
});

export type AnalyticsSummary = {
  totals: { views: number; clicks: number; sessions: number };
  byDay: { day: string; views: number; clicks: number }[];
  byPage: { path: string; views: number; clicks: number; conversion: number }[];
  byClick: { path: string; label: string; clicks: number }[];
  recentClicks: { path: string; label: string; target: string | null; created_at: string }[];
};

export const getAnalytics = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => adminSchema.parse(d))
  .handler(async ({ data }): Promise<
    | { ok: true; summary: AnalyticsSummary }
    | { ok: false; error: string }
  > => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false, error: "Неверный пароль" };
    }

    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();

    const [viewsRes, clicksRes] = await Promise.all([
      supabaseAdmin
        .from("page_views")
        .select("path, session_id, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(50000),
      supabaseAdmin
        .from("click_events")
        .select("path, label, target, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(50000),
    ]);

    if (viewsRes.error) return { ok: false, error: viewsRes.error.message };
    if (clicksRes.error) return { ok: false, error: clicksRes.error.message };

    const views = viewsRes.data ?? [];
    const clicks = clicksRes.data ?? [];

    // Totals
    const sessions = new Set<string>();
    views.forEach((v) => v.session_id && sessions.add(v.session_id));

    // By day
    const dayMap = new Map<string, { views: number; clicks: number }>();
    const dayKey = (iso: string) => iso.slice(0, 10);
    for (let i = 0; i < data.days; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dayMap.set(d.toISOString().slice(0, 10), { views: 0, clicks: 0 });
    }
    views.forEach((v) => {
      const k = dayKey(v.created_at);
      const cur = dayMap.get(k) ?? { views: 0, clicks: 0 };
      cur.views++;
      dayMap.set(k, cur);
    });
    clicks.forEach((c) => {
      const k = dayKey(c.created_at);
      const cur = dayMap.get(k) ?? { views: 0, clicks: 0 };
      cur.clicks++;
      dayMap.set(k, cur);
    });
    const byDay = Array.from(dayMap.entries())
      .map(([day, v]) => ({ day, ...v }))
      .sort((a, b) => (a.day < b.day ? -1 : 1));

    // By page
    const pageMap = new Map<string, { views: number; clicks: number }>();
    views.forEach((v) => {
      const cur = pageMap.get(v.path) ?? { views: 0, clicks: 0 };
      cur.views++;
      pageMap.set(v.path, cur);
    });
    clicks.forEach((c) => {
      const cur = pageMap.get(c.path) ?? { views: 0, clicks: 0 };
      cur.clicks++;
      pageMap.set(c.path, cur);
    });
    const byPage = Array.from(pageMap.entries())
      .map(([path, v]) => ({
        path,
        views: v.views,
        clicks: v.clicks,
        conversion: v.views > 0 ? Math.round((v.clicks / v.views) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.views - a.views);

    // By click (path + label)
    const clickMap = new Map<string, { path: string; label: string; clicks: number }>();
    clicks.forEach((c) => {
      const key = `${c.path}\u0001${c.label}`;
      const cur = clickMap.get(key) ?? { path: c.path, label: c.label, clicks: 0 };
      cur.clicks++;
      clickMap.set(key, cur);
    });
    const byClick = Array.from(clickMap.values()).sort((a, b) => b.clicks - a.clicks);

    const recentClicks = clicks.slice(0, 50).map((c) => ({
      path: c.path,
      label: c.label,
      target: c.target,
      created_at: c.created_at,
    }));

    return {
      ok: true,
      summary: {
        totals: { views: views.length, clicks: clicks.length, sessions: sessions.size },
        byDay,
        byPage,
        byClick,
        recentClicks,
      },
    };
  });
