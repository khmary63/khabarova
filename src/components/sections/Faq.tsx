import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Сколько по времени занимает разработка ИИ-продавца?",
    a: "Базовый ИИ-продавец под ключ — 2 недели от старта работ. Первые тестовые диалоги вы видите уже в конце первой недели, со второй недели подключаем интеграции с CRM и мессенджерами и запускаем в боевом режиме.",
  },
  {
    q: "Сколько стоит внедрение?",
    a: "Стоимость зависит от объёма сценариев и интеграций. Базовый ИИ-продавец стартует от стоимости одного оклада менеджера. Точную смету фиксируем после бесплатного аудита, когда понятен ваш процесс и нагрузка.",
  },
  {
    q: "Что нужно от меня для старта?",
    a: "Доступ к текущим скриптам/регламентам (если есть), примеры реальных переписок и контакт ответственного со стороны бизнеса для обратной связи. Технические интеграции (CRM, мессенджеры, IP-телефония) подключаем сами.",
  },
  {
    q: "С какими CRM и мессенджерами вы работаете?",
    a: "WhatsApp, Telegram, Instagram*, ВКонтакте, Avito, виджеты на сайте. Из CRM — Bitrix24, YCLIENTS и кастомные системы по API. Если нужной интеграции нет — подключим через webhook или собственный коннектор.",
  },
  {
    q: "А если ИИ ответит клиенту неправильно?",
    a: "Все диалоги видны в едином окне: вы и ваш менеджер можете вмешаться в любой момент. На запуске мы вместе с вами размечаем ошибки, дообучаем сценарии и закрываем пробелы — обычно качество выходит на стабильные показатели за 2–3 недели работы.",
  },
  {
    q: "Что входит в поддержку после запуска?",
    a: "Мониторинг диалогов, правки сценариев, обновление базы знаний, добавление новых сценариев и интеграций. Срок и формат поддержки зависят от выбранной продуктовой линии — фиксируем в договоре.",
  },
  {
    q: "Можно ли заказать только консультацию или аудит?",
    a: "Да. Аудит процессов перед стартом — бесплатный. Если нужна разовая консультация по архитектуре ИИ-решения или ревью существующего бота — обсудим формат и стоимость отдельно.",
  },
  {
    q: "Работаете только в Самаре или по всей России?",
    a: "Работаем удалённо по всей России и СНГ. Очные встречи возможны в Самаре, остальное — Zoom, Telemost, любые удобные каналы связи. ",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-b border-border py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary">FAQ</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Частые вопросы по срокам, стоимости и работе
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Собрали то, что чаще всего спрашивают перед стартом. Если вашего вопроса нет —
            напишите в форме ниже, ответим в течение 2 часов.
          </p>
        </div>

        <div className="mt-10 grid gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-border-strong"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-display text-base font-semibold leading-snug md:text-lg">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
