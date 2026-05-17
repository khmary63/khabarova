import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    tag: "Точка входа",
    title: "ИИ-аудит вашего отдела продаж",
    desc: "За 30 минут разбираем процессы и находим, где теряются деньги. \nБесплатно, без обязательств.",
    bullets: ["Карта потерь по воронке", "3 точки для быстрого ROI", "Оценка стоимости запуска"],
    cta: "Получить аудит",
    href: "#lead",
    highlight: false,
  },
  {
    tag: "Флагман",
    title: "ИИ-продавец под ключ",
    desc: "ИИ-сотрудник в мессенджерах, соцсетях и на сайте. Отвечает за 3 секунды 24/7 — квалифицирует, прогревает, записывает.",
    bullets: ["Сценарии под вашу нишу", "Интеграция с CRM", "Запуск за 2–3 недели"],
    cta: "Подробнее",
    href: "#cases",
    highlight: true,
  },
  {
    tag: "Для B2B",
    title: "ИИ-отдел продаж под ключ",
    desc: "Комплексная автоматизация: квалификация, прогрев, передача горячих лидов менеджерам. Полная аналитика.",
    bullets: ["Методология НейроМаркет", "Сценарии и дашборд", "Сопровождение 3 месяца"],
    cta: "Обсудить проект",
    href: "#lead",
    highlight: false,
  },
];

export function Services() {
  return (
    <section className="border-b border-border py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Что мы делаем</div>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Три продуктовые линии — от быстрого старта до полной автоматизации
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            {/* Текст удален по запросу */}
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className={`relative flex flex-col rounded-2xl border p-7 transition ${
                s.highlight
                  ? "border-primary/40 bg-primary/5 glow-accent"
                  : "border-border bg-surface hover:border-border-strong"
              }`}
            >
              <div className="text-xs uppercase tracking-widest text-primary/80">{s.tag}</div>
              <h3 className="mt-3 font-display text-xl font-semibold leading-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <span className="mt-2 h-1 w-3 flex-none bg-primary/70" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a
                href={s.href}
                className="mt-7 inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition hover:gap-2"
              >
                {s.cta}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
