import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { postBlogToTelegram } from "@/lib/telegram.server";


export type PostCategory = "ai" | "marketing";

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  ai: "ИИ решения",
  marketing: "Маркетинг",
};

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  category: string;
  published_at: string | null;
};


export type PostFull = PostListItem & {
  content: string;
  updated_at: string;
  lead_magnet_enabled: boolean;
  lead_magnet_title: string | null;
  lead_magnet_description: string | null;
  lead_magnet_button_label: string | null;
  lead_magnet_file_name: string | null;
};

export const listPosts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const schema = z
      .object({
        tag: z.string().trim().max(50).optional(),
        category: z.enum(["ai", "marketing"]).optional(),
      })
      .default({});
    return schema.parse(d ?? {});
  })
  .handler(async ({ data }) => {
    let query = supabaseAdmin
      .from("posts")
      .select("id, slug, title, excerpt, cover_image_url, tags, category, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(200);
    if (data.tag) query = query.contains("tags", [data.tag]);
    if (data.category) query = query.eq("category", data.category);
    const { data: rows, error } = await query;
    if (error) {
      console.error("[listPosts]", error);
      return { posts: [] as PostListItem[], tags: [] as string[] };
    }
    const posts = (rows ?? []) as PostListItem[];
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return { posts, tags: Array.from(tagSet).sort() };
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().trim().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("id, slug, title, excerpt, content, cover_image_url, tags, category, published_at, updated_at, lead_magnet_enabled, lead_magnet_title, lead_magnet_description, lead_magnet_button_label, lead_magnet_file_name")

      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.error("[getPostBySlug]", error);
      return { post: null as PostFull | null };
    }
    return { post: (row as PostFull | null) ?? null };
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
  category: z.enum(["ai", "marketing"]).default("ai"),

  published: z.boolean().default(true),
  lead_magnet_enabled: z.boolean().default(false),
  lead_magnet_title: z.string().trim().max(300).optional().or(z.literal("")),
  lead_magnet_description: z.string().trim().max(2000).optional().or(z.literal("")),
  lead_magnet_button_label: z.string().trim().max(60).optional().or(z.literal("")),
  lead_magnet_file_path: z.string().trim().max(500).optional().or(z.literal("")),
  lead_magnet_file_name: z.string().trim().max(200).optional().or(z.literal("")),
});

export const upsertPost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    const slug = (data.slug?.trim() || slugify(data.title)) || `post-${Date.now()}`;

    // Узнаём, публиковали ли мы уже эту статью в Telegram, чтобы не дублировать.
    let alreadyPostedToTelegram = false;
    if (data.id) {
      const { data: existing } = await supabaseAdmin
        .from("posts")
        .select("telegram_posted_at")
        .eq("id", data.id)
        .maybeSingle();
      alreadyPostedToTelegram = Boolean(existing?.telegram_posted_at);
    }

    const payload = {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      tags: data.tags,
      category: data.category,

      cover_image_url: data.cover_image_url || null,
      tags: data.tags,
      published: data.published,
      published_at: data.published ? new Date().toISOString() : null,
      lead_magnet_enabled: data.lead_magnet_enabled,
      lead_magnet_title: data.lead_magnet_enabled ? (data.lead_magnet_title || null) : null,
      lead_magnet_description: data.lead_magnet_enabled ? (data.lead_magnet_description || null) : null,
      lead_magnet_button_label: data.lead_magnet_enabled ? (data.lead_magnet_button_label || null) : null,
      lead_magnet_file_path: data.lead_magnet_enabled ? (data.lead_magnet_file_path || null) : null,
      lead_magnet_file_name: data.lead_magnet_enabled ? (data.lead_magnet_file_name || null) : null,
    };
    const query = data.id
      ? supabaseAdmin.from("posts").update(payload).eq("id", data.id).select("id, slug").single()
      : supabaseAdmin.from("posts").insert(payload).select("id, slug").single();
    const { data: row, error } = await query;
    if (error) {
      console.error("[upsertPost]", error);
      return { ok: false as const, error: error.message };
    }

    // Автопостинг в Telegram-канал при первой публикации.
    // Канал затем синхронизируется с Дзеном через их официального бота
    // (https://dzen.ru/help/ru/channel/cross-platform.html).
    let telegram: { posted: boolean; error?: string } = { posted: false };
    if (data.published && !alreadyPostedToTelegram) {
      const tgRes = await postBlogToTelegram({
        title: data.title,
        excerpt: data.excerpt,
        slug: row.slug as string,
        tags: data.tags,
        coverImageUrl: data.cover_image_url || null,
      });
      if (tgRes.ok) {
        await supabaseAdmin
          .from("posts")
          .update({ telegram_posted_at: new Date().toISOString() })
          .eq("id", row.id);
        telegram = { posted: true };
      } else {
        telegram = { posted: false, error: tgRes.error };
        console.error("[upsertPost] telegram post failed", tgRes.error);
      }
    }

    return { ok: true as const, slug: row.slug as string, telegram };

  });

