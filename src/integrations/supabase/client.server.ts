// Server-side Supabase client.
// Uses service_role when available; otherwise falls back to the publishable (anon) key.
// Public reads and visitor inserts work with anon + RLS; admin writes need service_role.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let _warnedNoServiceRole = false;

function warnNoServiceRole() {
  if (_warnedNoServiceRole || process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  _warnedNoServiceRole = true;
  console.warn(
    "[Supabase] SUPABASE_SERVICE_ROLE_KEY is not set — using publishable key. Public site works; blog/portfolio admin is disabled.",
  );
}

export function hasSupabaseServiceRole() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function createSupabaseServerClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();
  const key = serviceRoleKey || publishableKey;

  if (!SUPABASE_URL || !key) {
    const missing = [
      ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
      ...(!key ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  if (!serviceRoleKey) warnNoServiceRole();

  return createClient<Database>(SUPABASE_URL, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseServer: ReturnType<typeof createSupabaseServerClient> | undefined;

/** Server-side Supabase client (service_role or anon fallback). */
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseServerClient>, {
  get(_, prop, receiver) {
    if (!_supabaseServer) _supabaseServer = createSupabaseServerClient();
    return Reflect.get(_supabaseServer, prop, receiver);
  },
});
