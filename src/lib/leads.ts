import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Variant } from "./site";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя слишком короткое")
    .max(100, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .min(6, "Телефон слишком короткий")
    .max(50, "Телефон слишком длинный")
    .regex(/^[+\d\s()\-]+$/, "Только цифры, пробелы и + ( ) -"),
});

export type LeadInput = z.infer<typeof leadSchema>;

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
