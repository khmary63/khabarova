import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
};

export type PostFull = PostListItem & {
  content: string;
  updated_at: string;
};

export const listPosts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const schema = z.object({ tag: z.string().trim().max(50).optional() }).default({});
    return schema.parse(d ?? {});
  })
  .handler(async ({ data }) => {
    const { listPublishedPosts } = await import("./blog.server");
    return listPublishedPosts(data.tag);
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().trim().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { getPublishedPostBySlug } = await import("./blog.server");
    return getPublishedPostBySlug(data.slug);
  });

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[а-яё]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
        и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
        с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
        ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      };
      return map[ch] ?? ch;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const upsertSchema = z.object({
  token: z.string().min(1),
  id: z.string().uuid().optional(),
  slug: z.string().trim().max(200).optional(),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(500).default(""),
  content: z.string().min(1).max(100000),
  cover_image_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  published: z.boolean().default(true),
});

export const upsertPost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    const slug = (data.slug?.trim() || slugify(data.title)) || `post-${Date.now()}`;
    const payload = {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      cover_image_url: data.cover_image_url || null,
      tags: data.tags,
      published: data.published,
      published_at: data.published ? new Date().toISOString() : null,
    };
    const { savePost } = await import("./blog.server");
    return savePost(data.id, payload);
  });

export const adminListPosts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль", posts: [] };
    }
    const { listAdminPosts } = await import("./blog.server");
    return listAdminPosts();
  });

export const adminGetPost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(1), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль", post: null };
    }
    const { getAdminPost } = await import("./blog.server");
    return getAdminPost(data.id);
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(1), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) return { ok: false as const, error: "Неверный пароль" };
    const { deleteAdminPost } = await import("./blog.server");
    return deleteAdminPost(data.id);
  });
