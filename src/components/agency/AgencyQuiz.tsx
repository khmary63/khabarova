import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { DIRECTIONS, directionById, type Direction } from "@/lib/agency";
import { trackAgency } from "@/lib/agency-tracking";
import { QUIZ_TASKS as TASKS, quizRecommendation } from "@/lib/agency-recommendations";
export function AgencyQuiz({
  onResult,
  lockedDirection,
}: {
  lockedDirection?: Direction;
  onResult: (d: Direction, task: string, timeline: string) => void;
}) {
  const [step, setStep] = useState(lockedDirection ? 1 : 0);
  const [direction, setDirection] = useState<Direction>(lockedDirection || "creative");
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
  const recommendation = quizRecommendation(direction, task, timeline);
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
            {lockedDirection ? "Два вопроса" : "Три вопроса"} — и предварительный маршрут.
            Рекомендации появятся сразу, без телефона и регистрации.
          </p>
        </div>
        <div className="agency-quiz-card">
          <div className="agency-quiz-meta">
            <span>
              {step === 3
                ? "Ваш первый шаг"
                : `Вопрос ${lockedDirection ? step : step + 1} из ${lockedDirection ? 2 : 3}`}
            </span>
            <span>≈ 1 минута</span>
          </div>
          <Progress
            value={step === 3 ? 100 : lockedDirection ? (step * 100) / 2 : ((step + 1) * 100) / 3}
            aria-label="Прогресс диагностики"
            className="agency-progress"
          />
          <h3 ref={heading} tabIndex={-1}>
            {
              [
                "Что сейчас важнее?",
                "Какая задача ближе?",
                "Когда планируете начать?",
                "Ваш маршрут по выбранной задаче",
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
              {step > (lockedDirection ? 1 : 0) && (
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
              <div className="agency-quiz-recommendation">
                <h4>{recommendation.title}</h4>
                <p>{recommendation.solution}</p>
                <h4>Первые три шага</h4>
                <ol>
                  {recommendation.steps.map((text, i) => (
                    <li key={text}>
                      <span>{i + 1}</span>
                      {text}
                    </li>
                  ))}
                </ol>
                <h4>С учётом вашего срока</h4>
                <p>{recommendation.pace}</p>
                <h4>Подготовьте</h4>
                <p>{recommendation.prepare}</p>
                <h4>Бюджет</h4>
                <p>{recommendation.budget}</p>
                <h4>Как оценить результат</h4>
                <p>{recommendation.metric}</p>
                <p className="agency-quiz-note">
                  Это предварительный маршрут по выбранной задаче и сроку. Точный состав решения
                  определим после изучения ваших процессов.
                </p>
              </div>
              <a className="agency-button" href="#lead" data-track="agency_quiz_to_lead">
                Разобрать мой случай бесплатно
              </a>
              <a href={lockedDirection ? "#services" : d.path} className="agency-inline-link">
                Подробнее о направлении
              </a>
              <button
                className="agency-text-button"
                onClick={() => {
                  setStep(lockedDirection ? 1 : 0);
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
