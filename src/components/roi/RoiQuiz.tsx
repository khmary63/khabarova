import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { SECTOR_SLUGS, SECTORS, type SectorSlug } from "@/lib/roi";

type Answers = {
  sector: SectorSlug;
  staff: number;
  salary: number;
  leads: number;
  routine: number;
};

const DEFAULT_ANSWERS: Answers = {
  sector: "obshchiy",
  staff: 3,
  salary: 60000,
  leads: 500,
  routine: 60,
};

const STAFF_OPTIONS = [1, 2, 3, 5, 10];
const SALARY_OPTIONS = [40000, 50000, 60000, 80000, 100000];
const LEADS_OPTIONS = [100, 300, 500, 1000, 2000];

export function RoiQuiz({ initialSector }: { initialSector?: SectorSlug }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    ...DEFAULT_ANSWERS,
    ...(initialSector ? { sector: initialSector, ...SECTORS[initialSector].defaults } : {}),
  });

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const steps = [
    {
      title: "В какой сфере ваш бизнес?",
      content: (
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTOR_SLUGS.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => {
                set("sector", slug);
                setAnswers((a) => ({ ...a, sector: slug, ...SECTORS[slug].defaults }));
                setStep(1);
              }}
              className={`rounded-xl border p-4 text-left text-sm transition ${
                answers.sector === slug
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              {SECTORS[slug].label}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Сколько сотрудников в продажах?",
      content: (
        <ChipInput
          value={answers.staff}
          options={STAFF_OPTIONS}
          suffix="чел."
          min={1}
          max={200}
          onChange={(v) => set("staff", v)}
        />
      ),
    },
    {
      title: "Средняя зарплата сотрудника, ₽/мес",
      content: (
        <ChipInput
          value={answers.salary}
          options={SALARY_OPTIONS}
          suffix="₽"
          min={0}
          max={1000000}
          step={5000}
          onChange={(v) => set("salary", v)}
        />
      ),
    },
    {
      title: "Сколько заявок/обращений в месяц?",
      content: (
        <ChipInput
          value={answers.leads}
          options={LEADS_OPTIONS}
          suffix="шт."
          min={0}
          max={1000000}
          step={50}
          onChange={(v) => set("leads", v)}
        />
      ),
    },
    {
      title: "Какую долю рутины можно отдать ИИ?",
      content: (
        <div>
          <div className="text-center text-3xl font-semibold tracking-tight text-primary">
            {answers.routine}%
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={answers.routine}
            onChange={(e) => set("routine", Number(e.target.value))}
            className="mt-4 w-full accent-[var(--primary)]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>10%</span>
            <span>90%</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Это переписка, ответы на типовые вопросы, квалификация и запись —
            всё, что ИИ берёт на себя.
          </p>
        </div>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const finish = () => {
    navigate({
      to: "/roi/result",
      search: {
        sector: answers.sector,
        staff: answers.staff,
        salary: answers.salary,
        leads: answers.leads,
        routine: answers.routine,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Calculator className="h-4 w-4 text-primary" strokeWidth={2} />
        Калькулятор ROI · шаг {step + 1} из {steps.length}
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="mt-6 font-display text-xl font-semibold tracking-tight md:text-2xl">
        {steps[step].title}
      </h2>
      <div className="mt-5">{steps[step].content}</div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Назад
        </button>

        {step > 0 && (
          <button
            type="button"
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            {isLast ? "Показать результат" : "Далее"}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}

function ChipInput({
  value,
  options,
  suffix,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  options: number[];
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              value === o
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background hover:border-primary/50"
            }`}
          >
            {fmt(o)} {suffix}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-xs text-muted-foreground">
        Или введите своё значение
      </label>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
