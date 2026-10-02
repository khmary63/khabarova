import { useRef, useState } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIRECTIONS, type Direction, type Intent } from "@/lib/agency";
import { agencyLeadSchema } from "@/lib/agency-lead-schema";
import { campaignContext, trackAgency } from "@/lib/agency-tracking";
import { openEurekaChat } from "@/lib/eureka";
import { SITE } from "@/lib/site";
export function AgencyLeadForm({
  direction = "creative",
  task = "",
  timeline = "",
}: {
  direction?: Direction;
  task?: string;
  timeline?: string;
}) {
  const [selected, setSelected] = useState<Direction>(direction);
  const [intent, setIntent] = useState<Intent>("consultation");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const requestId = useRef("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    const data = {
      requestId: requestId.current,
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      task: String(form.get("task") || ""),
      timeline,
      direction: selected,
      intent,
      consent,
      page: window.location.pathname,
      campaign: campaignContext(),
      website: String(form.get("website") || ""),
    };
    const parsed = agencyLeadSchema.safeParse(data);
    if (!parsed.success) {
      setError(
        consent ? parsed.error.issues[0].message : "Подтвердите согласие на обработку данных.",
      );
      return;
    }
    setError("");
    setState("sending");
    try {
      const response = await fetch("/api/agency-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await response
        .json()
        .catch(() => ({
          ok: false,
          message: "Не удалось подтвердить отправку. Напишите нам в чат.",
        }));
      if (!response.ok || !result.ok)
        throw new Error(result.message || "Не удалось подтвердить отправку. Напишите нам в чат.");
      setState("done");
      trackAgency("agency_lead_success", { direction: selected, intent });
      if (intent === "launch") openEurekaChat();
    } catch (err) {
      setState("idle");
      setError(
        err instanceof Error ? err.message : "Отправка не подтверждена. Напишите нам в чат.",
      );
      trackAgency("agency_lead_error", { direction: selected });
    }
  }
  return (
    <section id="lead" className="agency-section agency-lead-section">
      <div className="agency-container agency-lead-grid">
        <div>
          <p className="agency-eyebrow">Начнём с вашей задачи</p>
          <h2>
            30 минут,
            <br />
            <span>чтобы найти первый шаг.</span>
          </h2>
          <p className="agency-copy">
            Расскажите о бизнесе. Обсудим, где ИИ будет полезен, с чего начать и какой бюджет
            потребуется.
          </p>
          <ul className="agency-checklist">
            <li>
              <Check />
              Без оплаты и обязательств
            </li>
            <li>
              <Check />
              Разбор конкретной задачи
            </li>
            <li>
              <Check />
              Личный контакт с Марией
            </li>
          </ul>
          <button
            type="button"
            className="agency-text-button"
            onClick={openEurekaChat}
            data-track="agency_consultant"
          >
            <MessageCircle size={18} />
            Сначала задать вопрос ИИ
          </button>
          <p className="agency-small">
            Или позвоните: <a href={SITE.phoneHref}>{SITE.phone}</a>
          </p>
        </div>
        <div className="agency-form-card">
          {state === "done" ? (
            <div role="status" className="agency-success">
              <Check size={40} />
              <h3>Заявка получена</h3>
              <p>Мария свяжется с вами, чтобы обсудить задачу и согласовать удобное время.</p>
              <button className="agency-button" onClick={openEurekaChat}>
                Продолжить с ИИ-консультантом
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <fieldset>
                <legend>Как удобнее начать?</legend>
                <RadioGroup
                  value={intent}
                  onValueChange={(v) => setIntent(v as Intent)}
                  className="agency-intents"
                >
                  <label>
                    <RadioGroupItem value="consultation" />
                    Нужна консультация
                  </label>
                  <label>
                    <RadioGroupItem value="launch" />
                    Готов обсудить запуск
                  </label>
                </RadioGroup>
              </fieldset>
              <label htmlFor="agency-direction">Направление</label>
              <Select value={selected} onValueChange={(v) => setSelected(v as Direction)}>
                <SelectTrigger id="agency-direction" className="agency-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTIONS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="agency-form-row">
                <div>
                  <label htmlFor="agency-name">Ваше имя</label>
                  <input
                    id="agency-name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Как к вам обращаться"
                  />
                </div>
                <div>
                  <label htmlFor="agency-phone">Телефон с кодом страны</label>
                  <input
                    id="agency-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={40}
                    placeholder="+7 …"
                  />
                </div>
              </div>
              <label htmlFor="agency-company">
                Бизнес или ниша <span>— необязательно</span>
              </label>
              <input
                id="agency-company"
                name="company"
                autoComplete="organization"
                maxLength={200}
                placeholder="Например, производство мебели"
              />
              <label htmlFor="agency-task">
                Что хотите решить? <span>— необязательно</span>
              </label>
              <textarea
                id="agency-task"
                name="task"
                maxLength={1500}
                rows={3}
                defaultValue={task}
                placeholder="Опишите задачу в двух словах"
              />
              <div className="agency-honeypot" aria-hidden="true">
                <label>
                  Ваш сайт
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="agency-consent">
                <Checkbox
                  id="agency-consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                />
                <label htmlFor="agency-consent">
                  Согласен на обработку данных для ответа на заявку согласно{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">
                    политике конфиденциальности
                  </a>
                  .
                </label>
              </div>
              {error && (
                <p role="alert" className="agency-error">
                  {error}
                </p>
              )}
              <button
                className="agency-button agency-submit"
                disabled={state === "sending"}
                type="submit"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Отправляем…
                  </>
                ) : intent === "launch" ? (
                  "Обсудить запуск"
                ) : (
                  "Записаться на бесплатную консультацию"
                )}
              </button>
              <p className="agency-small">
                Отправка формы не является оплатой или бронированием времени.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
