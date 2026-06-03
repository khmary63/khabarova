import {
  Stethoscope,
  Car,
  Building2,
  ShoppingCart,
  Scale,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

const SEGMENTS = [
  {
    icon: Stethoscope,
    title: "Клиники и медцентры",
    desc: "Запись пациентов, напоминания, ответы на типовые вопросы — без участия администратора",
  },
  {
    icon: Car,
    title: "Автодилеры и сервисы",
    desc: "Квалификация лидов, расчёт стоимости, запись на ТО, уведомления о готовности авто",
  },
  {
    icon: Building2,
    title: "Недвижимость и застройщики",
    desc: "Подбор объектов по критериям, ответы на вопросы о ЖК, запись на показ и прогрев до сделки",
  },
  {
    icon: ShoppingCart,
    title: "Интернет-магазины",
    desc: "Консультации по ассортименту, статусы заказов, возвраты, кросс-продажи 24/7",
  },
  {
    icon: Scale,
    title: "Юридические и бухгалтерские услуги",
    desc: "Первичная консультация, сбор документов, запись к юристу, следы воронки",
  },
  {
    icon: GraduationCap,
    title: "Образование и курсы",
    desc: "Онбординг студентов, напоминания, ответы на вопросы по программе, допродажи курсов",
  },
  {
    icon: Sparkles,
    title: "Бьюти-индустрия и фитнес-центры",
    desc: "Запись на услуги, напоминания о визитах, продление абонементов, возврат клиентов после отказа",
  },
  {
    icon: Users,
    title: "HR агентства",
    desc: "Первичный отбор кандидатов, ответы на вопросы о вакансиях, согласование собеседований 24/7",
  },
];

export function Audience() {
  return (
    <section className="border-b border-border py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary">
            — для кого
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Узнайте себя в одном из сценариев
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Работаем с малым и средним бизнесом, у которого есть повторяющиеся
            задачи, которые пора отдать машине.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong"
              >
                <Icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
