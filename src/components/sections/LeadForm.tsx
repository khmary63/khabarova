import { useState } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { leadSchema, submitLead } from "@/lib/leads";
import type { Variant } from "@/lib/site";

export function LeadForm({ source }: { source: Variant }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = leadSchema.safeParse({ name, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await submitLead(parsed.data, source);
      setDone(true);
      toast.success("Заявка отправлена. Мария свяжется в ближайшие 30 минут.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось отправить заявку");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="lead" className="relative overflow-hidden border-b border-border py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]"
      />
      <div className="container-page relative grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary">Бесплатный ИИ-аудит</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Получите бесплатный ИИ-аудит за 15 минут
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Выясним, где ваш бизнес теряет деньги прямо сейчас. Без обязательств и продаж — просто
            конкретные точки роста.
          </p>

          <ul className="mt-7 space-y-2 text-sm text-muted-foreground">
            <li>· Карта потерь по вашей воронке</li>
            <li>· 3 точки, которые можно автоматизировать в первый месяц</li>
            <li>· Ориентировочная стоимость и сроки запуска</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          {done ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-success/15">
                <Check className="h-5 w-5 text-success" strokeWidth={2} />
              </div>
              <h3 className="font-display text-xl font-semibold">Спасибо!</h3>
              <p className="text-sm text-muted-foreground">
                Мария свяжется с вами в ближайшие 30 минут в рабочее время.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="lead-name" className="text-xs uppercase tracking-widest text-muted-foreground">
                  Как вас зовут
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="text-xs uppercase tracking-widest text-muted-foreground">
                  Телефон или мессенджер
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  maxLength={50}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 ___ ___ __ __"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Получить ИИ-аудит
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
                  </>
                )}
              </button>
              <p className="text-[11px] text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
