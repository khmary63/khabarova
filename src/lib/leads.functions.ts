import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { leadSchema } from "@/lib/leads";
import type { Variant } from "@/lib/site";

const submitLeadSchema = z.object({
  input: leadSchema,
  source: z.custom<Variant>((value) => value === "main" || value === "msb" || value === "b2b"),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const { insertLead } = await import("./leads.server");
    return insertLead({
      name: data.input.name,
      phone: data.input.phone,
      source: data.source,
    });
  });