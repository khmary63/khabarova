import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import TurndownService from "turndown";
import { marked } from "marked";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RichEditor } from "@/components/RichEditor";
import {
  adminListPosts,
  adminGetPost,
  upsertPost,
  adminDeletePost,
  uploadBlogImage,
  optimizeForSeo,
  republishToTelegram,
  uploadLeadMagnetFile,
  adminListLeadMagnetSubmissions,
} from "@/lib/blog.functions";

import { getSiteSettings, updateSiteSetting } from "@/lib/site-settings.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/admin")({
  head: () => ({
    meta: [
      { title: "Админка блога" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  updated_at: string;
  telegram_posted_at: string | null;
};


type EditPost = AdminPost & {
  content: string;
  contentHtml: string;
  cover_image_url: string | null;
  lead_magnet_enabled: boolean;
  lead_magnet_title: string | null;
  lead_magnet_description: string | null;
  lead_magnet_button_label: string | null;
  lead_magnet_file_path: string | null;
  lead_magnet_file_name: string | null;
};

const TOKEN_KEY = "blog-admin-token";

function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [editing, setEditing] = useState<Partial<EditPost> | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState<{ apps: boolean; blog: boolean; reviews: boolean }>({
    apps: true,
    blog: true,
    reviews: true,
  });

  const listFn = useServerFn(adminListPosts);
  const getFn = useServerFn(adminGetPost);
  const saveFn = useServerFn(upsertPost);
  const delFn = useServerFn(adminDeletePost);
  const uploadFn = useServerFn(uploadBlogImage);
  const seoFn = useServerFn(optimizeForSeo);
  const tgFn = useServerFn(republishToTelegram);
  const uploadMagnetFn = useServerFn(uploadLeadMagnetFile);
  const settingsFn = useServerFn(getSiteSettings);
  const updateSettingFn = useServerFn(updateSiteSetting);

  const [seoLoading, setSeoLoading] = useState(false);
  const [seoOptimized, setSeoOptimized] = useState(false);

  const turndown = useMemo(() => {
    const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
    td.keep(["u", "sup", "sub"]);
    return td;
  }, []);

  async function uploadImage(file: File): Promise<string> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const result = r.result as string;
        const comma = result.indexOf(",");
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
    const res = await uploadFn({
      data: { token, filename: file.name, contentType: file.type || "application/octet-stream", base64 },
    });
    if (!res.ok) {
      toast.error(res.error || "Не удалось загрузить файл");
      throw new Error(res.error || "upload failed");
    }
    return res.url;
  }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : "";
    if (saved) {
      setToken(saved);
      void tryLogin(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function tryLogin(t: string) {
    setLoading(true);
    const res = await listFn({ data: { token: t } });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error || "Не удалось войти");
      localStorage.removeItem(TOKEN_KEY);
      setAuthed(false);
      return;
    }
    localStorage.setItem(TOKEN_KEY, t);
    setAuthed(true);
    setPosts(res.posts as AdminPost[]);
    try {
      const s = await settingsFn();
      setVisibility({ apps: s.apps, blog: s.blog, reviews: s.reviews });
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleVisibility(key: "apps" | "blog" | "reviews", enabled: boolean) {
    const prev = visibility;
    setVisibility({ ...prev, [key]: enabled });
    const res = await updateSettingFn({ data: { token, key, enabled } });
    if (!res.ok) {
      setVisibility(prev);
      toast.error(res.error || "Не удалось сохранить");
      return;
    }
    toast.success(enabled ? "Страница показывается" : "Страница скрыта");
  }

  async function refresh() {
    const res = await listFn({ data: { token } });
    if (res.ok) setPosts(res.posts as AdminPost[]);
  }

  async function openEditor(id?: string) {
    setSeoOptimized(false);
    if (!id) {
      setEditing({
        title: "",
        excerpt: "",
        content: "",
        contentHtml: "",
        tags: [],
        published: false,
        lead_magnet_enabled: false,
        lead_magnet_title: "",
        lead_magnet_description: "",
        lead_magnet_button_label: "",
        lead_magnet_file_path: "",
        lead_magnet_file_name: "",
      });
      return;
    }
    const res = await getFn({ data: { token, id } });
    if (!res.ok || !res.post) {
      toast.error(res.error || "Не найдено");
      return;
    }
    const post = res.post as Omit<EditPost, "contentHtml">;
    const html = marked.parse(post.content || "", { async: false }) as string;
    setEditing({ ...post, contentHtml: html });
    setSeoOptimized(post.published); // уже опубликована — считаем оптимизированной
  }

  async function handleSeoOptimize() {
    if (!editing) return;
    const html = editing.contentHtml || "";
    const markdown = html.trim() ? turndown.turndown(html) : "";
    if (!markdown.trim()) {
      toast.error("Сначала напишите текст статьи");
      return;
    }
    if (!editing.title?.trim()) {
      toast.error("Сначала укажите заголовок");
      return;
    }
    setSeoLoading(true);
    const res = await seoFn({
      data: {
        token,
        title: editing.title || "",
        excerpt: editing.excerpt || "",
        content: markdown,
        tags: editing.tags || [],
      },
    });
    setSeoLoading(false);
    if (!res.ok) {
      toast.error(res.error || "Не удалось оптимизировать");
      return;
    }
    const newHtml = marked.parse(res.content || markdown, { async: false }) as string;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            title: res.title || prev.title,
            excerpt: res.excerpt || prev.excerpt,
            tags: res.tags && res.tags.length ? res.tags : prev.tags,
            contentHtml: newHtml,
          }
        : prev,
    );
    setSeoOptimized(true);
    toast.success("SEO + GEO оптимизация готова. Проверьте и публикуйте.");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const html = editing.contentHtml || "";
    const markdown = html.trim() ? turndown.turndown(html) : "";
    if (!markdown.trim()) {
      toast.error("Текст статьи не может быть пустым");
      return;
    }
    const magnetOn = !!editing.lead_magnet_enabled;
    if (magnetOn) {
      if (!editing.lead_magnet_title?.trim()) {
        toast.error("Заполните заголовок лид-магнита");
        return;
      }
      if (!editing.lead_magnet_file_path) {
        toast.error("Загрузите PDF-файл лид-магнита");
        return;
      }
    }
    setLoading(true);
    const res = await saveFn({
      data: {
        token,
        id: editing.id,
        slug: editing.slug || undefined,
        title: editing.title || "",
        excerpt: editing.excerpt || "",
        content: markdown,
        cover_image_url: editing.cover_image_url || "",
        tags: editing.tags || [],
        published: editing.published ?? true,
        lead_magnet_enabled: magnetOn,
        lead_magnet_title: editing.lead_magnet_title || "",
        lead_magnet_description: editing.lead_magnet_description || "",
        lead_magnet_button_label: editing.lead_magnet_button_label || "",
        lead_magnet_file_path: editing.lead_magnet_file_path || "",
        lead_magnet_file_name: editing.lead_magnet_file_name || "",
      },
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка сохранения");
      return;
    }
    toast.success("Сохранено");
    if (res.telegram?.posted) {
      toast.success("Опубликовано в Telegram → автоматически уйдёт в Дзен");
    } else if (res.telegram?.error) {
      toast.error(`Telegram: ${res.telegram.error}`);
    }
    setEditing(null);
    void refresh();
  }

  async function sendToTelegram(id: string) {
    if (!confirm("Опубликовать (или переопубликовать) статью в Telegram-канал?")) return;
    const res = await tgFn({ data: { token, id } });
    if (!res.ok) {
      toast.error(res.error || "Не удалось отправить");
      return;
    }
    toast.success("Отправлено в Telegram → подхватится Дзеном");
    void refresh();
  }


  async function handleDelete(id: string) {
    if (!confirm("Удалить статью?")) return;
    const res = await delFn({ data: { token, id } });
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success("Удалено");
    void refresh();
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="container-page flex flex-1 items-center justify-center py-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void tryLogin(token);
            }}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6"
          >
            <h1 className="font-display text-xl font-semibold">Админка блога</h1>
            <p className="mt-1 text-sm text-muted-foreground">Введите пароль для управления статьями.</p>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Пароль"
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !token}
              className="mt-3 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Проверка…" : "Войти"}
            </button>
          </form>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="container-page flex-1 py-10">
        {!editing ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold">Статьи блога</h1>
                <p className="text-sm text-muted-foreground">{posts.length} всего</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditor()}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  + Новая статья
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem(TOKEN_KEY);
                    setAuthed(false);
                    setToken("");
                  }}
                  className="rounded-full border border-border px-4 py-2 text-sm"
                >
                  Выйти
                </button>
              </div>
            </div>

            <section className="mb-8 rounded-2xl border border-border bg-surface p-5">
              <h2 className="font-display text-base font-semibold">Видимость страниц на сайте</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Снимите галочку, чтобы скрыть страницу из меню и закрыть к ней доступ.
              </p>
              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={visibility.apps}
                    onChange={(e) => toggleVisibility("apps", e.target.checked)}
                  />
                  <span>
                    Показывать страницу <span className="font-medium">«Приложения»</span> (/apps)
                  </span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={visibility.blog}
                    onChange={(e) => toggleVisibility("blog", e.target.checked)}
                  />
                  <span>
                    Показывать страницу <span className="font-medium">«Блог»</span> (/blog)
                  </span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={visibility.reviews}
                    onChange={(e) => toggleVisibility("reviews", e.target.checked)}
                  />
                  <span>
                    Показывать страницу <span className="font-medium">«Отзывы»</span> (/reviews)
                  </span>
                </label>
              </div>
            </section>

            <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {posts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          p.published ? "bg-emerald-500" : "bg-muted-foreground"
                        }`}
                      />
                      <h2 className="truncate font-medium">{p.title || "(без названия)"}</h2>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      /blog/{p.slug}
                      {p.telegram_posted_at ? (
                        <span className="ml-2 text-emerald-600">· отправлено в Telegram/Дзен</span>
                      ) : p.published ? (
                        <span className="ml-2 text-amber-600">· не отправлено в Telegram</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {p.published && (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        target="_blank"
                        className="rounded-md border border-border px-3 py-1.5 text-xs"
                      >
                        Открыть
                      </Link>
                    )}
                    {p.published && (
                      <button
                        onClick={() => sendToTelegram(p.id)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs"
                        title="Опубликовать в Telegram-канал. Дзен подхватит автоматически."
                      >
                        {p.telegram_posted_at ? "↻ В Telegram" : "→ В Telegram"}
                      </button>
                    )}
                    <button
                      onClick={() => openEditor(p.id)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded-md border border-destructive/40 px-3 py-1.5 text-xs text-destructive"
                    >
                      Удалить
                    </button>
                  </div>

                </li>
              ))}
              {posts.length === 0 && (
                <li className="p-8 text-center text-sm text-muted-foreground">
                  Статей пока нет. Нажмите «Новая статья».
                </li>
              )}
            </ul>
          </>
        ) : (
          <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-4">
            <button type="button" onClick={() => setEditing(null)} className="text-sm text-muted-foreground">
              ← Назад к списку
            </button>
            <h1 className="font-display text-2xl font-semibold">
              {editing.id ? "Редактировать статью" : "Новая статья"}
            </h1>

            <Field label="Заголовок">
              <input
                required
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Slug (URL, можно оставить пустым)">
              <input
                value={editing.slug || ""}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="auto-from-title"
                className="input"
              />
            </Field>

            <Field label="Краткое описание (для превью и SEO)">
              <textarea
                rows={2}
                maxLength={500}
                value={editing.excerpt || ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Обложка статьи">
              <div className="space-y-2">
                {editing.cover_image_url ? (
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-2">
                    <img
                      src={editing.cover_image_url}
                      alt="cover"
                      className="h-20 w-32 rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, cover_image_url: "" })}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Удалить обложку
                    </button>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:border-primary/40">
                    Загрузить файл
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (!f) return;
                        try {
                          const url = await uploadImage(f);
                          setEditing((prev) => (prev ? { ...prev, cover_image_url: url } : prev));
                          toast.success("Картинка загружена");
                        } catch {
                          /* toast handled in uploadImage */
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-muted-foreground">или вставьте ссылку:</span>
                  <input
                    type="url"
                    value={editing.cover_image_url || ""}
                    onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                    placeholder="https://…"
                    className="input flex-1 min-w-[200px]"
                  />
                </div>
              </div>
            </Field>

            <Field label="Теги (через запятую)">
              <input
                value={(editing.tags || []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="ИИ-продавцы, кейсы, YClients"
                className="input"
              />
            </Field>

            <Field label="Текст статьи">
              <RichEditor
                valueHtml={editing.contentHtml || ""}
                onChangeHtml={(html) => setEditing((prev) => (prev ? { ...prev, contentHtml: html } : prev))}
                onUploadImage={uploadImage}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Пишите обычным текстом. Используйте панель сверху для заголовков, списков, ссылок и картинок.
              </p>
            </Field>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.published ?? false}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              Опубликовать (иначе сохранится как черновик)
            </label>

            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
              <label className="flex items-start gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={!!editing.lead_magnet_enabled}
                  onChange={(e) =>
                    setEditing({ ...editing, lead_magnet_enabled: e.target.checked })
                  }
                />
                <span>
                  Опубликовать лид-магнит вместе со статьёй
                  <span className="block text-xs font-normal text-muted-foreground">
                    Внутри статьи появится форма: имя + телефон. После заполнения посетитель скачает PDF, а контакт попадёт в базу.
                  </span>
                </span>
              </label>

              {editing.lead_magnet_enabled && (
                <div className="space-y-3 border-t border-border pt-3">
                  <Field label="Заголовок формы">
                    <input
                      maxLength={300}
                      value={editing.lead_magnet_title || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, lead_magnet_title: e.target.value })
                      }
                      placeholder="Например: Бесплатный чек-лист по юнит-экономике"
                      className="input"
                    />
                  </Field>

                  <Field label="Описание (что человек получит)">
                    <textarea
                      rows={3}
                      maxLength={2000}
                      value={editing.lead_magnet_description || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, lead_magnet_description: e.target.value })
                      }
                      placeholder="Я подготовила для вас бесплатный чек-лист о том, как проверить свою юнит-экономику…"
                      className="input"
                    />
                  </Field>

                  <Field label="Подпись кнопки (необязательно)">
                    <input
                      maxLength={60}
                      value={editing.lead_magnet_button_label || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, lead_magnet_button_label: e.target.value })
                      }
                      placeholder="Скачать"
                      className="input"
                    />
                  </Field>

                  <Field label="PDF-файл лид-магнита">
                    <div className="space-y-2">
                      {editing.lead_magnet_file_path ? (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-2 text-sm">
                          <span className="truncate">
                            📎 {editing.lead_magnet_file_name || "Файл загружен"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditing({
                                ...editing,
                                lead_magnet_file_path: "",
                                lead_magnet_file_name: "",
                              })
                            }
                            className="text-xs text-muted-foreground hover:text-destructive"
                          >
                            Удалить
                          </button>
                        </div>
                      ) : null}
                      <label className="cursor-pointer inline-block rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:border-primary/40">
                        {editing.lead_magnet_file_path ? "Заменить файл" : "Загрузить PDF"}
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          hidden
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            if (!f) return;
                            const base64 = await new Promise<string>((resolve, reject) => {
                              const r = new FileReader();
                              r.onload = () => {
                                const result = r.result as string;
                                const comma = result.indexOf(",");
                                resolve(comma >= 0 ? result.slice(comma + 1) : result);
                              };
                              r.onerror = () => reject(r.error);
                              r.readAsDataURL(f);
                            });
                            const res = await uploadMagnetFn({
                              data: {
                                token,
                                filename: f.name,
                                contentType: f.type || "application/pdf",
                                base64,
                              },
                            });
                            if (!res.ok) {
                              toast.error(res.error || "Не удалось загрузить файл");
                              return;
                            }
                            setEditing((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    lead_magnet_file_path: res.path,
                                    lead_magnet_file_name: res.filename,
                                  }
                                : prev,
                            );
                            toast.success("Файл загружен");
                          }}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">
                        До 15 МБ. Ссылку получит только тот, кто оставил имя и телефон.
                      </p>
                    </div>
                  </Field>
                </div>
              )}
            </div>


            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">SEO + GEO оптимизация</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {seoOptimized
                      ? "✓ Текст оптимизирован под поисковики и ИИ-ответы (ChatGPT, Perplexity, AI Overviews)."
                      : "ИИ перепишет заголовок, описание, теги и текст: добавит TL;DR, структуру под цитирование и FAQ-секцию. Подходит и для Google/Яндекс, и для генеративных поисковиков."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSeoOptimize}
                  disabled={seoLoading}
                  className="shrink-0 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-50"
                >
                  {seoLoading ? "Оптимизация…" : seoOptimized ? "Оптимизировать ещё раз" : "SEO + GEO оптимизация"}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Сохранение…" : editing.published ? "Опубликовать" : "Сохранить черновик"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-border px-5 py-2 text-sm"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </main>
      <SiteFooter />

      <style>{`.input{width:100%;border-radius:0.5rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:0.5rem 0.75rem;font-size:0.875rem;color:hsl(var(--foreground))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
