// Логика калькулятора ROI ИИ-сотрудника.
// Чистые функции: одинаково работают на сервере (SSR) и на клиенте.

export type SectorSlug =
  | "stomatologiya"
  | "avtoservis"
  | "yuristy"
  | "salony-krasoty"
  | "nedvizhimost"
  | "onlayn-shkoly"
  | "medklinika"
  | "obshchiy";

export type SectorConfig = {
  slug: SectorSlug;
  /** Название ниши в именительном падеже, напр. «Стоматология» */
  label: string;
  /** Форма «для ...», напр. «для стоматологии» */
  forLabel: string;
  /** Типовые значения для пресет-страницы и дефолтов квиза */
  defaults: { staff: number; salary: number; leads: number; routine: number };
  /** Множитель роста конверсии после внедрения ИИ (из реальных кейсов) */
  convMultiplier: number;
  /** Краткое SEO-описание ниши */
  intro: string;
  faq: { q: string; a: string }[];
};

// Базовая стоимость внедрения (ориентир, ₽). Используется для срока окупаемости.
export const IMPLEMENTATION_COST = 35000;
// Коэффициент налогов/взносов к окладу сотрудника.
export const PAYROLL_TAX_FACTOR = 1.3;

export const SECTORS: Record<SectorSlug, SectorConfig> = {
  stomatologiya: {
    slug: "stomatologiya",
    label: "Стоматология",
    forLabel: "для стоматологии",
    defaults: { staff: 2, salary: 60000, leads: 400, routine: 60 },
    convMultiplier: 2.5,
    intro:
      "ИИ-администратор отвечает пациентам за секунды 24/7, консультирует по услугам и записывает на приём — клиника не теряет заявки в нерабочее время.",
    faq: [
      {
        q: "Как ИИ-сотрудник помогает стоматологии?",
        a: "ИИ мгновенно отвечает на сообщения пациентов в мессенджерах, отвечает на частые вопросы о ценах и услугах, квалифицирует и записывает на приём 24/7, разгружая администраторов.",
      },
      {
        q: "За сколько окупается внедрение в стоматологии?",
        a: "При типовой нагрузке клиники внедрение окупается за несколько недель за счёт экономии на администраторах и роста записей на приём.",
      },
    ],
  },
  avtoservis: {
    slug: "avtoservis",
    label: "Автосервис",
    forLabel: "для автосервиса",
    defaults: { staff: 2, salary: 55000, leads: 500, routine: 65 },
    convMultiplier: 2.8,
    intro:
      "ИИ-продавец принимает заявки на ремонт и ТО круглосуточно, считает предварительную стоимость и записывает клиентов — даже когда мастера заняты.",
    faq: [
      {
        q: "Что делает ИИ-сотрудник в автосервисе?",
        a: "Принимает обращения клиентов 24/7, уточняет марку и проблему авто, отвечает на вопросы по услугам и стоимости, записывает на ремонт и ТО.",
      },
    ],
  },
  yuristy: {
    slug: "yuristy",
    label: "Юридические услуги",
    forLabel: "для юридической компании",
    defaults: { staff: 1, salary: 70000, leads: 300, routine: 70 },
    convMultiplier: 2.9,
    intro:
      "ИИ-сотрудник отсеивает нерелевантные обращения, квалифицирует лидов и записывает на консультацию — юристы работают только с целевыми клиентами.",
    faq: [
      {
        q: "Как ИИ помогает юридическому бизнесу?",
        a: "ИИ обрабатывает входящие обращения, отсеивает «мусорные» заявки, квалифицирует потенциальных клиентов и записывает на платную консультацию, заменяя помощника.",
      },
    ],
  },
  "salony-krasoty": {
    slug: "salony-krasoty",
    label: "Салоны красоты и SPA",
    forLabel: "для салона красоты",
    defaults: { staff: 3, salary: 50000, leads: 700, routine: 65 },
    convMultiplier: 3,
    intro:
      "ИИ-администратор ведёт переписку с клиентами в нескольких филиалах, прогревает по сценарию и записывает на услуги — без выгорания и пропущенных сообщений.",
    faq: [
      {
        q: "Зачем салону красоты ИИ-сотрудник?",
        a: "ИИ обрабатывает сотни сообщений ежедневно, отвечает на вопросы об услугах и ценах, прогревает клиентов и записывает их, разгружая администраторов нескольких филиалов.",
      },
    ],
  },
  nedvizhimost: {
    slug: "nedvizhimost",
    label: "Недвижимость",
    forLabel: "для агентства недвижимости",
    defaults: { staff: 3, salary: 65000, leads: 600, routine: 60 },
    convMultiplier: 2.4,
    intro:
      "ИИ-продавец мгновенно отвечает по объявлениям, квалифицирует покупателей и арендаторов и назначает показы — ни один горячий лид не остывает.",
    faq: [
      {
        q: "Как ИИ-сотрудник работает в недвижимости?",
        a: "ИИ отвечает на заявки по объектам круглосуточно, уточняет бюджет и параметры, квалифицирует клиентов и назначает показы, освобождая риелторов от рутины.",
      },
    ],
  },
  "onlayn-shkoly": {
    slug: "onlayn-shkoly",
    label: "Онлайн-школы",
    forLabel: "для онлайн-школы",
    defaults: { staff: 3, salary: 55000, leads: 1000, routine: 70 },
    convMultiplier: 2.6,
    intro:
      "ИИ-сотрудник консультирует по курсам, прогревает заявки и доводит до оплаты — масштабирует продажи без раздувания отдела.",
    faq: [
      {
        q: "Чем полезен ИИ онлайн-школе?",
        a: "ИИ обрабатывает большой поток заявок на курсы, отвечает на вопросы о программах и стоимости, прогревает и доводит студентов до оплаты 24/7.",
      },
    ],
  },
  medklinika: {
    slug: "medklinika",
    label: "Медицинские клиники",
    forLabel: "для медицинской клиники",
    defaults: { staff: 3, salary: 60000, leads: 800, routine: 60 },
    convMultiplier: 2.5,
    intro:
      "ИИ-регистратор отвечает пациентам, консультирует по услугам и направлениям и записывает на приём круглосуточно — клиника не теряет обращения.",
    faq: [
      {
        q: "Как ИИ помогает медицинской клинике?",
        a: "ИИ мгновенно отвечает пациентам, отвечает на вопросы об услугах и врачах, квалифицирует и записывает на приём 24/7, разгружая регистратуру.",
      },
    ],
  },
  obshchiy: {
    slug: "obshchiy",
    label: "Бизнес",
    forLabel: "для вашего бизнеса",
    defaults: { staff: 3, salary: 60000, leads: 500, routine: 60 },
    convMultiplier: 2.5,
    intro:
      "ИИ-сотрудник отвечает клиентам за секунды 24/7, квалифицирует заявки и доводит до целевого действия — менеджеры работают только с горячими лидами.",
    faq: [
      {
        q: "Что такое ИИ-сотрудник в продажах?",
        a: "Это ИИ-ассистент на базе языковой модели, который ведёт переписку с клиентами по утверждённому сценарию: отвечает мгновенно 24/7, квалифицирует лидов и доводит до записи или продажи.",
      },
    ],
  },
};

