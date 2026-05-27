import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  url: string;
  tag: string;
  image_url: string;
  sort_order: number;
  published: boolean;
};

export const listPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("portfolio_projects")
    .select("id, title, description, url, tag, image_url, sort_order, published")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[listPortfolio]", error);
    return { projects: [] as PortfolioProject[] };
  }
  return { projects: (data ?? []) as PortfolioProject[] };
});

export const adminListPortfolio = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль", projects: [] };
    }
    const { data: rows, error } = await supabaseAdmin
      .from("portfolio_projects")
      .select("id, title, description, url, tag, image_url, sort_order, published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return { ok: false as const, error: error.message, projects: [] };
    return { ok: true as const, projects: (rows ?? []) as PortfolioProject[] };
  });

const upsertSchema = z.object({
  token: z.string().min(1),
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  url: z.string().trim().url().max(500),
  tag: z.string().trim().max(60).default(""),
  image_url: z.string().trim().url().max(500),
  sort_order: z.number().int().min(0).max(10000).default(0),
  published: z.boolean().default(true),
});

export const upsertPortfolio = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    const payload = {
      title: data.title,
      description: data.description,
      url: data.url,
      tag: data.tag,
      image_url: data.image_url,
      sort_order: data.sort_order,
      published: data.published,
    };
    const query = data.id
      ? supabaseAdmin.from("portfolio_projects").update(payload).eq("id", data.id).select("id").single()
      : supabaseAdmin.from("portfolio_projects").insert(payload).select("id").single();
    const { error } = await query;
    if (error) {
      console.error("[upsertPortfolio]", error);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  });

export const deletePortfolio = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(1), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) return { ok: false as const, error: "Неверный пароль" };
    const { error } = await supabaseAdmin.from("portfolio_projects").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

const uploadSchema = z.object({
  token: z.string().min(1),
  filename: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  base64: z.string().min(1).max(15_000_000),
});

export const uploadPortfolioImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    if (!data.contentType.startsWith("image/")) {
      return { ok: false as const, error: "Можно загружать только изображения" };
    }
    let bytes: Uint8Array;
    try {
      const bin = atob(data.base64);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } catch {
      return { ok: false as const, error: "Не удалось прочитать файл" };
    }
    if (bytes.byteLength > 10 * 1024 * 1024) {
      return { ok: false as const, error: "Файл больше 10 МБ" };
    }
    const ext = (data.filename.split(".").pop() || "bin").toLowerCase().slice(0, 8);
    const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "bin";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${safeExt}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("portfolio-images")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upErr) {
      console.error("[uploadPortfolioImage]", upErr);
      return { ok: false as const, error: upErr.message };
    }
    const { data: pub } = supabaseAdmin.storage.from("portfolio-images").getPublicUrl(path);
    return { ok: true as const, url: pub.publicUrl };
  });
