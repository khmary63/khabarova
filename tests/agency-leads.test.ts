import { afterEach, expect, test } from "bun:test";
import { agencyLeadSchema } from "../src/lib/agency-lead-schema";
import { deliverAgencyLead, toCrmPayload } from "../src/lib/agency-crm.server";
const originalFetch = globalThis.fetch;
const originalToken = process.env.CRM_WEBHOOK_TOKEN;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalToken === undefined) delete process.env.CRM_WEBHOOK_TOKEN;
  else process.env.CRM_WEBHOOK_TOKEN = originalToken;
});
function sample() {
  return agencyLeadSchema.parse({
    requestId: crypto.randomUUID(),
    name: "Тест",
    phone: "+7 900 123 45 67",
    direction: "leads",
    intent: "launch",
    company: "Тестовая компания",
    task: "Проверка",
    timeline: "В течение месяца",
    page: "/lead-generation",
    campaign: { utm_source: "test" },
    consent: true,
    website: "",
  });
}
test("consent and a real phone shape are required", () => {
  const data = sample();
  expect(agencyLeadSchema.safeParse({ ...data, consent: false }).success).toBe(false);
  expect(agencyLeadSchema.safeParse({ ...data, phone: "++++++" }).success).toBe(false);
});
test("CRM receives intent and attribution without recording an unagreed sale", () => {
  const data = sample(),
    body = toCrmPayload(data);
  expect(body.amount).toBe(0);
  expect(body.tags).toContain("Лидогенерация");
  expect(body.note).toContain("utm_source: test");
  expect(body.note).toContain("Срок: В течение месяца");
  expect(body.contactName).toBe(data.name);
});
test("missing credentials never produce a success", async () => {
  delete process.env.CRM_WEBHOOK_TOKEN;
  await expect(deliverAgencyLead(sample())).rejects.toThrow("crm_not_configured");
});
test("duplicate request shares a single upstream call", async () => {
  process.env.CRM_WEBHOOK_TOKEN = "test-only";
  let calls = 0;
  globalThis.fetch = async (input, options) => {
    calls++;
    expect(String(input)).toBe("https://crm.neyromarket.com/api/webhook/leads");
    expect((options?.headers as Record<string, string>).Authorization).toBe("Bearer test-only");
    return new Response(JSON.stringify({ ok: true, lead: { id: "test" } }), { status: 201 });
  };
  const data = sample();
  await Promise.all([deliverAgencyLead(data), deliverAgencyLead(data)]);
  expect(calls).toBe(1);
});
test("CRM rejection is surfaced instead of a false acknowledgement", async () => {
  process.env.CRM_WEBHOOK_TOKEN = "test-only";
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  await expect(deliverAgencyLead({ ...sample(), phone: "+7 900 123 45 68" })).rejects.toThrow(
    "crm_delivery_failed",
  );
});
test("first message uses the first name, the direction and never invents prices", async () => {
  const { firstMessage, whatsappLink } = await import("../src/lib/agency-first-message");
  const m = firstMessage({ name: "Анна Петрова", direction: "automation" });
  expect(m.startsWith("Здравствуйте, Анна!")).toBe(true);
  expect(m).toContain("автоматизацию");
  expect(m).not.toMatch(/₽|руб/);
  expect(firstMessage({ name: "", direction: "leads" }).startsWith("Здравствуйте!")).toBe(true);
  expect(firstMessage({ name: "Иван", direction: "creative", task: "Запросил чек-лист «Что в бизнесе можно отдать ИИ»" })).toContain("чек-лист");
  expect(firstMessage({ name: "Иван", direction: "creative", task: "Результат диагностики: Нужен сайт" })).toContain("«Нужен сайт»");
  const link = whatsappLink("8 (917) 111-40-30", "Привет");
  expect(link).toBe("https://wa.me/79171114030?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82");
  expect(whatsappLink("12", "x")).toBe("");
});
