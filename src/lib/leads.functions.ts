import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { notifyLeadToMax } from "@/lib/max.server";
import { leadSchema } from "@/lib/leads";

export const submitLeadFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        name: leadSchema.shape.name,
        phone: leadSchema.shape.phone,
        source: z.enum(["main", "msb", "b2b"]),
      })
      .parse(d),
  )
  .handler(async () => {
    // The old landing forms are retired; nothing is stored in Supabase any more.
    return { ok: false as const, error: "Эта форма больше не принимает заявки. Напишите нам: neyromarket.com" };
  });
