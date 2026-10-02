export function trackAgency(event: string, properties: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    ym?: (id: number, action: string, event: string, props: Record<string, string>) => void;
    dataLayer?: unknown[];
  };
  try {
    w.ym?.(107882480, "reachGoal", event, properties);
    w.dataLayer?.push({ event, ...properties });
  } catch {
    /* Analytics must not block a visitor. */
  }
}
export function campaignContext() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map((key) => [
      key,
      (params.get(key) || "").slice(0, 200),
    ]),
  );
}
