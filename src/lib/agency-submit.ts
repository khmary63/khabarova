import { agencyLeadSchema } from "./agency-lead-schema";
import { campaignContext, trackAgency } from "./agency-tracking";
import type { Direction, Intent } from "./agency";

export type AgencyLeadDraft = {
  requestId: string;
  name: string;
  phone: string;
  direction: Direction;
  intent?: Intent;
  company?: string;
  task?: string;
  timeline?: string;
  consent: boolean;
  website?: string;
};

/** Validates and posts a lead; resolves only after the server confirms delivery. */
export async function submitAgencyLead(draft: AgencyLeadDraft) {
  const parsed = agencyLeadSchema.safeParse({
    company: "",
    task: "",
    timeline: "",
    website: "",
    intent: "consultation",
    ...draft,
    page: window.location.pathname,
    campaign: campaignContext(),
  });
  if (!parsed.success) {
    throw new Error(
      draft.consent ? parsed.error.issues[0].message : "Подтвердите согласие на обработку данных.",
    );
  }
  const response = await fetch("/api/agency-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
  const result = await response.json().catch(() => ({
    ok: false,
    message: "Не удалось подтвердить отправку. Напишите нам в Telegram.",
  }));
  if (!response.ok || !result.ok)
    throw new Error(result.message || "Не удалось подтвердить отправку. Напишите нам в Telegram.");
  trackAgency("agency_lead_success", {
    direction: parsed.data.direction,
    intent: parsed.data.intent,
  });
}

export function goToThanks(direction: Direction, magnet?: "checklist") {
  window.location.assign(`/spasibo?d=${direction}${magnet ? `&m=${magnet}` : ""}`);
}
