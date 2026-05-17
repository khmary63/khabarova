import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { trackPageView, trackClick } from "@/lib/analytics.functions";

const SESSION_KEY = "nm_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function AnalyticsTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pvFn = useServerFn(trackPageView);
  const clickFn = useServerFn(trackClick);
  const lastPath = useRef<string | null>(null);

  // Page views
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip admin pages
    if (pathname.startsWith("/blog/admin") || pathname.startsWith("/analytics")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    pvFn({
      data: {
        path: pathname,
        referrer: document.referrer || null,
        session_id: getSessionId(),
        user_agent: navigator.userAgent.slice(0, 500),
      },
    }).catch(() => {});
  }, [pathname, pvFn]);

  // Global click delegation: any element with data-track="LabelName"
  useEffect(() => {
    if (typeof window === "undefined") return;
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const label = el.getAttribute("data-track");
      if (!label) return;
      const href =
        el.getAttribute("href") ||
        el.getAttribute("data-track-target") ||
        (el.tagName === "BUTTON" ? "button" : null);
      const path = window.location.pathname;
      if (path.startsWith("/blog/admin") || path.startsWith("/analytics")) return;
      clickFn({
        data: {
          path,
          label: label.slice(0, 200),
          target: href ? href.slice(0, 500) : null,
          session_id: getSessionId(),
        },
      }).catch(() => {});
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as never);
  }, [clickFn]);

  return null;
}
