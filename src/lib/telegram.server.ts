// Server-only Telegram helpers — публикация статей в канал (Дзен подхватывает канал)
import { socksDispatcher } from "fetch-socks";

const SITE_URL = "https://neyromarket.com";
const DEFAULT_TELEGRAM_API = "https://api.telegram.org";

function telegramApiBase(): string {
  return (process.env.TELEGRAM_API_BASE_URL?.trim() || DEFAULT_TELEGRAM_API).replace(/\/$/, "");
}

// api.telegram.org зарезан по DPI у хостера — заворачиваем только Telegram-запросы через SOCKS5.
function telegramDispatcher() {
  const proxyUrl = process.env.TELEGRAM_SOCKS_PROXY?.trim();
  if (!proxyUrl) return undefined;
  try {
    const u = new URL(proxyUrl);
    return socksDispatcher({
      type: 5,
      host: u.hostname,
      port: Number(u.port),
      userId: u.username ? decodeURIComponent(u.username) : undefined,
      password: u.password ? decodeURIComponent(u.password) : undefined,
    });
  } catch (e) {
    console.error("[telegram] invalid TELEGRAM_SOCKS_PROXY", e);
    return undefined;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type SendResult = { ok: true; messageId: number } | { ok: false; error: string };

async function sendTelegramMessage(opts: {
  botToken: string;
  chatId: string;
  text: string;
  photoUrl?: string | null;
}): Promise<SendResult> {
  const hasPhoto = Boolean(opts.photoUrl);
  const caption =
    hasPhoto && opts.text.length > 1024 ? opts.text.slice(0, 1020) + "…" : opts.text;
  const endpoint = hasPhoto ? "sendPhoto" : "sendMessage";
  const apiUrl = `${telegramApiBase()}/bot${opts.botToken}/${endpoint}`;
  const body = hasPhoto
    ? { chat_id: opts.chatId, photo: opts.photoUrl, caption, parse_mode: "HTML" }
    : {
        chat_id: opts.chatId,
        text: opts.text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      };

  const dispatcher = telegramDispatcher();

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8_000),
      ...(dispatcher ? { dispatcher } : {}),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      result?: { message_id?: number };
      description?: string;
    };
    if (!res.ok || !data.ok) {
      const err = data.description || `HTTP ${res.status}`;
      console.error("[telegram] send failed", err, data);
      return { ok: false, error: err };
    }
    return { ok: true, messageId: data.result?.message_id ?? 0 };
  } catch (e) {
    console.error("[telegram] network error", e);
    return { ok: false, error: "Сетевая ошибка при отправке в Telegram" };
  }
}

function blogConfig() {
  const token =
    process.env.TELEGRAM_BLOG_BOT_TOKEN?.trim() || process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId =
    process.env.TELEGRAM_BLOG_CHANNEL_ID?.trim() || process.env.TELEGRAM_CHANNEL_ID?.trim();
  if (!token) return { ok: false as const, error: "TELEGRAM_BLOG_BOT_TOKEN не настроен" };
  if (!chatId) return { ok: false as const, error: "TELEGRAM_BLOG_CHANNEL_ID не настроен" };
  return { ok: true as const, token, chatId };
}

function buildPostUrl(slug: string): string {
  const utm = "utm_source=telegram&utm_medium=social&utm_campaign=blog_autopost";
  return `${SITE_URL}/blog/${slug}?${utm}`;
}

function buildBlogCaption(opts: {
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

  return [
    `<b>${escapeHtml(opts.title)}</b>`,
    opts.excerpt ? escapeHtml(opts.excerpt) : "",
    `<a href="${url}">Читать на сайте →</a>`,
    tags,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export type TelegramPostResult = SendResult;

/** Публикация статьи в Telegram-канал → Дзен подхватывает канал */
export async function postBlogToTelegram(opts: {
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  coverImageUrl: string | null;
}): Promise<TelegramPostResult> {
  const cfg = blogConfig();
  if (!cfg.ok) return cfg;

  return sendTelegramMessage({
    botToken: cfg.token,
    chatId: cfg.chatId,
    text: buildBlogCaption(opts),
    photoUrl: opts.coverImageUrl,
  });
}
