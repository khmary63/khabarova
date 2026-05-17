const STEPS = [
  {
    title: "ИИ-аудит",
    badge: "Бесплатно · 15 минут",
    desc: "Разбираем ваши процессы, находим точки потери денег и оцениваем потенциал автоматизации.",
    artifact: "Карта потерь по воронке + 3 точки роста",
  },
  {
    title: "Стратегия автоматизации",
    badge: "1–2 дня",
    desc: "Составляем план под ваш бизнес: какие каналы, какие сценарии, какие интеграции и в каком порядке.",
    artifact: "Документ-стратегия + смета",
  },
  {
    title: "Настройка под ключ",
    badge: "1–2 недели",
    desc: "Пишем сценарии, обучаем ИИ на ваших скриптах, интегрируем с CRM и мессенджерами. Тестируем в боевом режиме.",
    artifact: "Запущенный ИИ-сотрудник + аналитика в CRM",
  },
  {
    title: "Сопровождение и рост",
    badge: "от 1 месяца",
    desc: "Корректируем сценарии по обратной связи, добавляем новые каналы, масштабируем результат.",
    artifact: "Еженедельный отчёт + улучшения",
  },
];

export function Process() {
  return (
    <section id="process" className="border-b border-border py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Этапы работы</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            От бесплатного аудита<br />до работающего ИИ-сотрудника<br />за 14&nbsp;дней
          </h2>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-2xl border border-border bg-surface p-6"
            >
              <div className="num font-mono text-[11px] uppercase tracking-widest text-primary">
                Шаг 0{i + 1}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{s.title}</h3>
              <div className="mt-2 inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                {s.badge}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <div className="mt-5 border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">На выходе: </span>
                <span>{s.artifact}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
