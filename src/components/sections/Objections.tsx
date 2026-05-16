const OBJ = [
  { q: "Это дорого", a: "Считаем юнит-экономику ещё на аудите — показываем, за сколько окупится. Запуск часто стоит как часть оклада одного менеджера." },
  { q: "Это долго", a: "ИИ-продавец под ключ — 2–3 недели. Первые заявки идут с конца второй недели, в среднем окупаемость 30 дней." },
  { q: "Мы не технари", a: "Настраиваем всё сами: сценарии, интеграции, CRM. Вам не нужны программисты — только обратная связь по диалогам." },
  { q: "Уже пробовал — не взлетело", a: "Точечный бот без методологии не работает. Мы строим систему: сценарии под нишу, аналитика, корректировки." },
];

export function Objections() {
  return (
    <section className="border-b border-border py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Что обычно спрашивают</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Возражения, которые мы слышим чаще всего
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {OBJ.map((o) => (
            <div key={o.q} className="rounded-2xl border border-border bg-surface p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">«{o.q}»</div>
              <p className="mt-3 text-sm leading-relaxed">{o.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
