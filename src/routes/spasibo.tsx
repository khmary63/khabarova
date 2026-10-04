import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageCircle, Phone, Send } from "lucide-react";
import { AgencyHeader } from "@/components/agency/AgencyHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { trackAgency } from "@/lib/agency-tracking";
import { openEurekaChat } from "@/lib/eureka";
import { SITE } from "@/lib/site";
import { useSiteSettings } from "@/lib/use-site-settings";

export const Route = createFileRoute("/spasibo")({
  head: () => ({
    meta: [
      { title: "Заявка получена | НейроМаркет" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Thanks,
});

function Thanks() {
  const { apps } = useSiteSettings();
  const [magnet, setMagnet] = useState(false);
  useEffect(() => {
    setMagnet(new URLSearchParams(window.location.search).get("m") === "checklist");
    trackAgency("agency_thanks_view", {
      direction: new URLSearchParams(window.location.search).get("d") || "",
    });
  }, []);
  return (
    <div className="agency nm-redesign nm-internal nm-internal-content">
      <AgencyHeader />
      <main id="main-content" className="nm-thanks">
        <div className="agency-container">
          <div className="nm-thanks-card">
            <Check size={44} />
            <h1>Заявка получена</h1>
            <p className="agency-copy">
              Спасибо! Мария свяжется с вами, чтобы обсудить задачу и согласовать удобное время.
            </p>
            <ol className="nm-thanks-steps">
              <li>Мария свяжется с вами по указанному телефону.</li>
              <li>На бесплатной консультации (30 минут) вы определите первый шаг.</li>
            </ol>
            {magnet && (
              <a
                className="agency-button nm-primary nm-thanks-magnet"
                href="/checklist"
                onClick={() => trackAgency("agency_checklist_open", { place: "thanks" })}
              >
                Открыть чек-лист «Что отдать ИИ»
              </a>
            )}
            <p className="agency-small">Хотите ускорить? Напишите — ответим там, где вам удобнее.</p>
            <div className="nm-thanks-actions">
              <a
                className="agency-button nm-primary"
                href={SITE.telegramDm}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAgency("agency_telegram_click", { place: "thanks" })}
              >
                <Send size={18} /> Telegram Марии
              </a>
              <a
                className="agency-button agency-button-secondary"
                href={SITE.max}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAgency("agency_max_click", { place: "thanks" })}
              >
                <MessageCircle size={18} /> MAX
              </a>
              <a
                className="agency-button agency-button-secondary"
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAgency("agency_whatsapp_click", { place: "thanks" })}
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a className="agency-button agency-button-secondary" href={SITE.phoneHref}>
                <Phone size={18} /> {SITE.phone}
              </a>
            </div>
            <div className="nm-thanks-more">
              <button type="button" className="agency-text-button" onClick={openEurekaChat}>
                Задать вопрос ИИ-консультанту
              </button>
              <a className="agency-inline-link" href="/roi">
                Рассчитать окупаемость ИИ-сотрудника
              </a>
              {apps && (
                <a className="agency-inline-link" href="/apps">
                  Посмотреть портфолио
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter hideLocation />
    </div>
  );
}
