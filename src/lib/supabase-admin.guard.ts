import { hasSupabaseServiceRole } from "@/integrations/supabase/client.server";

export const ADMIN_NO_SERVICE_ROLE_ERROR =
  "Админка недоступна на этом сервере: нет Supabase service_role. Публичный сайт, блог и заявки работают.";

export function adminRequiresServiceRole() {
  if (!hasSupabaseServiceRole()) {
    return { ok: false as const, error: ADMIN_NO_SERVICE_ROLE_ERROR };
  }
  return null;
}
