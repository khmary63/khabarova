// Server-only helper для отправки постов в Telegram-канал через connector gateway.
// Канал затем подхватывается ботом Дзена (cross-platform.html).

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const SITE_URL = "https://neyromarket.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildPostUrl(slug: string): string {
  const utm =
    "utm_source=telegram&utm_medium=social&utm_campaign=blog_autopost";
  return `${SITE_URL}/blog/${slug}?${utm}`;
}

function buildCaption(opts: {
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
}): string {
  const url = buildPostUrl(opts.slug);
  const tags = (opts.tags ?? [])
    .map((t) => "#" + t.replace(/[^\p{L}\p{N}_]/gu, "_"))
    .filter((t) => t.length > 1)
    .slice(0, 6)
    .join(" ");

  const parts = [
    `<b>${escapeHtml(opts.title)}</b>`,
    opts.excerpt ? escapeHtml(opts.excerpt) : "",
    `<a href="${url}">Читать на сайте →</a>`,
    tags,
  ].filter(Boolean);

  // Telegram caption limit — 1024 символа для sendPhoto, 4096 для sendMessage.
  return parts.join("\n\n");
}

export type TelegramPostResult =
  | { ok: true; messageId: number }
  | { ok: false; error: string };

export async function postBlogToTelegram(opts: {
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  coverImageUrl: string | null;
}): Promise<TelegramPostResult> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const tgKey = process.env.TELEGRAM_API_KEY;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!lovableKey) return { ok: false, error: "LOVABLE_API_KEY не настроен" };
  if (!tgKey) return { ok: false, error: "TELEGRAM_API_KEY не настроен" };
  if (!chatId) return { ok: false, error: "TELEGRAM_CHANNEL_ID не настроен" };

  const headers = {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": tgKey,
    "Content-Type": "application/json",
  };

  const hasPhoto = Boolean(opts.coverImageUrl);
  const fullCaption = buildCaption(opts);
  // Если есть обложка — обрезаем подпись до 1024 символов (лимит Telegram для caption).
  const caption = hasPhoto && fullCaption.length > 1024
    ? fullCaption.slice(0, 1020) + "…"
    : fullCaption;

  const endpoint = hasPhoto ? "sendPhoto" : "sendMessage";
  const body = hasPhoto
    ? {
        chat_id: chatId,
        photo: opts.coverImageUrl,
        caption,
        parse_mode: "HTML",
      }
    : {
        chat_id: chatId,
        text: fullCaption,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      };

  try {
    const res = await fetch(`${GATEWAY_URL}/${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      result?: { message_id?: number };
      description?: string;
    };
    if (!res.ok || !data.ok) {
      const err = data.description || `HTTP ${res.status}`;
      console.error("[telegram] post failed", err, data);
      return { ok: false, error: err };
    }
    return { ok: true, messageId: data.result?.message_id ?? 0 };
  } catch (e) {
    console.error("[telegram] network error", e);
    return { ok: false, error: "Сетевая ошибка при отправке в Telegram" };
  }
}