export const adminListPosts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль", posts: [] };
    }
    const { data: rows, error } = await supabaseAdmin
      .from("posts")
      .select("id, slug, title, excerpt, tags, published, published_at, updated_at, telegram_posted_at")
      .order("updated_at", { ascending: false })
      .limit(200);

    if (error) return { ok: false as const, error: error.message, posts: [] };
    return { ok: true as const, posts: rows ?? [] };
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
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) return { ok: false as const, error: error.message, post: null };
    return { ok: true as const, post: row };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(1), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) return { ok: false as const, error: "Неверный пароль" };
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

const uploadSchema = z.object({
  token: z.string().min(1),
  filename: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  // base64-encoded file content (without data: prefix)
  base64: z.string().min(1).max(15_000_000),
});

export const uploadBlogImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    if (!data.contentType.startsWith("image/")) {
      return { ok: false as const, error: "Можно загружать только изображения" };
    }
    // Decode base64
    let bytes: Uint8Array;
    try {
      const bin = atob(data.base64);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } catch {
      return { ok: false as const, error: "Не удалось прочитать файл" };
    }
    // Limit ~10MB after decoding
    if (bytes.byteLength > 10 * 1024 * 1024) {
      return { ok: false as const, error: "Файл больше 10 МБ" };
    }
    const ext = (data.filename.split(".").pop() || "bin").toLowerCase().slice(0, 8);
    const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "bin";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${safeExt}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upErr) {
      console.error("[uploadBlogImage]", upErr);
      return { ok: false as const, error: upErr.message };
    }
    const { data: pub } = supabaseAdmin.storage.from("blog-images").getPublicUrl(path);
    return { ok: true as const, url: pub.publicUrl };
  });

const seoSchema = z.object({
  token: z.string().min(1),
  title: z.string().trim().max(300).default(""),
  excerpt: z.string().trim().max(1000).default(""),
  content: z.string().min(1).max(100000),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
});

export const optimizeForSeo = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => seoSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "LOVABLE_API_KEY не настроен" };
    }
    const prompt = `Ты SEO + GEO редактор. Оптимизируй статью блога одновременно под классические поисковики (Google, Яндекс) И под генеративные поисковики/ИИ-ответы (ChatGPT, Perplexity, Google AI Overviews, Яндекс Нейро). Язык — русский.

Что такое GEO-оптимизация (Generative Engine Optimization):
- ИИ-ответы любят выдернуть готовый короткий абзац-определение в начале статьи (TL;DR).
- Структура «вопрос → краткий прямой ответ (1–3 предложения) → детали» хорошо цитируется.
- Конкретные факты, цифры, даты, имена, шаги — лучше расплывчатых формулировок.
- FAQ-секция в конце статьи с реальными вопросами пользователей повышает шанс попасть в AI Overviews.
- Естественный язык запросов вместо сухих ключей.

Задачи:
1. Заголовок: ёмкий, до 60 символов, с ключевым словом в начале.
2. Excerpt (meta description): 140–160 символов, с призывом и ключевыми словами.
3. Теги: 5–8 коротких в нижнем регистре на русском.
4. Перепиши текст статьи в Markdown по следующей структуре:
   - **TL;DR / Кратко** в самом начале (под заголовком, перед первым H2): жирный блок 2–4 предложения с прямым ответом на главный вопрос статьи. Это критично для GEO.
   - Основной текст: логичные H2/H3 с ключевыми фразами; короткие абзацы (2–4 предложения); маркированные/нумерованные списки; конкретные цифры и шаги; естественные вхождения ключевых слов без переспама.
   - Каждый H2/H3-подзаголовок по возможности формулируй как вопрос или ёмкое утверждение, под которым идёт прямой ответ в первом абзаце — так ИИ легче цитирует.
   - В конце короткий вывод.
   - **Обязательно** добавь в самом конце секцию \`## FAQ\` с 4–6 парами «вопрос — ответ». Формат строго:
     \`\`\`
     ### Вопрос целиком с вопросительным знаком?
     Ответ 1–3 предложения, самодостаточный, с фактами.
     \`\`\`
   - НЕ выдумывай факты, цифры, цитаты, имена — используй только то, что есть в исходнике, или формулируй обобщённо.

Исходные данные:
Заголовок: ${data.title || "(нет)"}
Excerpt: ${data.excerpt || "(нет)"}
Теги: ${data.tags.join(", ") || "(нет)"}

Текст (Markdown):
${data.content}

Верни СТРОГО валидный JSON без markdown-обёртки, по схеме:
{"title": string, "excerpt": string, "tags": string[], "content": string}`;


    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: "Ты опытный SEO-редактор. Возвращаешь только валидный JSON." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("[optimizeForSeo] gateway error", res.status, txt);
        if (res.status === 429) return { ok: false as const, error: "Слишком много запросов, попробуйте позже" };
        if (res.status === 402) return { ok: false as const, error: "Закончились кредиты Lovable AI" };
        return { ok: false as const, error: `Ошибка AI (${res.status})` };
      }
      const json = await res.json();
      const raw: string = json?.choices?.[0]?.message?.content ?? "";
      const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      let parsed: { title?: string; excerpt?: string; tags?: string[]; content?: string };
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error("[optimizeForSeo] JSON parse failed", e, cleaned.slice(0, 500));
        return { ok: false as const, error: "AI вернул неверный формат" };
      }
      return {
        ok: true as const,
        title: (parsed.title || "").toString().slice(0, 200).trim(),
        excerpt: (parsed.excerpt || "").toString().slice(0, 500).trim(),
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.filter((t) => typeof t === "string").map((t) => t.trim()).filter(Boolean).slice(0, 12)
          : [],
        content: (parsed.content || "").toString().slice(0, 100000),
      };
    } catch (e) {
      console.error("[optimizeForSeo]", e);
      return { ok: false as const, error: "Сетевая ошибка" };
    }
  });

