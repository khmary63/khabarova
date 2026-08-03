import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { SITE } from "@/lib/site";

// Лендинг «Контент-завод» для factory.neyromarket.com. Тексты и палитра
// воспроизводят оригинальный лендинг, живший на этом домене до перевода на
// общий конвейер (тёмная тема: фон #06101d, акценты #20d9d2/#2e7dff/#9b6cff,
// панели #0c1c2e с рамками #73c4ff38) — исходник в docs/factory-landing-content.md.
// Страница намеренно не использует токены основного сайта: у лендинга свой стиль.

const NOYA_URL = "https://noya.neyromarket.com";

const PIPELINE = [
  { n: "01", title: "Материалы", note: "идеи · голосовые · видео" },
  { n: "02", title: "Генерация", note: "посты · сценарии" },
  { n: "03", title: "Адаптация", note: "под каждую площадку" },
  { n: "04", title: "Согласование", note: "контроль перед выходом" },
  { n: "05", title: "Публикация", note: "по расписанию" },
];

const AUDIENCE = [
  {
    tag: "Э",
    title: "Экспертам и личным брендам",
    body: "Чтобы регулярно выходить в эфир, не тратя каждый день часы на посты, адаптацию и перенос между площадками.",
    label: "Контент из вашей экспертизы",
  },
  {
    tag: "Б",
    title: "Малому бизнесу и онлайн-школам",
    body: "Чтобы новости, отзывы, продукты и события превращались в системный контент, а не оставались в рабочих чатах.",
    label: "Стабильный контент-поток",
  },
  {
    tag: "SMM",
    title: "SMM-специалистам и агентствам",
    body: "Чтобы вести больше проектов одной командой, сохраняя отдельную логику, тон и согласование для каждого клиента.",
    label: "Масштабирование проектов",
  },
];

const FEATURES = [
  "Подключение готовой среды NOYA",
  "Сбор идей, голосовых, видео, новостей и отзывов",
  "Генерация постов и сценариев по вашей логике",
  "Адаптация контента под 2–3 площадки",
  "Этап согласования перед публикацией",
  "Базовая автоматическая публикация",
  "Обучение работе с системой",
  "Финальное тестирование всех сценариев",
];

const PACKAGES = [
  {
    name: "Самостоятельный запуск",
    price: "15 000 ₽",
    featured: false,
    lead: "Для тех, кто готов самостоятельно подключить и настроить систему.",
    items: [
      "Доступ к платформе NOYA",
      "Готовые процессы автоматизации контент-завода",
      "Краткий инструктаж по работе с платформой",
      "Базовые инструкции по запуску",
    ],
    result:
      "После передачи вы самостоятельно подключаете сервисы, адаптируете процессы и настраиваете интеграции.",
  },
  {
    name: "Контент-завод под ключ",
    price: "90 000 ₽",
    featured: true,
    lead: "Полностью настроенная система без самостоятельной технической работы.",
    items: [
      "Установка и настройка контент-завода",
      "Адаптация процессов под ваш бизнес",
      "Подключение необходимых сервисов и каналов",
      "Настройка постов, сценариев и видеоконтента",
      "Готовый аватар из библиотеки HeyGen",
      "Тестирование всей цепочки и обучение",
    ],
    result: "Готовый контент-завод, которым можно пользоваться сразу после передачи.",
  },
  {
    name: "Персональный контент-завод",
    price: "120 000 ₽",
    featured: false,
    lead: "Для эксперта или личного бренда — с собственным цифровым образом и голосом.",
    items: [
      "Всё из пакета «Контент-завод под ключ»",
      "Создание цифрового аватара эксперта",
      "Создание или клонирование голоса",
      "Настройка произношения, интонаций и подачи",
      "Адаптация сценариев под манеру речи эксперта",
      "Настройка и тестирование персональных видео",
    ],
    result:
      "Персональная система для создания постов, сценариев и видео с вашим цифровым аватаром.",
  },
];

