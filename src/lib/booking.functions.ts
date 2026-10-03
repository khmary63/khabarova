import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { notifyLeadToTelegram } from "@/lib/telegram.server";
import { createBookRecord, getUpcomingSlots, resolveServiceAndStaff } from "./yclients.server";

export const getSlots = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const slots = await getUpcomingSlots(6);
    return { ok: true as const, slots };
  } catch (e) {
    console.error("[getSlots] error", e);
    return { ok: false as const, error: e instanceof Error ? e.message : "unknown", slots: [] };
  }
});

const bookSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(50),
  datetime: z.string().min(10),
  comment: z.string().max(500).optional(),
  source: z.enum(["ai_chat", "widget", "form"]).default("ai_chat"),
  aiSummary: z.string().max(2000).optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bookSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const { service, staff } = await resolveServiceAndStaff();
      const rec = await createBookRecord({
        phone: data.phone,
        fullname: data.name,
        comment: data.comment,
        serviceId: service.id,
        staffId: staff.id,
        datetime: data.datetime,
      });
      await supabaseAdmin.from("bookings").insert({
        name: data.name,
        phone: data.phone,
        datetime: data.datetime,
        yclients_record_id: rec.id,
        status: "confirmed",
        source: data.source,
        ai_summary: data.aiSummary ?? null,
      });
      await notifyLeadToTelegram({
        name: data.name,
        phone: data.phone,
        source: data.source,
        extra: `Запись: ${data.datetime}${data.comment ? `\nКомментарий: ${data.comment}` : ""}${data.aiSummary ? `\nИИ: ${data.aiSummary}` : ""}`,
      });
      return { ok: true as const, recordId: rec.id, service: service.title, datetime: data.datetime };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[createBooking] error", msg);
      // Fallback: всё равно сохраняем в leads, Мария свяжется вручную
      await supabaseAdmin.from("bookings").insert({
        name: data.name,
        phone: data.phone,
        datetime: data.datetime,
        status: "failed",
        source: data.source,
        ai_summary: data.aiSummary ?? null,
        error_message: msg.slice(0, 1000),
      });
      await notifyLeadToTelegram({
        name: data.name,
        phone: data.phone,
        source: data.source,
        extra: `⚠️ YClients не сработал: ${msg.slice(0, 500)}`,
      });
      return { ok: false as const, error: msg, datetime: data.datetime };
    }
  });
