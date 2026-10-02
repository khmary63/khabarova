import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { DIRECTIONS, directionById, type Direction } from "@/lib/agency";
import { trackAgency } from "@/lib/agency-tracking";
const TASKS: Record<Direction, string[]> = {
  creative: ["Нужен сайт или лендинг", "Нужно вести соцсети", "Нужно больше контента и креативов"],
  automation: [
    "Не успеваем отвечать клиентам",
    "Много ручной работы в CRM",
    "Нужен бот или связка сервисов",
  ],
  leads: [
    "Нужен новый канал привлечения",
    "Хочу проверить нишу и регион",
    "Нужен поток обращений в отдел продаж",
  ],
};
export function AgencyQuiz({
  onResult,
}: {
  onResult: (d: Direction, task: string, timeline: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>("creative");
  const [task, setTask] = useState("");
  const [timeline, setTimeline] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  function next() {
    const n = step + 1;
    setStep(n);
    if (n === 3) {
      onResult(direction, task, timeline);
      trackAgency("agency_quiz_complete", { direction });
    }
    requestAnimationFrame(() => heading.current?.focus());
  }
  const d = directionById(direction);
  return (
    <section className="agency-section" id="diagnostic">
      <div className="agency-container agency-quiz-grid">
        <div>
          <p className="agency-eyebrow">Не знаете, с чего начать?</p>
          <h2>
            Сначала задача.
            <br />
            <span>Потом технология.</span>
          </h2>
          <p className="agency-copy">
            Три вопроса — и предварительный маршрут. Рекомендации появятся сразу, без телефона и
            регистрации.
          </p>
        </div>
        <div className="agency-quiz-card">
          <div className="agency-quiz-meta">
            <span>{step === 3 ? "Ваш первый шаг" : `Вопрос ${step + 1} из 3`}</span>
            <span>≈ 1 минута</span>
          </div>
          <Progress
            value={step === 3 ? 100 : ((step + 1) * 100) / 3}
            aria-label="Прогресс диагностики"
            className="agency-progress"
          />
          <h3 ref={heading} tabIndex={-1}>
            {
              [
                "Что сейчас важнее?",
                "Какая задача ближе?",
                "Когда планируете начать?",
                "Предлагаем начать с этого",
              ][step]
            }
          </h3>
          {step === 0 && (
            <RadioGroup
              value={direction}
              onValueChange={(v) => {
                setDirection(v as Direction);
                setTask("");
                trackAgency("agency_direction_select", { direction: v });
              }}
            >
              {DIRECTIONS.map((x) => (
                <label className="agency-quiz-option" key={x.id}>
                  <RadioGroupItem value={x.id} />
                  <span>{x.short}</span>
                </label>
              ))}
            </RadioGroup>
          )}
          {step === 1 && (
            <RadioGroup value={task} onValueChange={setTask}>
              {TASKS[direction].map((x) => (
                <label className="agency-quiz-option" key={x}>
                  <RadioGroupItem value={x} />
                  <span>{x}</span>
                </label>
              ))}
            </RadioGroup>
          )}
          {step === 2 && (
            <RadioGroup value={timeline} onValueChange={setTimeline}>
              {["В ближайшее время", "В течение месяца", "Пока изучаю возможности"].map((x) => (
                <label className="agency-quiz-option" key={x}>
                  <RadioGroupItem value={x} />
                  <span>{x}</span>
                </label>
              ))}
            </RadioGroup>
          )}
          {step < 3 ? (
            <div className="agency-quiz-actions">
              {step > 0 && (
                <button className="agency-text-button" onClick={() => setStep(step - 1)}>
                  Назад
                </button>
              )}
              <button
                className="agency-button"
                onClick={next}
                disabled={(step === 1 && !task) || (step === 2 && !timeline)}
              >
                {step === 2 ? "Показать рекомендации" : "Продолжить"}
              </button>
            </div>
          ) : (
            <div aria-live="polite">
              <p className="agency-quiz-choice">
                {task} · {timeline}
              </p>
              <p className="agency-copy">
                {direction === "creative" && task === "Нужно вести соцсети"
                  ? "Начните с контент-плана и согласования регулярности публикаций. SMM-ведение — от 30 000 ₽ в месяц."
                  : direction === "creative" && task === "Нужен сайт или лендинг"
                    ? "Начните с одного предложения, структуры страницы и целевого действия. Сайт или лендинг — от 15 000 ₽."
                    : direction === "automation"
                      ? "Выберите один повторяющийся процесс, опишите входные данные и результат. На консультации проверим интеграции и границы автоматизации."
                      : direction === "leads"
                        ? "До теста определите регион, предложение и критерий заинтересованного лида. Проверим применимость канала на бесплатной консультации."
                        : "Начните с трёх форматов для одного продукта и процесса согласования. Для регулярного производства контента рассмотрим контент-завод."}
              </p>
              <a className="agency-button" href="#lead" data-track="agency_quiz_to_lead">
                Разобрать мой случай бесплатно
              </a>
              <a href={d.path} className="agency-inline-link">
                Подробнее о направлении
              </a>
              <button
                className="agency-text-button"
                onClick={() => {
                  setStep(0);
                  setTask("");
                  setTimeline("");
                }}
              >
                Пройти ещё раз
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
