// Уведомления о заявках через MAX Bot API (platform-api2.max.ru)

import https from "node:https";

const DEFAULT_MAX_API = "https://platform-api2.max.ru";

function maxRequest(
  url: string,
  init: { method?: string; headers?: Record<string, string>; body?: string },
): Promise<{ statusCode: number; data: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: init.method || "GET",
        headers: init.headers,
        rejectUnauthorized: false,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          let data: Record<string, unknown> = {};
          try {
            data = JSON.parse(raw) as Record<string, unknown>;
          } catch {
            // ignore
          }
          resolve({ statusCode: res.statusCode || 0, data });
        });
      },
    );
    req.on("error", reject);
    if (init.body) req.write(init.body);
    req.end();
  });
}

const SOURCE_LABELS: Record<string, string> = {
  main: "Главная",
  msb: "МСБ",
  b2b: "B2B",
  form: "Форма",
  widget: "Виджет",
  ai_chat: "ИИ-чат",
  lead_magnet: "Лид-магнит",
};

type SendResult = { ok: true; messageId: number } | { ok: false; error: string };

function maxApiBase(): string {
  return (process.env.MAX_API_BASE_URL?.trim() || DEFAULT_MAX_API).replace(/\/$/, "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function leadsConfig():
  | { ok: true; token: string; userId?: string; chatId?: string }
  | { ok: false; error: string } {
  const token = process.env.MAX_BOT_TOKEN?.trim();
  const userId = process.env.MAX_LEADS_USER_ID?.trim();
  const chatId = process.env.MAX_LEADS_CHAT_ID?.trim();

  if (!token) return { ok: false, error: "MAX_BOT_TOKEN не настроен" };
  if (!userId && !chatId) {
    return {
      ok: false,
      error: "Укажите MAX_LEADS_USER_ID или MAX_LEADS_CHAT_ID",
    };
  }

  return { ok: true, token, userId, chatId };
}

function buildLeadText(opts: {
  name: string;
  phone: string;
  source: string;
  extra?: string;
}): string {
  const sourceLabel = SOURCE_LABELS[opts.source] ?? opts.source;
  const lines = [
    "<b>Новая заявка с neyromarket.com</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(opts.name)}`,
    `<b>Телефон:</b> ${escapeHtml(opts.phone)}`,
    `<b>Источник:</b> ${escapeHtml(sourceLabel)}`,
  ];
  if (opts.extra) lines.push("", escapeHtml(opts.extra));
  return lines.join("\n");
}

async function sendMaxMessage(opts: {
  token: string;
  userId?: string;
  chatId?: string;
  text: string;
}): Promise<SendResult> {
  const params = new URLSearchParams();
  if (opts.chatId) params.set("chat_id", opts.chatId);
  else if (opts.userId) params.set("user_id", opts.userId);

  const url = `${maxApiBase()}/messages?${params.toString()}`;

  try {
    const { statusCode, data } = await maxRequest(url, {
      method: "POST",
      headers: {
        Authorization: opts.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: opts.text,
        format: "html",
        notify: true,
      }),
    });

    if (statusCode < 200 || statusCode >= 300) {
      const err =
        (typeof data.message_text === "string" && data.message_text) ||
        (typeof data.code === "string" && data.code) ||
        `HTTP ${statusCode}`;
      console.error("[max/leads] send failed", err, data);
      return { ok: false, error: err };
    }

    const message = data.message as
      | { body?: { mid?: string }; message_id?: number }
      | undefined;
    const messageId =
      message?.body?.mid != null
        ? Number(message.body.mid) || 0
        : (message?.message_id ?? 0);

    return { ok: true, messageId };
  } catch (e) {
    console.error("[max/leads] network error", e);
    return { ok: false, error: "Сетевая ошибка при отправке в MAX" };
  }
}

/** Уведомление о новой заявке в MAX */
export async function notifyLeadToMax(opts: {
  name: string;
  phone: string;
  source: string;
  extra?: string;
}): Promise<SendResult> {
  const cfg = leadsConfig();
  if (!cfg.ok) {
    console.warn("[max/leads]", cfg.error);
    return cfg;
  }

  return sendMaxMessage({
    token: cfg.token,
    userId: cfg.userId,
    chatId: cfg.chatId,
    text: buildLeadText(opts),
  });
}
