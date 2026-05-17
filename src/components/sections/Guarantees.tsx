import { ShieldCheck, Clock, FileBarChart, UserRound, Wrench, GraduationCap, Eye, Handshake } from "lucide-react";

const METRICS = [
  { value: "до 80%", label: "снижение нагрузки на менеджеров за счёт автоматической квалификации лидов" },
  { value: "×2–5", label: "рост скорости обработки входящих заявок по сравнению с ручным режимом" },
  { value: "0", label: "пропущенных обращений — система работает круглосуточно без выходных" },
];

const GUARANTEES = [
  { icon: ShieldCheck, title: "Качество и сроки", desc: "Выполняем работу качественно и в согласованный срок — фиксируем в договоре." },
  { icon: Wrench, title: "Современные инструменты", desc: "Используем актуальный стек ИИ-моделей и интеграций под задачи вашего бизнеса." },
  { icon: Clock, title: "Ответ в течение 2 часов", desc: "Оперативно реагируем по любому вопросу проекта — \nне дольше 2 часов в рабочее время." },
  { icon: FileBarChart, title: "Прозрачная отчётность", desc: "Реальные цифры по диалогам, заявкам и конверсии. Без приукрашиваний." },
  { icon: UserRound, title: "Личный менеджер", desc: "Единая точка коммуникации на всём проекте — без переключений между специалистами." },
  { icon: Eye, title: "Понятный язык", desc: "Объясняем работу системы без технического жаргона. Вы понимаете, за что платите." },
  { icon: GraduationCap, title: "Обучение и контроль", desc: "Передаём управление владельцу бизнеса: вы видите все диалоги и можете править сценарии." },
  { icon: Handshake, title: "Долгосрочное партнёрство", desc: "Сопровождаем после запуска — срок поддержки зависит от выбранной продуктовой линии." },
];

export function Guarantees() {
  return (
    <section className="relative overflow-hidden border-b border-border py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-20 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[140px]"
      />
      <div className="container-page relative">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary">Гарантии</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Что мы гарантируем — и что это значит на практике
          </h2>
          <p className="mt-4 text-base text-muted-foreground whitespace-pre-line">
            Системный подход вместо шаблонов: ИИ-решение, заточенное под ваш бизнес,{"\n"}
            с прозрачной отчётностью и реальными цифрами.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <div className="font-display text-4xl font-semibold tracking-tight text-primary">{m.value}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <g.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold leading-snug">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Перед стартом</div>
              <h3 className="mt-2 font-display text-lg font-semibold">Бесплатный аудит до оплаты</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Сначала разбираем ваши процессы и показываем точки роста. Платите только тогда,
                когда видите, за что и какой результат получите.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">После запуска</div>
              <h3 className="mt-2 font-display text-lg font-semibold">Поддержка и сопровождение</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Срок поддержки оговаривается в зависимости от выбранной продуктовой линии — от
                базовых правок сценариев до полного развития ИИ-отдела продаж.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
