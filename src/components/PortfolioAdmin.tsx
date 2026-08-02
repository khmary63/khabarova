import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListPortfolio,
  upsertPortfolio,
  deletePortfolio,
  uploadPortfolioImage,
  type PortfolioProject,
} from "@/lib/portfolio.functions";

type EditDraft = Partial<PortfolioProject> & { id?: string; video_url?: string };

function isPortfolioVideo(url: string) {
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return true;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    return host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com";
  } catch {
    return false;
  }
}

export function PortfolioAdmin({ token }: { token: string }) {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const listFn = useServerFn(adminListPortfolio);
  const saveFn = useServerFn(upsertPortfolio);
  const delFn = useServerFn(deletePortfolio);
  const uploadFn = useServerFn(uploadPortfolioImage);

  async function refresh() {
    const res = await listFn({ data: { token } });
    if (res.ok) setProjects(res.projects);
    else toast.error(res.error || "Не удалось загрузить");
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function uploadImage(file: File): Promise<string | null> {
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
      data: {
        token,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        base64,
      },
    });
    if (!res.ok) {
      toast.error(res.error || "Не удалось загрузить файл");
      return null;
    }
    return res.url;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title?.trim()) {
      toast.error("Укажите название проекта");
      return;
    }
    const images = (editing.images || []).filter(Boolean);
    const videoUrl = editing.video_url?.trim() || "";
    if (images.length === 0 && !videoUrl) {
      toast.error("Добавьте хотя бы одно фото или ссылку на видео");
      return;
    }
    const media = videoUrl ? [videoUrl, ...images] : images;
    setLoading(true);
    const res = await saveFn({
      data: {
        token,
        id: editing.id,
        title: editing.title,
        description: editing.description || "",
        url: editing.url || "",
        tag: editing.tag || "",
        image_url: images[0] || videoUrl,
        images: media,
        layout: editing.layout === "mobile" ? "mobile" : "web",
        sort_order: Number(editing.sort_order) || 0,
        published: editing.published ?? true,
      },
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка сохранения");
      return;
    }
    toast.success("Сохранено");
    setEditing(null);
    void refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить проект из портфолио?")) return;
    const res = await delFn({ data: { token, id } });
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success("Удалено");
    void refresh();
  }

  function moveImage(idx: number, dir: number) {
    setEditing((prev) => {
      if (!prev) return prev;
      const arr = [...(prev.images || [])];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...prev, images: arr };
    });
  }

  function removeImage(idx: number) {
    setEditing((prev) =>
      prev ? { ...prev, images: (prev.images || []).filter((_, i) => i !== idx) } : prev,
    );
  }

  return (
    <section className="mb-8 rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold">Портфолио проектов</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Карточки с фото-галереями на странице «Магия вайбкодинга». Всего: {projects.length}.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({
              title: "",
              description: "",
              url: "",
              tag: "",
              image_url: "",
              images: [],
              video_url: "",
              layout: "web",
              sort_order: (projects.at(-1)?.sort_order ?? 0) + 10,
              published: true,
            })
          }
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
        >
          + Новый проект
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Пока нет проектов в портфолио.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              {p.images.find((url) => !isPortfolioVideo(url)) ? (
                <img
                  src={p.images.find((url) => !isPortfolioVideo(url))}
                  alt={p.title}
                  className="h-12 w-20 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded bg-neutral-900 text-[10px] font-medium text-white">
                  Видео
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      p.published ? "bg-emerald-500" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="truncate text-sm font-medium">{p.title}</span>
                  {p.tag ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {p.tag}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.layout === "mobile" ? "Мобильное" : "Веб"} ·{" "}
                  {p.images.filter((url) => !isPortfolioVideo(url)).length} фото
                  {p.images.some(isPortfolioVideo) ? " · видео" : ""}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() =>
                    setEditing({
                      ...p,
                      video_url: p.images.find(isPortfolioVideo) || "",
                      images: p.images.filter((url) => !isPortfolioVideo(url)),
                    })
                  }
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
        </ul>
      )}

      {editing ? (
        <form
          onSubmit={handleSave}
          className="mt-5 space-y-3 rounded-lg border border-border bg-background p-4"
        >
          <h3 className="font-medium">
            {editing.id ? "Редактировать проект" : "Новый проект"}
          </h3>

          <label className="block text-sm">
            <span className="mb-1 block text-xs text-muted-foreground">Название</span>
            <input
              required
              value={editing.title || ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs text-muted-foreground">Тег (например: Лендинг, Интернет-магазин)</span>
            <input
              value={editing.tag || ""}
              onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs text-muted-foreground">Формат отображения</span>
            <select
              value={editing.layout === "mobile" ? "mobile" : "web"}
              onChange={(e) =>
                setEditing({ ...editing, layout: e.target.value as "web" | "mobile" })
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="web">Веб-сайт (горизонтальные кадры)</option>
              <option value="mobile">Мобильное приложение (вертикальные кадры)</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs text-muted-foreground">Описание</span>
            <textarea
              rows={3}
              maxLength={2000}
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs text-muted-foreground">
              Ссылка на видео
            </span>
            <input
              type="url"
              placeholder="https://www.youtube.com/shorts/..."
              value={editing.video_url || ""}
              onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <span className="mt-1 block text-[11px] text-muted-foreground">
              Поддерживаются YouTube, YouTube Shorts и прямые ссылки на MP4/WebM.
            </span>
          </label>

          <div className="space-y-2">
            <span className="block text-xs text-muted-foreground">
              Фотографии (первое фото — обложка карточки). Можно загрузить несколько.
            </span>
            {(editing.images || []).length > 0 ? (
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(editing.images || []).map((src, i) => (
                  <li
                    key={src + i}
                    className="relative overflow-hidden rounded-lg border border-border bg-background"
                  >
                    <img src={src} alt={`Кадр ${i + 1}`} className="h-24 w-full object-cover" />
                    {i === 0 ? (
                      <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                        Обложка
                      </span>
                    ) : null}
                    <div className="flex items-center justify-between bg-background/90 px-1.5 py-1">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          className="rounded px-1 text-xs disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, 1)}
                          disabled={i === (editing.images || []).length - 1}
                          className="rounded px-1 text-xs disabled:opacity-30"
                        >
                          →
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="rounded px-1 text-xs text-destructive"
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <label className="cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:border-primary/40">
                {uploading ? "Загрузка…" : "Загрузить фото"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  disabled={uploading}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = "";
                    if (files.length === 0) return;
                    setUploading(true);
                    for (const f of files) {
                      const url = await uploadImage(f);
                      if (url) {
                        setEditing((prev) =>
                          prev ? { ...prev, images: [...(prev.images || []), url] } : prev,
                        );
                      }
                    }
                    setUploading(false);
                    toast.success("Готово");
                  }}
                />
              </label>
              <span className="text-xs text-muted-foreground">или добавить ссылкой:</span>
              <input
                type="url"
                placeholder="https://..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      setEditing((prev) =>
                        prev ? { ...prev, images: [...(prev.images || []), val] } : prev,
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-foreground">Порядок</span>
              <input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })
                }
                className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.published ?? true}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              />
              <span>Показывать на сайте</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Сохраняем…" : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-border px-4 py-2 text-sm"
            >
              Отмена
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
