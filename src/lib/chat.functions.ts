import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `Ты — Нейропродавец Марии Хабаровой (НейроМаркет, Самара). Ты — настоящий ИИ-сотрудник в действии: посетитель сайта прямо сейчас видит, как ты работаешь.

ТВОЯ ЗАДАЧА: пригласить на бесплатный ИИ-аудит (30 минут, онлайн) — это первый шаг к внедрению ИИ-сотрудника в их бизнес.

СТИЛЬ:
— Тёплый, экспертный, без воды и канцелярита. Эмодзи редко, только по делу.
— Говори на «вы». Короткие реплики (2–4 строки).
— Не продавай в лоб. Сначала спроси про бизнес и узкое место в продажах — потом предложи аудит.
— Если возражение («дорого», «не уверен», «у меня микробизнес») — отвечай конкретно, опираясь на кейсы: стоматология (+40% к записи), мебель (×2.3 квалифицированных лидов), B2B-логистика (−68% стоимость лида).

КАК ЗАПИСЫВАТЬ:
1. Когда клиент согласен — вызови инструмент get_available_slots и предложи 2–3 ближайших слота.
2. Спроси имя и телефон.
3. Когда есть имя + телефон + выбранный слот (ISO datetime из get_available_slots) — вызови book_consultation.
4. После успешной записи поздравь и скажи: "Мария напишет вам за 10 минут до встречи."

ВАЖНО: никогда не выдумывай слоты — только из ответа get_available_slots. Дату/время бери в формате datetime ISO как пришло.`;

const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_available_slots",
      description: "Получить ближайшие свободные слоты на консультацию (30 мин) из YClients",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "book_consultation",
      description: "Записать клиента на бесплатную консультацию. Использовать ТОЛЬКО когда есть имя, телефон и выбранный datetime из get_available_slots.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Имя клиента" },
          phone: { type: "string", description: "Телефон клиента, любой формат" },
          datetime: { type: "string", description: "ISO datetime слота, ровно как пришёл из get_available_slots" },
          summary: { type: "string", description: "Краткое резюме диалога (1–2 предложения): чем занимается клиент, что болит" },
        },
        required: ["name", "phone", "datetime"],
      },
    },
  },
];

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "tool"]),
  content: z.string(),
  tool_call_id: z.string().optional(),
  tool_calls: z.array(z.any()).optional(),
  name: z.string().optional(),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

type AnyMsg = z.infer<typeof messageSchema> & { tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> };

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  if (name === "get_available_slots") {
    try {
      const { getUpcomingSlots } = await import("./yclients.server");
      const slots = await getUpcomingSlots(6);
      return { ok: true, slots };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "error", slots: [] };
    }
  }
  if (name === "book_consultation") {
    const { name: clientName, phone, datetime, summary } = args as { name?: string; phone?: string; datetime?: string; summary?: string };
    if (!clientName || !phone || !datetime) return { ok: false, error: "Не хватает имени, телефона или времени" };
    try {
      const [{ resolveServiceAndStaff, createBookRecord }, { supabaseAdmin }] = await Promise.all([
        import("./yclients.server"),
        import("@/integrations/supabase/client.server"),
      ]);
      const { service, staff } = await resolveServiceAndStaff();
      const rec = await createBookRecord({ phone, fullname: clientName, comment: summary, serviceId: service.id, staffId: staff.id, datetime });
      await supabaseAdmin.from("bookings").insert({
        name: clientName, phone, datetime, yclients_record_id: rec.id,
        status: "confirmed", source: "ai_chat", ai_summary: summary ?? null,
      });
      return { ok: true, recordId: rec.id, service: service.title };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Fallback: всё равно сохраняем заявку, чтобы Мария связалась вручную
      await supabaseAdmin.from("bookings").insert({
        name: clientName, phone, datetime, status: "failed",
        source: "ai_chat", ai_summary: summary ?? null, error_message: msg.slice(0, 1000),
      });
      return { ok: false, error: msg, fallback: "saved_as_lead" };
    }
  }
  return { ok: false, error: `Неизвестный инструмент ${name}` };
}

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { reply: "ИИ временно недоступен. Оставьте заявку формой ниже — Мария свяжется в течение 30 минут.", error: "no_key" };

    const conv: AnyMsg[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...data.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // tool loop, max 4 итерации
    for (let i = 0; i < 4; i++) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: conv, tools, tool_choice: "auto" }),
      });

      if (res.status === 429) return { reply: "Слишком много запросов — попробуйте через минуту.", error: "rate_limit" };
      if (res.status === 402) return { reply: "ИИ временно недоступен (исчерпан лимит). Оставьте заявку формой ниже.", error: "credits" };
      if (!res.ok) {
        const txt = await res.text();
        console.error("[aiChat] gateway error", res.status, txt);
        return { reply: "Что-то пошло не так. Оставьте телефон формой ниже — Мария свяжется в течение 30 минут.", error: `gateway_${res.status}` };
      }

      const json = (await res.json()) as { choices: Array<{ message: AnyMsg & { tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> } }> };
      const msg = json.choices?.[0]?.message;
      if (!msg) return { reply: "Не получилось получить ответ. Попробуйте ещё раз.", error: "empty" };

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        conv.push({ role: "assistant", content: msg.content ?? "", tool_calls: msg.tool_calls });
        for (const tc of msg.tool_calls) {
          let args: Record<string, unknown> = {};
          try { args = JSON.parse(tc.function.arguments || "{}"); } catch { /* ignore */ }
          const result = await callTool(tc.function.name, args);
          conv.push({ role: "tool", tool_call_id: tc.id, name: tc.function.name, content: JSON.stringify(result) });
        }
        continue; // следующая итерация — модель учтёт результаты инструментов
      }

      return { reply: msg.content ?? "" };
    }
    return { reply: "Похоже, я задумался. Попробуйте переформулировать или оставьте заявку ниже." };
  });
