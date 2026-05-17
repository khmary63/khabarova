import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSlots = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchUpcomingSlots } = await import("./booking.server");
  return fetchUpcomingSlots();
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
    const { createBookingRecord } = await import("./booking.server");
    return createBookingRecord(data);
  });
