import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { AgencyHeader } from "@/components/agency/AgencyHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Checkbox } from "@/components/ui/checkbox";
import { trackAgency } from "@/lib/agency-tracking";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Чек-лист: что в бизнесе можно отдать ИИ | НейроМаркет" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Checklist,
});

const items: [string, string][] = [
  [
    "Одни и те же вопросы клиентов повторяются каждый день",
    "«Сколько стоит?», «Как записаться?», «Где вы находитесь?» — ИИ-сотрудник отвечает по вашей базе знаний.",
  ],
  [
    "Обращения приходят вне рабочего времени и ждут до утра",
    "Ответ сразу, сбор контактов и передача заявки команде.",
  ],
  [
    "Менеджер тратит время на первичные вопросы, чтобы понять, подходит ли клиент",
    "Предварительная квалификация обращений до разговора с человеком.",
  ],
  [
    "Записи, подтверждения и напоминания делаются вручную",
    "Автоматическая запись и напоминания в связке с вашим календарём или системой записи.",
  ],
  [
    "Коммерческие предложения, письма и документы собираются по одному шаблону вручную",
    "Генерация черновиков по вашему шаблону с проверкой человеком.",
  ],
  [
    "Заявки из сайта, мессенджеров и звонков попадают в разные места",
    "Единая точка сбора заявок — собственная система или бот.",
  ],
  [
    "Отчёты и сводки собираются вручную из нескольких источников",
    "Автоматическая сборка данных и регулярная сводка.",
  ],
  [
    "Контент для соцсетей и сайта выходит нерегулярно — не хватает времени",
    "Контент-план, черновики и очередь публикаций с вашим согласованием.",
  ],
  [
    "Сотрудники часто ищут внутренние инструкции, цены и регламенты",
    "Внутренний ИИ-помощник по вашей базе знаний.",
  ],
  [
    "Клиенты, которые не купили сразу, больше не получают сообщений",
    "Сценарии возвращения: напоминание, полезный материал, повторное предложение.",
  ],
];
const human = [
  "Переговоры по крупным сделкам",
  "Решения с юридическими или финансовыми последствиями",
  "Нестандартные и конфликтные ситуации",
  "Личный контакт с ключевыми клиентами",
];

function verdict(n: number) {
  if (n === 0) return "Отметьте пункты, которые знакомы вашему бизнесу.";
  if (n <= 2)
    return "Рутины немного. Возможно, стоит автоматизировать один процесс — обсудим, окупится ли это.";
  if (n <= 5)
    return "Есть несколько процессов, с которых имеет смысл начать. Обычно выбирают один и проверяют на нём результат.";
  return "Рутины много. Лучше не автоматизировать всё сразу, а выбрать первый процесс и измерить эффект.";
}

function Checklist() {
  const [on, setOn] = useState<boolean[]>(() => items.map(() => false));
  useEffect(() => trackAgency("agency_checklist_view"), []);
  const n = on.filter(Boolean).length;
  return (
    <div className="agency nm-redesign nm-internal nm-internal-content">
      <AgencyHeader />
      <main id="main-content" className="nm-checklist">
        <div className="agency-container">
          <p className="agency-eyebrow">Чек-лист</p>
          <h1>Что в вашем бизнесе можно отдать ИИ</h1>
          <p className="agency-copy">
            Отметьте пункты, которые знакомы вашему бизнесу. Это ориентир для разговора, а не
            расчёт: точный состав решения зависит от ваших процессов.
          </p>
          <ol className="nm-check-list">
            {items.map(([title, hint], i) => (
              <li key={title}>
                <label>
                  <Checkbox
                    checked={on[i]}
                    onCheckedChange={(v) =>
                      setOn((prev) => prev.map((x, j) => (j === i ? v === true : x)))
                    }
                  />
                  <span>
                    <b>{title}</b>
                    <small>{hint}</small>
                  </span>
                </label>
              </li>
            ))}
          </ol>
          <div className="nm-check-result" role="status" aria-live="polite">
            <strong>
              Отмечено: {n} из {items.length}
            </strong>
            <p>{verdict(n)}</p>
            <div className="nm-thanks-actions">
              <a
                className="agency-button nm-primary"
                href="/#lead"
                onClick={() => trackAgency("agency_cta_click", { place: "checklist" })}
              >
                Обсудить на бесплатной консультации
              </a>
              <a
                className="agency-button agency-button-secondary"
                href={SITE.telegramDm}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAgency("agency_telegram_click", { place: "checklist" })}
              >
                <Send size={16} /> Написать в Telegram
              </a>
            </div>
          </div>
          <div className="nm-promise">
            <div>
              <h2>Что лучше оставить человеку</h2>
              <ul>
                {human.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter hideLocation />
    </div>
  );
}
