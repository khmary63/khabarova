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
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      phone: data.phone,
      source: data.source,
    });
    if (error) {
      console.error("[submitLeadFn]", error);
      return { ok: false as const, error: error.message };
    }

    const max = await notifyLeadToMax({
      name: data.name,
      phone: data.phone,
      source: data.source,
    });
    if (!max.ok) {
      console.error("[submitLeadFn] max notify failed:", max.error);
    }

    return { ok: true as const, notified: max.ok, notifyError: max.ok ? undefined : max.error };
  });
