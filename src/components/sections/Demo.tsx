import { useEffect, useRef, useState } from "react";
import { Bot, User } from "lucide-react";

type Msg = { from: "client" | "ai"; text: string; delay: number };

const SCRIPT: Msg[] = [
  { from: "client", text: "Здравствуйте! Сколько стоит установка под ключ?", delay: 900 },
  { from: "ai", text: "Здравствуйте! Чтобы посчитать точно, уточню 2 момента — площадь и тип помещения. Подходит?", delay: 1400 },
  { from: "client", text: "Да, конечно. Квартира 65 м², новостройка", delay: 1500 },
  { from: "ai", text: "Записал. Завтра свободные слоты замерщика 10:00, 14:00 и 17:30. Какое удобнее?", delay: 1600 },
  { from: "client", text: "Давайте 14:00", delay: 1100 },
  { from: "ai", text: "Готово ✓ Записала на завтра, 14:00. За час до приезда замерщик напишет. Хорошего вечера!", delay: 1400 },
];

export function Demo({ onOpenChat }: { onOpenChat: () => void }) {
  const [visible, setVisible] = useState<number>(0);
  const [count, setCount] = useState(12480);
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  // запуск анимации при попадании во вьюпорт
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(true)),
      { threshold: 0.25 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let i = 0;
    const step = () => {
      if (cancelled) return;
      const msg = SCRIPT[i];
      if (!msg) {
        // рестарт через паузу
        setTimeout(() => { setVisible(0); i = 0; step(); }, 4000);
        return;
      }
      setTimeout(() => {
        if (cancelled) return;
        setVisible(i + 1);
        i += 1;
        step();
      }, msg.delay);
    };
    step();
    return () => { cancelled = true; };
  }, [active]);

  // счётчик-тикалка
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3) + 1), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="demo" ref={ref} className="border-b border-border py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Как это работает</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Демо ИИ-продавца —<br />в реальном времени
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Так выглядит диалог клиента с ИИ-сотрудником в WhatsApp или на сайте.
            Отвечает за 3 секунды, ведёт по сценарию, записывает в календарь и в CRM.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="num font-display text-3xl font-semibold tracking-tight text-primary">
                {count.toLocaleString("ru-RU")}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                заявок обработано ИИ-ассистентами
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="num font-display text-3xl font-semibold tracking-tight">3<span className="text-base text-muted-foreground"> сек</span></div>
              <div className="mt-1 text-[11px] text-muted-foreground">средняя скорость первого ответа</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenChat}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Попробовать вживую — справа откроется чат
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Этот же ИИ работает на сайте прямо сейчас и сам записывает в YClients.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-3 shadow-2xl shadow-primary/10 md:p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15">
                <Bot className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-medium leading-tight">ИИ-продавец · НейроМаркет</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Онлайн · отвечает за 3 секунды
                </div>
              </div>
            </div>
            <div className="hidden text-[11px] text-muted-foreground sm:block">WhatsApp Business</div>
          </div>

          <div className="mt-4 flex min-h-[380px] flex-col gap-3">
            {SCRIPT.slice(0, visible).map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.from === "client" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "ai" && (
                  <div className="grid h-6 w-6 flex-none place-items-center rounded-full bg-primary/15">
                    <Bot className="h-3 w-3 text-primary" strokeWidth={1.5} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "client"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-background"
                  }`}
                >
                  {m.text}
                </div>
                {m.from === "client" && (
                  <div className="grid h-6 w-6 flex-none place-items-center rounded-full border border-border bg-surface">
                    <User className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            ))}
            {active && visible < SCRIPT.length && (
              <div className="flex items-center gap-2 pl-8 text-xs text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                </span>
                {SCRIPT[visible]?.from === "ai" ? "ИИ печатает…" : "клиент печатает…"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