export const SECTOR_SLUGS = Object.keys(SECTORS) as SectorSlug[];

export function isSectorSlug(value: string): value is SectorSlug {
  return value in SECTORS;
}

export function getSector(slug: string): SectorConfig {
  return isSectorSlug(slug) ? SECTORS[slug] : SECTORS.obshchiy;
}

export type RoiInput = {
  sector: SectorSlug;
  staff: number;
  salary: number;
  leads: number;
  routine: number; // 0..100
};

export type RoiResult = {
  /** Ежемесячная экономия ФОТ, ₽ */
  monthlySavings: number;
  /** Экономия ФОТ за год, ₽ */
  yearlySavings: number;
  /** Доп. заявок/лидов в месяц благодаря росту конверсии */
  extraLeads: number;
  /** Срок окупаемости, дней */
  paybackDays: number;
  /** Множитель конверсии ниши */
  convMultiplier: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function calculateRoi(input: RoiInput): RoiResult {
  const staff = clamp(Math.round(input.staff), 0, 200);
  const salary = clamp(Math.round(input.salary), 0, 1_000_000);
  const leads = clamp(Math.round(input.leads), 0, 1_000_000);
  const routine = clamp(input.routine, 0, 100) / 100;

  const convMultiplier = getSector(input.sector).convMultiplier;

  const monthlySavings = Math.round(staff * salary * PAYROLL_TAX_FACTOR * routine);
  const yearlySavings = monthlySavings * 12;
  const extraLeads = Math.round(leads * (convMultiplier - 1));

  const paybackDays =
    monthlySavings > 0
      ? clamp(Math.round((IMPLEMENTATION_COST / monthlySavings) * 30), 1, 365)
      : 365;

  return {
    monthlySavings,
    yearlySavings,
    extraLeads,
    paybackDays,
    convMultiplier,
  };
}

export function formatRub(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}