const FAQ = [
  {
    q: "Что такое контент-завод на ИИ?",
    a: "Это система, которая собирает идеи и материалы, помогает создавать посты и сценарии, адаптирует их под разные площадки, передаёт на согласование и публикует по расписанию. Конкретный маршрут настраивается под бизнес-процесс клиента.",
  },
  {
    q: "Контент будет публиковаться без моего контроля?",
    a: "Нет. В базовой схеме материал сначала приходит на согласование. Публикация запускается только после вашего одобрения — этот этап можно настроить под ваш процесс.",
  },
  {
    q: "Нужно ли мне разбираться в n8n и серверах?",
    a: "Нет. n8n уже работает внутри готовой инфраструктуры NOYA. Я настраиваю бизнес-логику, связи и сценарии, а вы работаете с понятным контентным процессом.",
  },
  {
    q: "Какие площадки можно подключить?",
    a: "Состав зависит от ваших каналов и доступных способов интеграции. В базовую версию входит адаптация под 2–3 площадки; точный набор фиксируем перед запуском.",
  },
  {
    q: "Сколько стоит запуск контент-завода?",
    a: "Самостоятельный запуск стоит 15 000 ₽, контент-завод под ключ — 90 000 ₽, персональная система с цифровым аватаром — 120 000 ₽. Подписки внешних сервисов оплачиваются отдельно.",
  },
  {
    q: "Система заменяет редактора или SMM-специалиста?",
    a: "Она снимает повторяющуюся работу: сбор материалов, черновики, адаптацию, передачу на согласование и публикацию. Стратегия, экспертиза и финальный контроль остаются за человеком.",
  },
];

function CtaButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href={SITE.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#20d9d2] to-[#2e7dff] px-6 py-3 font-semibold text-[#06101d] transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#73c4ff38] rounded-xl border border-[#73c4ff38] bg-[#0c1c2e]/60">
      {FAQ.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
          >
            <span>
              <span className="mr-3 font-mono text-sm text-[#20d9d2]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.q}
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-[#a8b6c9] transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && <p className="px-5 pb-5 text-[#a8b6c9]">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

export function FactoryLanding() {
  return (
    <div className="min-h-screen bg-[#06101d] text-[#f5f8fc]">
      <header className="sticky top-0 z-40 border-b border-[#73c4ff38] bg-[#06101d]/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-bold">{SITE.brand}</span>
            <a href={SITE.phoneHref} className="hidden text-sm text-[#a8b6c9] sm:inline">
              {SITE.phone} · пн–пт, 9:00–18:00 МСК
            </a>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#audience" className="text-[#a8b6c9] hover:text-[#20d9d2]">Для кого</a>
            <a href="#features" className="text-[#a8b6c9] hover:text-[#20d9d2]">Что входит</a>
            <a href="#offer" className="text-[#a8b6c9] hover:text-[#20d9d2]">Стоимость</a>
            <a href="#faq" className="text-[#a8b6c9] hover:text-[#20d9d2]">Вопросы</a>
          </nav>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gradient-to-r from-[#20d9d2] to-[#2e7dff] px-4 py-2 text-sm font-semibold text-[#06101d]"
          >
            Обсудить запуск
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 20% 0%, #2e7dff26 0%, transparent 70%), radial-gradient(50% 40% at 90% 20%, #20d9d21f 0%, transparent 70%), radial-gradient(40% 40% at 60% 100%, #9b6cff1a 0%, transparent 70%)",
            }}
          />
          <div className="container relative mx-auto grid items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <p className="mb-4 font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
                NOYA CONTENT FACTORY
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Автоматизированный{" "}
                <span className="bg-gradient-to-r from-[#20d9d2] via-[#2e7dff] to-[#9b6cff] bg-clip-text text-transparent">
                  контент-завод
                </span>{" "}
                на NOYA за 3–5 дней
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[#a8b6c9]">
                Система превращает идеи и материалы в готовые посты и сценарии,
                адаптирует их под разные площадки и после согласования отправляет
                на публикацию.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <CtaButton>Обсудить запуск</CtaButton>
                <a href="#audience" className="font-medium text-[#20d9d2] hover:underline">
                  Для кого подходит
                </a>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-[#a8b6c9]">
                <Check className="h-4 w-4 text-[#20d9d2]" />
                Без установки n8n и администрирования сервера
              </p>
            </div>

            <div className="rounded-2xl border border-[#73c4ff38] bg-[#0c1c2e]/76 p-6 shadow-[0_0_60px_#2e7dff1f]">
              <div className="mb-4 flex items-center justify-between font-mono text-xs font-semibold tracking-widest text-[#a8b6c9]">
                <span>АВТОМАТИЧЕСКИЙ PIPELINE</span>
                <span className="flex items-center gap-2 text-[#20d9d2]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#20d9d2]" />
                  СИСТЕМА АКТИВНА
                </span>
              </div>
              <ol className="space-y-3">
                {PIPELINE.map((step) => (
                  <li
                    key={step.n}
                    className="flex items-center gap-4 rounded-lg border border-[#73c4ff38] bg-[#0b1929]/80 px-4 py-3"
                  >
                    <span className="font-mono text-sm text-[#20d9d2]">{step.n}</span>
                    <span className="font-medium">{step.title}</span>
                    <span className="ml-auto text-sm text-[#a8b6c9]">{step.note}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#20d9d2]/10 px-4 py-3 text-sm font-medium">
                <Check className="h-4 w-4 text-[#20d9d2]" />
                Контент опубликован
                <span className="ml-auto text-[#a8b6c9]">VK · Telegram · Дзен</span>
              </p>
            </div>
          </div>
        </section>

        {/* Факты */}
        <section className="border-y border-[#73c4ff38] bg-[#0b1929]/60">
          <div className="container mx-auto grid gap-6 px-4 py-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-[#20d9d2]">3–5 дней</p>
              <p className="text-sm text-[#a8b6c9]">до запуска системы</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#20d9d2]">2–3 площадки</p>
              <p className="text-sm text-[#a8b6c9]">в базовой версии</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#20d9d2]">Человек в контуре</p>
              <p className="text-sm text-[#a8b6c9]">контент выходит после одобрения</p>
            </div>
          </div>
        </section>

        {/* Для кого */}
        <section id="audience" className="container mx-auto scroll-mt-20 px-4 py-16">
          <p className="font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
            ДЛЯ КОГО
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Система подстраивается под ваш контентный процесс
          </h2>
          <p className="mt-3 max-w-2xl text-[#a8b6c9]">
            Не универсальный генератор текстов, а настроенный маршрут под задачи
            конкретного проекта.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {AUDIENCE.map((a, i) => (
              <div
                key={a.title}
                className="rounded-xl border border-[#73c4ff38] bg-[#0c1c2e]/76 p-6 transition-colors hover:border-[#20d9d2]/60"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-sm text-[#a8b6c9]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-md bg-[#2e7dff]/20 px-2 py-1 text-xs font-bold text-[#88baff]">
                    {a.tag}
                  </span>
                </div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-[#a8b6c9]">{a.body}</p>
                <p className="mt-4 text-xs font-medium text-[#20d9d2]">{a.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Что входит */}
        <section id="features" className="scroll-mt-20 border-y border-[#73c4ff38] bg-[#0b1929]/60">
          <div className="container mx-auto px-4 py-16">
            <p className="font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
              ЧТО ВХОДИТ
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Готовая система, а не набор разрозненных промптов
            </h2>
            <p className="mt-3 max-w-2xl text-[#a8b6c9]">
              Контент-завод собирается вокруг ваших материалов, каналов и порядка
              согласования. После запуска вы получаете работающий процесс и понимаете,
              как им управлять.
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
              <div className="rounded-xl border border-[#9b6cff]/40 bg-[#0c1c2e]/76 p-6">
                <p className="font-mono text-sm font-semibold tracking-widest text-[#9b6cff]">
                  NOYA
                </p>
                <h3 className="mt-2 font-semibold">Инфраструктура уже готова</h3>
                <p className="mt-2 text-sm text-[#a8b6c9]">
                  Не нужно самостоятельно устанавливать n8n, настраивать сервер и следить
                  за его работой.
                </p>
                <a
                  href={NOYA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#20d9d2] hover:underline"
                >
                  Перейти на платформу NOYA
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map((f, i) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-lg border border-[#73c4ff38] bg-[#0c1c2e]/76 px-4 py-3 text-sm"
                  >
                    <span className="font-mono text-xs text-[#a8b6c9]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{f}</span>
                    <Check className="ml-auto h-4 w-4 shrink-0 text-[#20d9d2]" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Действующий пример */}
        <section className="container mx-auto px-4 py-16">
          <p className="font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
            ДЕЙСТВУЮЩИЙ ПРИМЕР
          </p>
          <div className="mt-2 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Сначала — на контенте «НейроМаркета»</h2>
              <p className="mt-3 text-[#a8b6c9]">
                Мы уже используем Контент-завод для создания собственного контента:
                превращаем одну идею в несколько материалов, адаптируем их под разные
                площадки и собираем в одном месте для согласования. Поэтому ещё до запуска
                вашего проекта вы сможете увидеть, как система работает на практике.
              </p>
              <CtaButton className="mt-6">Заказать персональную демонстрацию</CtaButton>
            </div>
            <div className="rounded-xl border border-[#73c4ff38] bg-[#0c1c2e]/76 p-6">
              <p className="flex items-center gap-2 font-medium">
                <span className="text-[#20d9d2]">▶</span> YouTube
                <span className="ml-auto rounded-md bg-[#20d9d2]/15 px-2 py-1 text-xs font-medium text-[#20d9d2]">
                  Опубликовано
                </span>
              </p>
              <p className="mt-3 text-sm text-[#a8b6c9]">
                Экспертные видео · Кейсы · Обзоры · Shorts
              </p>
            </div>
          </div>
        </section>

        {/* Пакеты */}
        <section id="offer" className="scroll-mt-20 border-y border-[#73c4ff38] bg-[#0b1929]/60">
          <div className="container mx-auto px-4 py-16">
            <p className="font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
              ПАКЕТЫ УСЛУГИ
            </p>
            <h2 className="mt-2 text-3xl font-bold">Выберите свой формат запуска</h2>
            <p className="mt-3 max-w-2xl text-[#a8b6c9]">
              От готовых процессов для самостоятельной настройки до персональной системы
              с вашим цифровым аватаром.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {PACKAGES.map((p) => (
                <div
                  key={p.name}
                  className={`relative flex flex-col rounded-xl border bg-[#0c1c2e]/76 p-6 ${
                    p.featured
                      ? "border-[#20d9d2] shadow-[0_0_40px_#20d9d226]"
                      : "border-[#73c4ff38]"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-6 rounded-md bg-gradient-to-r from-[#20d9d2] to-[#2e7dff] px-2 py-1 text-xs font-bold text-[#06101d]">
                      ПОД КЛЮЧ
                    </span>
                  )}
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-2 text-3xl font-bold text-[#20d9d2]">{p.price}</p>
                  <p className="mt-2 text-sm text-[#a8b6c9]">{p.lead}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#20d9d2]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 rounded-lg bg-[#06101d]/80 px-4 py-3 text-sm text-[#a8b6c9]">
                    <span className="font-medium text-[#f5f8fc]">Результат.</span>{" "}
                    {p.result}
                  </p>
                  <CtaButton className="mt-6 justify-center">Приобрести пакет</CtaButton>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-[#73c4ff38] bg-[#0c1c2e]/76 p-6 lg:flex lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-sm font-semibold tracking-widest text-[#9b6cff]">
                  ДОПОЛНИТЕЛЬНО
                </p>
                <h3 className="mt-1 font-semibold">Ежемесячная поддержка</h3>
                <p className="mt-1 max-w-xl text-sm text-[#a8b6c9]">
                  Доступна для пакетов «Контент-завод под ключ» и «Персональный
                  контент-завод». Подключается отдельно после запуска.
                </p>
              </div>
              <p className="mt-4 text-2xl font-bold text-[#20d9d2] lg:mt-0">
                15 000 ₽ / месяц
              </p>
            </div>
            <p className="mt-4 text-xs text-[#a8b6c9]">
              Подписки HeyGen, внешних нейросетей, API и других сервисов оплачиваются
              клиентом отдельно.
            </p>
          </div>
        </section>

        {/* Автор */}
        <section className="container mx-auto px-4 py-16">
          <p className="font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
            КТО ЗАПУСКАЕТ СИСТЕМУ
          </p>
          <div className="mt-4 max-w-2xl">
            <h2 className="text-2xl font-bold">{SITE.expert}</h2>
            <p className="mt-1 text-sm text-[#a8b6c9]">
              Основатель агентства ИИ-решений «НейроМаркет» · IT-аналитик · специалист по
              автоматизации
            </p>
            <p className="mt-3 text-[#a8b6c9]">
              Настраиваю ИИ-системы вокруг реальных бизнес-процессов: с понятной логикой,
              контролем человека и измеримым результатом. Работаю с проектами по всей
              России.
            </p>
            <a
              href="https://neyromarket.com"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#20d9d2] hover:underline"
            >
              О НейроМаркете
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-[#73c4ff38] bg-[#0b1929]/60">
          <div className="container mx-auto px-4 py-16">
            <p className="text-center font-mono text-sm font-semibold tracking-widest text-[#20d9d2]">
              ЧАСТЫЕ ВОПРОСЫ
            </p>
            <h2 className="mt-2 text-center text-3xl font-bold">Коротко о главном</h2>
            <div className="mt-8">
              <FaqList />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#73c4ff38]">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-bold">{SITE.brand}</p>
            <p className="mt-1 text-sm text-[#a8b6c9]">
              Автоматизированные системы для контента, продаж и бизнес-процессов.
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-medium">Обсудим ваш контент-завод?</p>
            <CtaButton className="mt-3">Обсудить</CtaButton>
          </div>
        </div>
        <div className="border-t border-[#73c4ff38]">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-[#a8b6c9]">
            <span>© 2026 {SITE.brand} · {SITE.expert}</span>
            <span className="flex gap-4">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#20d9d2]"
              >
                Telegram
              </a>
              <a href={SITE.emailHref} className="hover:text-[#20d9d2]">Email</a>
              <a href="https://neyromarket.com" className="hover:text-[#20d9d2]">
                Основной сайт
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