export const republishToTelegram = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(1), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    const { data: post, error } = await supabaseAdmin
      .from("posts")
      .select("id, slug, title, excerpt, tags, cover_image_url, published")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !post) {
      return { ok: false as const, error: error?.message || "Статья не найдена" };
    }
    if (!post.published) {
      return { ok: false as const, error: "Сначала опубликуйте статью" };
    }
    const res = await postBlogToTelegram({
      title: post.title as string,
      excerpt: (post.excerpt as string) || "",
      slug: post.slug as string,
      tags: (post.tags as string[]) || [],
      coverImageUrl: (post.cover_image_url as string | null) || null,
    });
    if (!res.ok) return { ok: false as const, error: res.error };
    await supabaseAdmin
      .from("posts")
      .update({ telegram_posted_at: new Date().toISOString() })
      .eq("id", data.id);
    return { ok: true as const };
  });

// ===== Lead magnet: upload file (admin) =====
const uploadMagnetSchema = z.object({
  token: z.string().min(1),
  filename: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  base64: z.string().min(1).max(20_000_000),
});

export const uploadLeadMagnetFile = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => uploadMagnetSchema.parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    let bytes: Uint8Array;
    try {
      const bin = atob(data.base64);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } catch {
      return { ok: false as const, error: "Не удалось прочитать файл" };
    }
    if (bytes.byteLength > 15 * 1024 * 1024) {
      return { ok: false as const, error: "Файл больше 15 МБ" };
    }
    const ext = (data.filename.split(".").pop() || "bin").toLowerCase().slice(0, 8);
    const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "bin";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${safeExt}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("lead-magnets")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upErr) {
      console.error("[uploadLeadMagnetFile]", upErr);
      return { ok: false as const, error: upErr.message };
    }
    return { ok: true as const, path, filename: data.filename };
  });

// ===== Lead magnet: visitor submits form, gets signed download URL =====
const submitMagnetSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(100),
  phone: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[+\d\s()\-]+$/, "Только цифры, пробелы и + ( ) -"),
});

export const submitLeadMagnet = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitMagnetSchema.parse(d))
  .handler(async ({ data }) => {
    const { data: post, error: postErr } = await supabaseAdmin
      .from("posts")
      .select("id, slug, lead_magnet_enabled, lead_magnet_title, lead_magnet_file_path, lead_magnet_file_name, published")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (postErr || !post) {
      return { ok: false as const, error: "Статья не найдена" };
    }
    if (!post.lead_magnet_enabled || !post.lead_magnet_file_path) {
      return { ok: false as const, error: "Лид-магнит недоступен" };
    }

    const { error: insErr } = await supabaseAdmin
      .from("lead_magnet_submissions")
      .insert({
        post_id: post.id,
        post_slug: post.slug,
        magnet_title: post.lead_magnet_title,
        name: data.name,
        phone: data.phone,
      });
    if (insErr) {
      console.error("[submitLeadMagnet] insert", insErr);
      return { ok: false as const, error: "Не удалось сохранить заявку" };
    }

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("lead-magnets")
      .createSignedUrl(post.lead_magnet_file_path as string, 60 * 10, {
        download: post.lead_magnet_file_name || true,
      });
    if (signErr || !signed?.signedUrl) {
      console.error("[submitLeadMagnet] sign", signErr);
      return { ok: false as const, error: "Не удалось подготовить файл" };
    }
    return {
      ok: true as const,
      url: signed.signedUrl,
      filename: post.lead_magnet_file_name || "lead-magnet.pdf",
    };
  });

// ===== Lead magnet: admin list of submissions =====
export const adminListLeadMagnetSubmissions = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль", submissions: [] };
    }
    const { data: rows, error } = await supabaseAdmin
      .from("lead_magnet_submissions")
      .select("id, name, phone, post_slug, magnet_title, created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) return { ok: false as const, error: error.message, submissions: [] };
    return { ok: true as const, submissions: rows ?? [] };
  });
