import { AgencyHeader } from "./AgencyHeader";
import { AgencyLeadForm } from "./AgencyLeadForm";
import { AgencyCases, AgencyDemo, AgencyFaq, AgencyPortfolio, directionIcons } from "./AgencyPage";
import { SiteFooter } from "@/components/SiteFooter";
import { DIRECTIONS, directionById, type Direction } from "@/lib/agency";
import { openEurekaChat } from "@/lib/eureka";
export function DirectionPage({ direction }: { direction: Direction }) {
  const d = directionById(direction);
  const Icon = directionIcons[direction];
  return (
    <div className={`agency agency-${direction}`}>
      <AgencyHeader />
      <main id="main-content">
        <section className="agency-hero agency-service-hero">
          <div className="agency-hero-grid" aria-hidden="true" />
          <div className="agency-container">
            <nav aria-label="Хлебные крошки" className="agency-breadcrumb">
              <a href="/">НейроМаркет</a>
              <span>/</span>
              <span>{d.label}</span>
            </nav>
            <div className="agency-service-hero-grid">
              <div>
                <p className="agency-eyebrow">
                  Направление {d.number} / {d.label}
                </p>
                <h1>
                  {d.headline.split("\n")[0]}
                  <br />
                  <span>{d.headline.split("\n")[1]}</span>
                </h1>
                <p className="agency-hero-description">{d.description}</p>
                <div className="agency-actions">
                  <a href="#lead" className="agency-button" data-track={`agency_${direction}_lead`}>
                    {d.cta}
                  </a>
                  <button
                    className="agency-button agency-button-secondary"
                    onClick={openEurekaChat}
                  >
                    Задать вопрос ИИ
                  </button>
                </div>
                <p className="agency-small">Бесплатная консультация — 30 минут</p>
              </div>
              <div className="agency-service-summary">
                <Icon size={46} />
                <span className="agency-big-number">/{d.number}</span>
                <h2>{d.magnet}</h2>
                <p>{d.intro}</p>
                <div className="agency-service-start">
                  <span>Стоимость услуг</span>
                  <strong>{d.price}</strong>
                </div>
              </div>
            </div>
            <nav className="agency-direction-nav" aria-label="Другие направления">
              {DIRECTIONS.map((x) => (
                <a href={x.path} aria-current={direction === x.id ? "page" : undefined} key={x.id}>
                  {x.number} / {x.label}
                </a>
              ))}
            </nav>
          </div>
        </section>
        <section className="agency-section" id="services">
          <div className="agency-container">
            <p className="agency-eyebrow">Что можем сделать</p>
            <h2>
              {direction === "leads" ? "Прозрачный бюджет старта." : "Выберите масштаб задачи."}
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
                ? "Итого — от 60 000 ₽. Целевое действие, объём работ и состав расходов фиксируем до запуска."
                : "Указаны стартовые цены. Итоговая смета, сроки и внешние сервисы согласуются до начала работ."}
            </p>
          </div>
        </section>
        {direction === "automation" && (
          <section className="agency-note-section">
            <div className="agency-container">
              <h2>Внедрение и работа платформы — отдельно.</h2>
              <p>
                Внедрение ИИ-сотрудника — от 30 000 ₽ разово. Работа сотрудника — ориентировочно 3–5
                тыс. ₽ в месяц в вашем кабинете; зависит от модели и объёма диалогов. Первый месяц
                поддержки после договора — бесплатно. Далее — от 10 000 ₽ в месяц или 1 500 ₽ в час.
              </p>
            </div>
          </section>
        )}
        <section className="agency-section">
          <div className="agency-container">
            <p className="agency-eyebrow">От задачи до запуска</p>
            <h2>Как проходит работа.</h2>
            <ol className="agency-steps">
              {d.steps.map((s, i) => (
                <li key={s}>
                  <span>0{i + 1}</span>
                  <h3>{s}</h3>
                </li>
              ))}
            </ol>
            <a className="agency-inline-link" href={d.related.href}>
              {d.related.label}
            </a>
          </div>
        </section>
        {direction === "creative" && <AgencyPortfolio />}
        {direction === "automation" && (
          <>
            <AgencyCases />
            <AgencyDemo />
          </>
        )}
        {direction === "leads" && (
          <section className="agency-note-section">
            <div className="agency-container">
              <h2>Контактность и интерес — разные показатели.</h2>
              <p>
                Скоринг помогает отсеять неактуальные и малоконтактные номера. Лид появляется, когда
                человек совершил согласованное целевое действие. В отчёте разделяем расходы, попытки
                связи, дозвоны и заинтересованные отклики.
              </p>
              <p>
                Стоимость лида и возможность масштабирования определяем по результатам теста.
                Готовность купить и конкретное количество продаж не обещаем.
              </p>
            </div>
          </section>
        )}
        <section className="agency-section">
          <div className="agency-container agency-first-step">
            <div>
              <p className="agency-eyebrow">Полезно ещё до старта</p>
              <h2>{d.magnet}</h2>
              <p className="agency-copy">На консультации применим эти шаги к вашему бизнесу.</p>
            </div>
            <ul>
              {d.result.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </section>
        <AgencyFaq items={d.faq} />
        <AgencyLeadForm direction={direction} />
      </main>
      <SiteFooter hideLocation />
    </div>
  );
}
