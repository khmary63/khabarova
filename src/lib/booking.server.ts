import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createBookRecord, getUpcomingSlots, resolveServiceAndStaff } from "./yclients.server";

export async function fetchUpcomingSlots() {
  try {
    const slots = await getUpcomingSlots(6);
    return { ok: true as const, slots };
  } catch (e) {
    console.error("[getSlots] error", e);
    return { ok: false as const, error: e instanceof Error ? e.message : "unknown", slots: [] };
  }
}

export async function createBookingRecord(data: {
  name: string;
  phone: string;
  datetime: string;
  comment?: string;
  source: "ai_chat" | "widget" | "form";
  aiSummary?: string;
}) {
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

    return { ok: true as const, recordId: rec.id, service: service.title, datetime: data.datetime };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[createBooking] error", msg);
    await supabaseAdmin.from("bookings").insert({
      name: data.name,
      phone: data.phone,
      datetime: data.datetime,
      status: "failed",
      source: data.source,
      ai_summary: data.aiSummary ?? null,
      error_message: msg.slice(0, 1000),
    });
    return { ok: false as const, error: msg, datetime: data.datetime };
  }
}