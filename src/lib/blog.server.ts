import { supabaseAdmin } from "@/integrations/supabase/client.server";

type PostPayload = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
};

export async function listPublishedPosts(tag?: string) {
  let query = supabaseAdmin
    .from("posts")
    .select("id, slug, title, excerpt, cover_image_url, tags, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(200);

  if (tag) query = query.contains("tags", [tag]);

  const { data: rows, error } = await query;
  if (error) {
    console.error("[listPosts]", error);
    return { posts: [], tags: [] as string[] };
  }

  const posts = rows ?? [];
  const tagSet = new Set<string>();
  posts.forEach((p) => (p.tags ?? []).forEach((t: string) => tagSet.add(t)));

  return { posts, tags: Array.from(tagSet).sort() };
}

export async function getPublishedPostBySlug(slug: string) {
  const { data: row, error } = await supabaseAdmin
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_image_url, tags, published_at, updated_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[getPostBySlug]", error);
    return { post: null };
  }

  return { post: row ?? null };
}

export async function savePost(id: string | undefined, payload: PostPayload) {
  const query = id
    ? supabaseAdmin.from("posts").update(payload).eq("id", id).select("slug").single()
    : supabaseAdmin.from("posts").insert(payload).select("slug").single();

  const { data: row, error } = await query;
  if (error) {
    console.error("[upsertPost]", error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, slug: row.slug as string };
}

export async function listAdminPosts() {
  const { data: rows, error } = await supabaseAdmin
    .from("posts")
    .select("id, slug, title, excerpt, tags, published, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) return { ok: false as const, error: error.message, posts: [] };
  return { ok: true as const, posts: rows ?? [] };
}

export async function getAdminPost(id: string) {
  const { data: row, error } = await supabaseAdmin.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) return { ok: false as const, error: error.message, post: null };
  return { ok: true as const, post: row };
}

export async function deleteAdminPost(id: string) {
  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}