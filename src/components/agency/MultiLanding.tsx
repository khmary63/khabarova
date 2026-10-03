import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Pause, Play, Send } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AgencyHeader } from "./AgencyHeader";
import { AgencyScene } from "./AgencyHero";
import { AgencyCases, AgencyFaq, AgencyPortfolio } from "./AgencyPage";
import { AgencyLeadForm } from "./AgencyLeadForm";
import { AgencyProcess } from "./AgencyProcess";
import { AgencyQuickForm } from "./AgencyQuickForm";
import { AgencyQuiz } from "./AgencyQuiz";
import { SiteFooter } from "@/components/SiteFooter";
import { directionById, type Direction } from "@/lib/agency";
import { trackAgency } from "@/lib/agency-tracking";
import { SITE } from "@/lib/site";
import maria from "@/assets/maria-about.jpg";
const entries = [
  {
    id: "creative",
    title: "Раскрутить бренд",
    hint: "Контент-заводы, сайты, SMM, AI-креатор",
    path: "/ai-creator",
  },
  {
    id: "automation",
    title: "Убрать рутину",
    hint: "ИИ‑сотрудники, боты, автоматизация",
    path: "/automation",
  },
  {
    id: "leads",
    title: "Нужны клиенты",
    hint: "Потенциальные клиенты",
    path: "/lead-generation",
  },
] as const;
const copy = {
  creative: {
    headline: "Ваш бренд заслуживает внимания.",
    description:
      "Создадим сайт, упакуем соцсети и наладим выпуск контента. От первой идеи до материалов, с которыми можно выходить к аудитории.",
    h1: "Сайт, SMM и контент для вашего бренда",
    cta: "Разобрать продвижение бренда",
    about:
      "Разберём вашу аудиторию, предложение и каналы продвижения. Определим, какие материалы нужны бизнесу сейчас, и соберём план работ.",
  },
  automation: {
    headline: "Пусть ИИ работает, а вы - управляйте",
    description:
      "ИИ отвечает на вопросы и передаёт заявки команде. Разрабатываем собственные системы для работы с клиентами, задачами и данными.",
    h1: "ИИ-сотрудники и боты для вашего бизнеса",
    cta: "Найти, что автоматизировать",
    about:
      "Посмотрим, где команда тратит время и теряет обращения. Выберем процесс для первого внедрения и определим, как оценить результат.",
  },
  leads: {
    headline: "Найдем для вас потенциальных клиентов",
    description:
      "AtomLead — новая российская рекламная площадка. Стоимость лида в 3–10 раз ниже, чем в Яндекс Директе или VK Рекламе.",
    h1: "Потенциальные клиенты для вашего бизнеса",
    cta: "Хочу такую систему",
    about:
      "Обсудим вашу нишу, регион, предложение и критерии заинтересованного обращения. До старта согласуем тестовый бюджет и показатели оценки.",
  },
};
function Founder({ direction }: { direction?: Direction }) {
  return (
    <section id="about" className="agency-section nm-founder-section">
      <div className="agency-container agency-about-grid">
        <div className="agency-portrait">
          <img
            src={maria}
            width="1024"
            height="1024"
            loading="lazy"
            alt="Мария Хабарова, основатель НейроМаркет"
          />
          <div>
            <span>Основатель и руководитель</span>
            <strong>Мария Хабарова</strong>
          </div>
        </div>
        <div>
          <p className="agency-eyebrow">За технологиями — человек</p>
          <h2>
            Бизнес 2.0 уже наступил.
            <br />
            <span>Вы в нём?</span>
          </h2>
          <p className="nm-founder-subtitle">Агентство ИИ-решений НейроМаркет</p>
          <p className="agency-copy">
            {direction
              ? copy[direction].about
              : "Соединяем бизнес-анализ, маркетинг и разработку с искусственным интеллектом. Проектируем ИИ-системы для конкретных бизнес-задач."}
          </p>
          <a href={direction ? "#lead" : "#directions"} className="agency-button nm-primary">
            {direction ? "Обсудить задачу с Марией" : "Выбрать свою задачу"}
          </a>
        </div>
      </div>
    </section>
  );
}
function Journey({ direction }: { direction: Direction }) {
  const d = directionById(direction);
  const c = copy[direction];
  const [brief, setBrief] = useState({ task: "", timeline: "" });
  return (
    <div className={`nm-journey nm-journey-${direction}`} data-journey={direction}>
      <section id="demo" className="agency-section nm-focused-intro">
        <div className="agency-container">
          <div className="nm-focused-heading">
            <p className="agency-eyebrow">{d.label}</p>
            <h2>{c.headline}</h2>
            <p className="agency-copy">{c.description}</p>
          </div>
          <div className="nm-stage">
            <div className="nm-stage-copy">
              <h3>{d.magnet}</h3>
              <p>{d.intro}</p>
              <a href="#lead" className="agency-button nm-primary">
                {c.cta}
              </a>
              <small>Бесплатная консультация — 30 минут</small>
            </div>
            <div>
              <AgencyScene direction={direction} />
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="agency-section">
        <div className="agency-container">
          <p className="agency-eyebrow">
            {direction === "creative"
              ? "От идеи до публикации"
              : direction === "automation"
                ? "От ручной работы к системе"
                : "Прозрачный бюджет старта"}
          </p>
          <h2>
            {direction === "leads"
              ? "Из чего складывается запуск"
              : "Что сделаем для вашего бизнеса"}
          </h2>
          <div className="agency-pricing">
            {d.services.map((s) => (
              <article key={s.name}>
                <h3>{s.name}</h3>
                <strong>{s.price}</strong>
                <p>{s.detail}</p>
                <a href="#lead" className="agency-inline-link">
                  Обсудить задачу
                </a>
              </article>
            ))}
          </div>
          <p className="agency-small">
            {direction === "leads"
              ? "Итого — от 60 000 ₽: 50 000 ₽ рекламного бюджета и 10 000 ₽ за работу агентства."
              : "Указаны стартовые цены. Объём работ, сроки и расходы на внешние сервисы согласуем до начала проекта."}
          </p>
        </div>
      </section>
      <AgencyQuickForm
        direction={direction}
        title="Обсудим вашу задачу бесплатно"
        text={`Оставьте имя и телефон — разберём задачу и предложим первый шаг. Стартовая цена направления: ${d.price}.`}
      />
      {direction === "creative" && (
        <div id="cases">
          <AgencyPortfolio creativeOnly />
        </div>
      )}
      {direction === "automation" && <AgencyCases />}
      {direction === "leads" && (
        <section id="cases" className="agency-note-section">
          <div className="agency-container">
            <h2>Оцениваем интерес, а не размер базы.</h2>
            <p>
              Скоринг помогает отсеять неактуальные и малоконтактные номера. Заинтересованным лидом
              считаем человека, совершившего согласованное целевое действие. В отчёте разделяем
              расходы, попытки связи, дозвоны и отклики.
            </p>
            <p>Реанимируем и системно работаем с базой клиентов.</p>
            <p>
              Стоимость лида определяем по результатам теста. Конкретное количество продаж не
              обещаем.
            </p>
          </div>
        </section>
      )}
      <section className="agency-section">
        <div className="agency-container">
          <p className="agency-eyebrow">Понятный путь к запуску</p>
          <h2>Как проходит работа</h2>
          <ol className="agency-steps">
            {d.steps.map((step, i) => (
              <li key={step}>
                <span>0{i + 1}</span>
                <h3>{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <AgencyQuiz
        key={direction}
        lockedDirection={direction}
        onResult={(_, task, timeline) => setBrief({ task, timeline })}
      />
      <Founder direction={direction} />
      <AgencyFaq items={d.faq} />
      <AgencyLeadForm
        key={`${direction}-${brief.task}-${brief.timeline}`}
        direction={direction}
        lockedDirection
        {...brief}
      />
    </div>
  );
}
export function MultiLanding({ direction }: { direction?: Direction }) {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [motionOn, setMotionOn] = useState(false);
  // System "reduce motion": start calm; the play button is an explicit opt-in.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);
  const toggleMotion = () => {
    if (paused) setMotionOn(true);
    setPaused(!paused);
  };
  return (
    <div className={`agency nm-redesign nm-multilanding ${paused ? "nm-paused" : ""} ${motionOn ? "nm-motion-on" : ""}`}>
      <AgencyHeader focused={!!direction} />
      <main id="main-content">
        <Tabs
          value={direction || ""}
          onValueChange={(v) => {
            const entry = entries.find((e) => e.id === v)!;
            trackAgency("agency_direction_select", { direction: v });
            void navigate({ to: entry.path, resetScroll: false });
          }}
          activationMode="manual"
        >
          <section className="nm-hero">
            <div className="nm-art" aria-hidden="true">
              <img src="/agency-hero.webp" alt="" width="1536" height="1024" />
            </div>
            <div className="agency-container nm-hero-content">
              <div className="nm-kicker">
                <span>НЕЙРОМАРКЕТ</span> АГЕНТСТВО ИИ-РЕШЕНИЙ
              </div>
              <h1>
                {direction ? (
                  copy[direction].h1
                ) : (
                  <>
                    Бизнес третьего
                    <br />
                    тысячелетия
                  </>
                )}
              </h1>
              <p className="nm-main-subtitle">
                ИИ на службе
                <br className="nm-mobile-break" /> вашего дела
              </p>
              <div id="directions" className="nm-entry">
                {!direction && <span id="demo" />}
                <h2>Что вам нужно?</h2>
                <TabsList className="nm-entry-tabs" aria-label="Выберите задачу бизнеса">
                  {entries.map((e, i) => (
                    <TabsTrigger key={e.id} value={e.id}>
                      <span className="nm-entry-number">0{i + 1}</span>
                      <span>
                        <b>{e.title}</b>
                        <small>{e.hint}</small>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <p className="nm-entry-hint" role="status">
                  {direction
                    ? `Выбрано: ${entries.find((e) => e.id === direction)?.title}. Ваше решение — ниже.`
                    : "Выберите задачу — расскажем подробнее"}
                </p>
                <div className="nm-hero-contacts">
                  <a
                    className="agency-button nm-primary"
                    href="#lead"
                    onClick={() => trackAgency("agency_cta_click", { place: "hero" })}
                  >
                    Бесплатный разбор за 30 минут
                  </a>
                  <a
                    className="agency-button agency-button-secondary"
                    href={SITE.telegramDm}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackAgency("agency_telegram_click", { place: "hero" })}
                  >
                    <Send size={16} /> Написать в Telegram
                  </a>
                </div>
              </div>
            </div>
            <div className="nm-art-caption">
              <button
                onClick={toggleMotion}
                aria-label={paused ? "Включить анимацию" : "Остановить анимацию"}
              >
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
            </div>
          </section>
          {entries.map((e) => (
            <TabsContent key={e.id} value={e.id} className="nm-journey-panel">
              <Journey direction={e.id} />
            </TabsContent>
          ))}
        </Tabs>
        {!direction && (
          <>
            <AgencyQuickForm id="lead" />
            <AgencyCases />
            <AgencyProcess />
            <Founder />
          </>
        )}
      </main>
      <SiteFooter hideLocation focused={!!direction} />
      <div className="agency-mobile-cta">
        <a
          href={SITE.telegramDm}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackAgency("agency_telegram_click", { place: "sticky" })}
        >
          Написать в Telegram
        </a>
        <a href="#lead" onClick={() => trackAgency("agency_cta_click", { place: "sticky" })}>
          Бесплатный разбор
        </a>
      </div>
    </div>
  );
}
