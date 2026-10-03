import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { openEurekaChat } from "@/lib/eureka";
import { trackAgency } from "@/lib/agency-tracking";

const KEY = "nm-nudge-done";
const DELAY_MS = 25000;

/** One gentle prompt per session: a question is easier than a form. */
export function AgencyNudge({ text }: { text: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let done = false;
    try {
      done = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* storage may be blocked; show once per page view instead */
    }
    if (done) return;
    const timer = window.setTimeout(() => {
      setShown(true);
      trackAgency("agency_nudge_show");
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);
  function close(open: boolean) {
    setShown(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    if (open) {
      trackAgency("agency_nudge_click");
      openEurekaChat();
    }
  }
  if (!shown) return null;
  return (
    <div className="nm-nudge" role="dialog" aria-label="Подсказка консультанта">
      <button className="nm-nudge-close" aria-label="Закрыть" onClick={() => close(false)}>
        <X size={16} />
      </button>
      <p>{text}</p>
      <button className="nm-nudge-ask" onClick={() => close(true)}>
        <MessageCircle size={16} /> Спросить ИИ-консультанта
      </button>
    </div>
  );
}
