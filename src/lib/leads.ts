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

export async function submitLead(_input: LeadInput, _source: Variant): Promise<void> {
  // Retired: personal data is no longer written to Supabase from the browser.
  throw new Error("Эта форма больше не принимает заявки");
}
