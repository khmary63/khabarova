import { openEurekaChat } from "@/lib/eureka";
import {
  calculateRoi,
  formatNumber,
  formatRub,
  getSector,
  type RoiInput,
} from "@/lib/roi";
import { Sparkles, TrendingUp, Wallet, Timer, Users } from "lucide-react";

export function RoiResult({ input }: { input: RoiInput }) {
  const sector = getSector(input.sector);
  const r = calculateRoi(input);

  const stats = [
    {
      icon: Wallet,
      label: "Экономия ФОТ в месяц",
      value: formatRub(r.monthlySavings),
      hint: `${formatRub(r.yearlySavings)} в год`,
    },
    {
      icon: TrendingUp,
      label: "Доп. заявок в месяц",
      value: `+${formatNumber(r.extraLeads)}`,
      hint: `рост конверсии до ×${r.convMultiplier}`,
    },
    {
      icon: Timer,
      label: "Срок окупаемости",
      value: `${r.paybackDays} дн.`,
      hint: "при базовом внедрении",
    },
    {
      icon: Users,
      label: "Работает",
      value: "24/7",
      hint: "без выходных и отпусков",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
        <div className="text-xs uppercase tracking-widest text-primary">
          Результат расчёта · {sector.label}
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          ИИ-сотрудник {sector.forLabel} окупается за {r.paybackDays} дней
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Расчёт для {formatNumber(input.staff)} сотр. в продажах, оклад{" "}
          {formatRub(input.salary)}, {formatNumber(input.leads)} заявок/мес,{" "}
          {input.routine}% рутины под ИИ.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-background p-5"
            >
              <s.icon className="h-5 w-5 text-primary" strokeWidth={2} />
              <div className="mt-3 text-2xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 md:p-8">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          Хотите точный расчёт под ваш бизнес?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Это предварительная оценка. На бесплатном ИИ-аудите за 15 минут мы
          посчитаем окупаемость по вашим реальным цифрам и покажем, как ИИ-сотрудник
          впишется в ваши процессы.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openEurekaChat}
            data-track="roi_result_chat"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Получить точный расчёт
          </button>
          <a
            href="/contacts"
            data-track="roi_result_contacts"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            Связаться с экспертом
          </a>
        </div>
      </div>
    </div>
  );
}
