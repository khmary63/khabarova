import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
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

export async function submitLead(input: LeadInput, source: Variant) {
  const parsed = leadSchema.parse(input);
  const { error } = await supabase.from("leads").insert({
    name: parsed.name,
    phone: parsed.phone,
    source,
  });
  if (error) throw new Error(error.message);
}
