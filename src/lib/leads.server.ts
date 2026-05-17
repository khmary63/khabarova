import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function insertLead(input: {
  name: string;
  phone: string;
  source: "main" | "msb" | "b2b";
}) {
  const { error } = await supabaseAdmin.from("leads").insert({
    name: input.name,
    phone: input.phone,
    source: input.source,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const };
}