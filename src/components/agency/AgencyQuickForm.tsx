import { useRef, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DIRECTIONS, type Direction } from "@/lib/agency";
import { goToThanks, submitAgencyLead } from "@/lib/agency-submit";
import { trackAgency } from "@/lib/agency-tracking";
import { SITE } from "@/lib/site";

const chips: { id: Direction; label: string }[] = [
  { id: "creative", label: "Раскрутить бренд" },
  { id: "automation", label: "Убрать рутину" },
  { id: "leads", label: "Нужны клиенты" },
];

/** Two-field lead form: one step from interest to a conversation. */
export function AgencyQuickForm({
  direction,
  initialDirection,
  task = "",
  timeline = "",
  magnet = false,
  id,
  title = "Бесплатный разбор за 30 минут",
  text = "Оставьте имя и телефон — Мария свяжется, чтобы обсудить вашу задачу и предложить первый шаг.",
}: {
  direction?: Direction;
  /** Preselected (not locked) direction, e.g. from the quiz. */
  initialDirection?: Direction;
  /** Quiz answers, passed to the CRM note. */
  task?: string;
  timeline?: string;
  /** Lead-magnet mode: the visitor asked for the checklist. */
  magnet?: boolean;
  id?: string;
  title?: string;
  text?: string;
}) {
  const [selected, setSelected] = useState<Direction | "">(direction ?? initialDirection ?? "");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");
  const requestId = useRef("");
  const started = useRef(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    if (!selected) {
      setError("Выберите, что вам нужно.");
      return;
    }
    const form = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    setError("");
    setState("sending");
    try {
      await submitAgencyLead({
        requestId: requestId.current,
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        direction: selected,
        consent,
        website: String(form.get("website") || ""),
        task: magnet
          ? "Запросил чек-лист «Что в бизнесе можно отдать ИИ»"
          : task
            ? `Результат диагностики: ${task}`
            : "Быстрая заявка с сайта",
        timeline,
      });
      goToThanks(selected, magnet ? "checklist" : undefined);
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Отправка не подтверждена.");
      trackAgency("agency_lead_error", { direction: selected, form: "quick" });
    }
  }

  return (
    <section id={id} className="agency-section nm-quick">
      <div className="agency-container nm-quick-grid">
        <div>
          <p className="agency-eyebrow">Без оплаты и обязательств</p>
          <h2>{title}</h2>
          <p className="agency-copy">{text}</p>
          <ul className="agency-checklist">
            <li>
              <Check />
              Разберём вашу задачу
            </li>
            <li>
              <Check />
              Назовём первый шаг и ориентир по бюджету
            </li>
          </ul>
        </div>
        <form
          className="agency-form-card nm-quick-form"
          onSubmit={submit}
          noValidate
          onFocus={() => {
            if (started.current) return;
            started.current = true;
            trackAgency("agency_form_start", { form: "quick" });
          }}
        >
          {!direction && (
            <fieldset>
              <legend>Что вам нужно?</legend>
              <div className="nm-chips" role="radiogroup">
                {chips.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={selected === c.id}
                    className={selected === c.id ? "is-on" : ""}
                    onClick={() => setSelected(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {direction && (
            <p className="nm-form-direction">{DIRECTIONS.find((d) => d.id === direction)?.label}</p>
          )}
          <div className="agency-form-row">
            <div>
              <label htmlFor={`${id ?? "q"}-name`}>Ваше имя</label>
              <input
                id={`${id ?? "q"}-name`}
                name="name"
                autoComplete="name"
                maxLength={100}
                placeholder="Как к вам обращаться"
              />
            </div>
            <div>
              <label htmlFor={`${id ?? "q"}-phone`}>Телефон</label>
              <input
                id={`${id ?? "q"}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                placeholder="+7 …"
              />
            </div>
          </div>
          <div className="agency-honeypot" aria-hidden="true">
            <label>
              Ваш сайт
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="agency-consent">
            <Checkbox
              id={`${id ?? "q"}-consent`}
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
            />
            <label htmlFor={`${id ?? "q"}-consent`}>
              Даю{" "}
              <a href="/consent" target="_blank" rel="noreferrer">
                согласие на обработку персональных данных
              </a>{" "}
              и ознакомлен(а) с{" "}
              <a href="/privacy" target="_blank" rel="noreferrer">
                политикой конфиденциальности
              </a>
              .
            </label>
          </div>
          {error && (
            <p role="alert" className="agency-error">
              {error}
            </p>
          )}
          <button className="agency-button nm-primary agency-submit" disabled={state === "sending"}>
            {state === "sending" ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Отправляем…
              </>
            ) : (
              magnet ? "Получить чек-лист" : "Получить бесплатный разбор"
            )}
          </button>
          <a
            className="nm-quick-tg"
            href={SITE.telegramDm}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackAgency("agency_telegram_click", { place: "quick_form" })}
          >
            <Send size={16} /> Или напишите в Telegram
          </a>
        </form>
      </div>
    </section>
  );
}
