import smm from "@/assets/portfolio/smm.webp";
import outdoor from "@/assets/portfolio/outdoor.webp";
import aiVideo from "@/assets/portfolio/ai-video.webp";
import { useState } from "react";
import { AudioLines, Bot, Check, Code2, Layers3, MessageCircle, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AgencyHero } from "./AgencyHero";
import { AgencyHeader } from "./AgencyHeader";
import { AgencyLeadForm } from "./AgencyLeadForm";
import { AgencyQuiz } from "./AgencyQuiz";
import { SiteFooter } from "@/components/SiteFooter";
import { AGENCY_FAQ, DIRECTIONS, type Direction } from "@/lib/agency";
import { CASES, SITE } from "@/lib/site";
import { openEurekaChat } from "@/lib/eureka";
import { trackAgency } from "@/lib/agency-tracking";
import { useSiteSettings } from "@/lib/use-site-settings";
import maria from "@/assets/maria-about.jpg";
import agent from "@/assets/portfolio/agent-neyromarket.png";
export const directionIcons = {
  creative: Sparkles,
  automation: Bot,
  leads: AudioLines,
};
export function AgencyFaq({ items = AGENCY_FAQ }: { items?: { q: string; a: string }[] }) {
  return (
    <section className="agency-section agency-faq">
      <div className="agency-container agency-faq-grid">
        <div>
          <p className="agency-eyebrow">До первого разговора</p>
          <h2>
            Хорошие
            <br />
            вопросы.
          </h2>
        </div>
        <Accordion type="single" collapsible>
          {items.map((f, i) => (
            <AccordionItem key={f.q} value={String(i)}>
              <AccordionTrigger className="agency-faq-question">{f.q}</AccordionTrigger>
              <AccordionContent className="agency-faq-answer">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
export function AgencyCases() {
  const { apps } = useSiteSettings();
  return (
    <section id="cases" className="agency-section">
      <div className="agency-container">
        <div className="agency-section-heading">
          <div>
            <p className="agency-eyebrow">Опыт в действии</p>
            <h2>
              За каждым решением —<br />
              задача бизнеса.
            </h2>
          </div>
          {apps && (
            <a className="agency-inline-link" href="/apps">
              Все проекты в портфолио
            </a>
          )}
        </div>
        <div className="agency-case-grid">
          {CASES.map((c) => (
            <article key={c.niche} className="agency-case">
              <p className="agency-small">{c.city} · Автоматизация</p>
              <h3>{c.niche}</h3>
              <div className="agency-case-metric">{c.metric}</div>
              <p className="agency-case-label">{c.metricLabel}</p>
              <p>{c.after}</p>
              <a href={c.link} target="_blank" rel="noreferrer" data-track="agency_case_open">
                Читать кейс
              </a>
            </article>
          ))}
        </div>
        <p className="agency-small">
          Результаты отдельных проектов. Прогноз для вашего бизнеса рассчитывается отдельно.
        </p>
      </div>
    </section>
  );
}
export function AgencyPortfolio({ creativeOnly = false }: { creativeOnly?: boolean }) {
  const { apps } = useSiteSettings();
  return (
    <section className="agency-section">
      <div className="agency-container">
        <div className="agency-section-heading">
          <div>
            <p className="agency-eyebrow">Создаём и внедряем</p>
            <h2>
              Идеи становятся
              <br />
              <span>рабочими проектами.</span>
            </h2>
          </div>
          {apps && (
            <a className="agency-inline-link" href="/apps">
              Открыть портфолио
            </a>
          )}
        </div>
        <div className="agency-portfolio-grid">
          {[
            ...(creativeOnly ? [] : [[agent, "ИИ-агент НейроМаркет", "Нейросотрудники"]]),
            [smm, "SMM-ведение социальных сетей", "Соцсети и мессенджеры"],
            [outdoor, "Наружная реклама", "Креативы для бренда"],
            [aiVideo, "ИИ-видео под ключ", "Видео и анимация"],
          ].map(([src, title, type]) => {
            const body = (
              <>
                <div>
                  <img src={src} alt={title} loading="lazy" width="640" height="400" />
                </div>
                <span>{type}</span>
                <h3>{title}</h3>
              </>
            );
            return apps ? (
              <a key={title} href="/apps" className="agency-work" data-track="agency_portfolio_open">
                {body}
              </a>
            ) : (
              <div key={title} className="agency-work">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function AgencyDemo() {
  return (
    <section id="demo" className="agency-section agency-demo">
      <div className="agency-container agency-demo-grid">
        <div>
          <p className="agency-eyebrow">Попробуйте прямо здесь</p>
          <h2>
            Пока вы изучаете сайт,
            <br />
            <span>ИИ уже готов помочь.</span>
          </h2>
          <p className="agency-copy">
            Спросите о решении, расскажите о задаче или попросите связать вас с Марией. На сайте
            работает ИИ-консультант НейроМаркет.
          </p>
          <button
            type="button"
            className="agency-button"
            onClick={openEurekaChat}
            data-track="agency_demo_open"
          >
            <MessageCircle size={18} />
            Открыть ИИ-консультанта
          </button>
          <a className="agency-inline-link" href="https://noya.neyromarket.com/">
            Подробнее о возможностях Noya
          </a>
        </div>
        <div className="agency-dialogue">
          <div className="agency-dialogue-head">
            <Bot />
            <strong>Пример разговора</strong>
            <span>Иллюстрация сценария</span>
          </div>
          <p className="agency-bubble agency-bubble-user">
            Заявки приходят вечером, а отвечать некому. Что можно сделать?
          </p>
          <p className="agency-bubble">
            Можно поручить первый контакт ИИ-сотруднику. Он ответит по вашим материалам и соберёт
            данные для менеджера.
          </p>
          <p className="agency-bubble agency-bubble-user">А с чего начать?</p>
          <p className="agency-bubble">
            С разбора каналов и типовых вопросов. На бесплатной консультации определим, что
            автоматизировать первым.
          </p>
          <div className="agency-dialogue-note">
            <Check size={16} />
            База знаний · Сценарий · Передача человеку
          </div>
        </div>
      </div>
    </section>
  );
}
export function AgencyPage() {
  const [brief, setBrief] = useState<{
    direction: Direction;
    task: string;
    timeline: string;
  }>({
    direction: "creative",
    task: "",
    timeline: "",
  });
  return (
    <div className="agency nm-redesign">
      <AgencyHeader />
      <main id="main-content">
        <AgencyHero />
        <section id="directions" className="agency-section">
          <div className="agency-container">
            <div className="agency-section-heading">
              <div>
                <p className="agency-eyebrow">Три направления. Выберите своё.</p>
                <h2>
                  Что нужно
                  <br />
                  <span>вашему бизнесу?</span>
                </h2>
              </div>
              <p className="agency-copy">
                От отдельного креатива до связки
                <br />
                «привлечь — ответить — продать».
              </p>
            </div>
            <div className="agency-directions">
              {DIRECTIONS.map((d) => {
                const Icon = directionIcons[d.id];
                return (
                  <article key={d.id} className={`agency-direction agency-${d.id}`}>
                    <div className="agency-direction-top">
                      <Icon size={28} />
                      <span>{d.number}</span>
                    </div>
                    <p className="agency-eyebrow">{d.label}</p>
                    <h3>{d.task}</h3>
                    <p>{d.description}</p>
                    <div className="agency-service-tags">
                      {d.services.slice(0, 3).map((s) => (
                        <span key={s.name}>{s.name}</span>
                      ))}
                    </div>
                    <div className="agency-direction-bottom">
                      <strong>{d.price}</strong>
                      <a
                        href={d.path}
                        className="agency-button agency-button-secondary"
                        onClick={() =>
                          trackAgency("agency_direction_select", {
                            direction: d.id,
                          })
                        }
                      >
                        Изучить направление
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <AgencyPortfolio />
        <section className="agency-bridge">
          <div className="agency-container">
            <p className="agency-eyebrow">Можно соединить всё</p>
            <h2>
              Контент привлекает внимание.
              <br />
              Лидогенерация находит интерес.
              <br />
              <span>ИИ помогает довести до разговора.</span>
            </h2>
            <p>Проектируем связку под ваш процесс. Все три направления заказывать необязательно.</p>
          </div>
        </section>
        <AgencyQuiz
          onResult={(direction, task, timeline) => setBrief({ direction, task, timeline })}
        />
        <AgencyCases />
        <AgencyDemo />
        <section id="about" className="agency-section">
          <div className="agency-container agency-about-grid">
            <div className="agency-portrait">
              <img
                src={maria}
                alt="Мария Хабарова — основатель и руководитель агентства НейроМаркет"
                width="1024"
                height="1024"
                loading="lazy"
              />
              <div>
                <span>Основатель и руководитель</span>
                <strong>Мария Хабарова</strong>
              </div>
            </div>
            <div>
              <p className="agency-eyebrow">За технологиями — человек</p>
              <h2>
                Вашу задачу
                <br />
                нужно сначала
                <br />
                <span>понять.</span>
              </h2>
              <p className="agency-copy">
                Я Мария Хабарова, основатель агентства ИИ-решений «НейроМаркет». Соединяю
                бизнес-анализ, маркетинг и разработку, чтобы технологии решали конкретные задачи
                бизнеса.
              </p>
              <p className="agency-copy">
                Начинаем с процесса и ожидаемого результата. Определяем объём работ, проверяем
                решение и сопровождаем запуск. Вы понимаете, что внедряем и зачем.
              </p>
              <a href="#lead" className="agency-button agency-button-secondary">
                Обсудить задачу с Марией
              </a>
            </div>
          </div>
        </section>
        <AgencyFaq />
        <AgencyLeadForm key={`${brief.direction}-${brief.task}-${brief.timeline}`} {...brief} />
      </main>
      <SiteFooter hideLocation />
      <div className="agency-mobile-cta">
        <a href="#diagnostic">Подобрать решение</a>
        <a href="#lead">Консультация</a>
      </div>
    </div>
  );
}
