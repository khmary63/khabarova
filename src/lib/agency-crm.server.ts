import { directionById } from "./agency";
import type { AgencyLeadInput } from "./agency-lead-schema";
// Fixed destination: never accept a webhook URL or token from public input.
const CRM_ENDPOINT = "https://crm.neyromarket.com/api/webhook/leads";
const completed = new Map<string, { time: number; promise: Promise<void> }>();
const contactAttempts = new Map<string, number>();
export function toCrmPayload(data: AgencyLeadInput) {
  const d = directionById(data.direction);
  return {
    title: `${data.intent === "launch" ? "Запуск проекта" : "Консультация 30 минут"} · ${d.label}`,
    contactName: data.name,
    phone: data.phone,
    source: "neyromarket.com",
    // The CRM uses amount in financial reports: an enquiry is not an agreed sale.
    amount: 0,
    tags: ["Сайт", d.label, data.intent === "launch" ? "Обсудить запуск" : "Консультация"],
    note: [
      `ID заявки: ${data.requestId}`,
      `Направление: ${d.label}`,
      data.company && `Бизнес: ${data.company}`,
      data.task && `Задача: ${data.task}`,
      data.timeline && `Срок: ${data.timeline}`,
      `Страница: ${data.page}`,
      ...Object.entries(data.campaign)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`),
      `Согласие на обработку данных: получено ${new Date().toISOString()}; политика /privacy`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
export async function deliverAgencyLead(data: AgencyLeadInput) {
  if (data.website) throw new Error("invalid_request");
  const token = process.env.CRM_WEBHOOK_TOKEN;
  if (!token) throw new Error("crm_not_configured");
  const now = Date.now();
  for (const [key, entry] of completed) if (now - entry.time > 3600000) completed.delete(key);
  for (const [key, time] of contactAttempts) if (now - time > 60000) contactAttempts.delete(key);
  const previous = completed.get(data.requestId);
  if (previous) return previous.promise;
  const contact = data.phone.replace(/\D/g, "");
  if (contactAttempts.has(contact) || completed.size >= 1000) throw new Error("try_later");
  contactAttempts.set(contact, now);
  const promise = (async () => {
    const response = await fetch(CRM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(toCrmPayload(data)),
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || body?.ok !== true) throw new Error("crm_delivery_failed");
  })();
  completed.set(data.requestId, { time: now, promise });
  try {
    await promise;
  } catch (error) {
    completed.delete(data.requestId);
    throw error;
  }
}
