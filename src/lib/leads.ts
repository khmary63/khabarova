import { z } from "zod";

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
