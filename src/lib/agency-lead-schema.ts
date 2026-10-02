import { z } from "zod";
export const agencyLeadSchema = z.object({
  requestId: z.string().uuid(),
  name: z.string().trim().min(2, "Укажите имя").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Укажите телефон с кодом страны")
    .max(40)
    .regex(/^[+\d\s()\-]+$/, "Проверьте номер телефона")
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    }, "Проверьте номер и код страны"),
  direction: z.enum(["creative", "automation", "leads"]),
  intent: z.enum(["consultation", "launch"]),
  company: z.string().trim().max(200).default(""),
  task: z.string().trim().max(1500).default(""),
  timeline: z.string().max(100).default(""),
  page: z.string().max(200).startsWith("/"),
  campaign: z
    .record(z.string().max(40), z.string().max(200))
    .refine((v) => Object.keys(v).length <= 5)
    .default({}),
  consent: z.literal(true),
  website: z.string().max(200).default(""),
});
export type AgencyLeadInput = z.infer<typeof agencyLeadSchema>;
