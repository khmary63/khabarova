import { useState } from "react";
import { Pause, Play, Sparkles, Check, AudioLines } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import maria from "@/assets/maria-about.jpg";
import work from "@/assets/portfolio/automated-content-factory.webp";
import { trackAgency } from "@/lib/agency-tracking";
const modes = [
  {
    id: "creative",
    name: "Меня замечают",
    label: "Контент и продвижение",
    title: "Одна идея. Целая кампания.",
    copy: "Сайты, креативы и контент, в которых узнают ваш бренд.",
    path: "/ai-creator",
  },
  {
    id: "automation",
    name: "Рутина работает сама",
    label: "Автоматизация",
    title: "Клиент написал. ИИ подхватил.",
    copy: "От первого вопроса до передачи заявки команде — без потерянных обращений.",
    path: "/automation",
  },
  {
    id: "leads",
    name: "Приходят новые клиенты",
    label: "Лидогенерация",
    title: "Не просто контакт. Начало диалога.",
    copy: "Настраиваем поиск аудитории, сценарий общения и передачу заинтересованных обращений.",
    path: "/lead-generation",
  },
];
export function AgencyHero() {
  const [mode, setMode] = useState("creative");
  const [paused, setPaused] = useState(false);
  return (
    <>
      <section className={`nm-hero ${paused ? "nm-paused" : ""}`}>
        <div className="nm-art" aria-hidden="true">
          <img src="/agency-hero.webp" width="1536" height="1024" alt="" />
        </div>
        <div className="agency-container nm-hero-content">
          <div className="nm-kicker">
            <span>НЕЙРОМАРКЕТ</span> АГЕНТСТВО ИИ-РЕШЕНИЙ
          </div>
          <h1>
            Вы строили бизнес.
            <br />
            <em>
              Не вторую
              <br />
              работу.
            </em>
          </h1>
          <p className="nm-hero-copy">
            Пора перестать делать всё самостоятельно.
            <br />
            Подключаем ИИ к контенту, процессам
            <br className="nm-wide" /> и привлечению клиентов.
          </p>
          <div className="agency-actions">
            <a className="agency-button nm-primary" href="#possibilities">
              Что ИИ может сделать для меня?
            </a>
            <a className="nm-watch" href="#possibilities">
              <Play size={17} />
              Посмотреть в действии
            </a>
          </div>
          <a className="nm-founder" href="#about">
            <img src={maria} alt="Мария Хабарова" width="48" height="48" />
            <span>
              Мария Хабарова<small>Основатель НейроМаркет</small>
            </span>
          </a>
        </div>
        <div className="nm-art-caption">
          <span>
            ЧЕЛОВЕЧЕСКИЕ ИДЕИ.
            <br />
            НЕЧЕЛОВЕЧЕСКИЕ ВОЗМОЖНОСТИ.
          </span>
          <button
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Включить анимацию" : "Остановить анимацию"}
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </section>
      <div className="nm-ribbon">
        <span>СОЗДАВАТЬ СМЕЛЕЕ</span>
        <span aria-hidden="true">✳</span>
        <span>РАБОТАТЬ УМНЕЕ</span>
        <span aria-hidden="true">✳</span>
        <span>РАСТИ БЫСТРЕЕ</span>
        <span aria-hidden="true">✳</span>
      </div>
      <section id="possibilities" className={`agency-section nm-lab ${paused ? "nm-paused" : ""}`}>
        <div className="agency-container">
          <div className="nm-lab-heading">
            <div>
              <p className="agency-eyebrow">Ваш бизнес. Усиленный интеллектом.</p>
              <h2>
                А если
                <br />
                <span>можно иначе?</span>
              </h2>
            </div>
            <p>
              Выберите, что хотите изменить.
              <br />
              Посмотрите, как может работать решение.
            </p>
          </div>
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v);
              trackAgency("agency_direction_select", { direction: v });
            }}
            className="nm-tabs"
          >
            <TabsList className="nm-tabs-list">
              {modes.map((m, i) => (
                <TabsTrigger value={m.id} key={m.id}>
                  <small>0{i + 1}</small>
                  {m.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {modes.map((m) => (
              <TabsContent value={m.id} key={m.id} className={`nm-stage nm-stage-${m.id}`}>
                <div className="nm-stage-copy">
                  <p className="agency-eyebrow">{m.label}</p>
                  <h3>{m.title}</h3>
                  <p>{m.copy}</p>
                  <a className="agency-button nm-primary" href={m.path}>
                    Подробнее о решении
                  </a>
                </div>
                <div className="nm-scene" key={m.id}>
                  {m.id === "creative" ? (
                    <>
                      <div className="nm-work-image">
                        <img
                          src={work}
                          alt="Автоматизированный контент-завод — проект из портфолио НейроМаркет"
                        />
                        <span>Автоматизированный контент-завод</span>
                      </div>
                      <div className="nm-idea">
                        <Sparkles size={22} />
                        <b>Идея</b>
                        <span>Контент · Сайт · Креативы</span>
                      </div>
                      <div className="nm-format">
                        <b>24/7</b>
                        <span>Посты / Видео / Истории</span>
                      </div>
                    </>
                  ) : m.id === "automation" ? (
                    <div className="nm-conversation">
                      <div className="nm-chat-in">Здравствуйте! Можно узнать стоимость?</div>
                      <div className="nm-chat-ai">
                        <Sparkles size={18} />
                        <span>Конечно. Расскажите, какую задачу хотите решить?</span>
                      </div>
                      <div className="nm-crm">
                        <Check />
                        <div>
                          <b>Заявка команде</b>
                          <span>Контекст диалога сохранён</span>
                        </div>
                      </div>
                      <div className="nm-flow-label">ОБРАЩЕНИЕ / ДИАЛОГ / СЛЕДУЮЩИЙ ШАГ</div>
                    </div>
                  ) : (
                    <div className="nm-lead-scene">
                      <span className="nm-scenario-tag">СЦЕНАРИЙ ГОЛОСОВОГО ДИАЛОГА</span>
                      <div className="nm-wave" aria-hidden="true">
                        {Array.from({ length: 28 }, (_, i) => (
                          <i
                            key={i}
                            style={{
                              animationDelay: `${i * 0.09}s`,
                              height: `${16 + ((i * 17) % 66)}px`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="nm-voice">
                        <AudioLines />
                        <span>
                          Да, мне интересно.
                          <br />
                          <b>Хочу узнать подробнее.</b>
                        </span>
                      </div>
                      <div className="nm-crm">
                        <Check />
                        <div>
                          <b>Есть интерес</b>
                          <span>Передаём обращение вашему менеджеру</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  );
}

export function AgencyScene({ direction }: { direction: "creative" | "automation" | "leads" }) {
  return (
    <div className="nm-scene" key={direction}>
      {direction === "creative" ? (
        <>
          <div className="nm-work-image">
            <img
              src={work}
              alt="Автоматизированный контент-завод — проект из портфолио НейроМаркет"
            />
            <span>Автоматизированный контент-завод</span>
          </div>
          <div className="nm-idea">
            <Sparkles size={22} />
            <b>Идея</b>
            <span>Контент · Сайт · Креативы</span>
          </div>
          <div className="nm-format">
            <b>24/7</b>
            <span>Посты / Видео / Истории</span>
          </div>
        </>
      ) : direction === "automation" ? (
        <div className="nm-conversation">
          <div className="nm-chat-in">Здравствуйте! Можно узнать стоимость?</div>
          <div className="nm-chat-ai">
            <Sparkles size={18} />
            <span>Конечно. Расскажите, какую задачу хотите решить?</span>
          </div>
          <div className="nm-crm">
            <Check />
            <div>
              <b>Заявка команде</b>
              <span>Контекст диалога сохранён</span>
            </div>
          </div>
          <div className="nm-flow-label">ОБРАЩЕНИЕ / ДИАЛОГ / СЛЕДУЮЩИЙ ШАГ</div>
        </div>
      ) : (
        <div className="nm-lead-scene">
          <span className="nm-scenario-tag">СЦЕНАРИЙ ГОЛОСОВОГО ДИАЛОГА</span>
          <div className="nm-wave" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => (
              <i
                key={i}
                style={{
                  animationDelay: `${i * 0.09}s`,
                  height: `${16 + ((i * 17) % 66)}px`,
                }}
              />
            ))}
          </div>
          <div className="nm-voice">
            <AudioLines />
            <span>
              Да, мне интересно.
              <br />
              <b>Хочу узнать подробнее.</b>
            </span>
          </div>
          <div className="nm-crm">
            <Check />
            <div>
              <b>Есть интерес</b>
              <span>Передаём обращение вашему менеджеру</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
