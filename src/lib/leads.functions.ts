import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { leadSchema } from "@/lib/leads";
import type { Variant } from "@/lib/site";

const submitLeadSchema = z.object({
  input: leadSchema,
  source: z.custom<Variant>((value) => value === "main" || value === "msb" || value === "b2b"),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.input.name,
      phone: data.input.phone,
      source: data.source,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true as const };
  });