import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type SiteSettings = { apps: boolean; blog: boolean };

const DEFAULTS: SiteSettings = { apps: true, blog: true };

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("key, enabled");
  if (error) {
    console.error("[getSiteSettings]", error);
    return DEFAULTS;
  }
  const settings: SiteSettings = { ...DEFAULTS };
  for (const row of data ?? []) {
    if (row.key === "apps" || row.key === "blog") {
      settings[row.key] = row.enabled;
    }
  }
  return settings;
});

export const updateSiteSetting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(1),
        key: z.enum(["apps", "blog"]),
        enabled: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.BLOG_ADMIN_TOKEN;
    if (!expected || data.token !== expected) {
      return { ok: false as const, error: "Неверный пароль" };
    }
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: data.key, enabled: data.enabled }, { onConflict: "key" });
    if (error) {
      console.error("[updateSiteSetting]", error);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  });
