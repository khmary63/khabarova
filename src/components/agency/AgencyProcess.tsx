import { Check, X } from "lucide-react";

const steps = [
  ["Заявка и разговор", "Бесплатная консультация 30 минут: слушаем задачу и вашу ситуацию."],
  ["План и стоимость", "Предлагаем первый шаг, объём работ, сроки и бюджет. Решение за вами."],
  ["Запуск", "Работаем по согласованному плану и показываем, как оценивать результат."],
];
const included = [
  "Разбор вашей конкретной задачи",
  "Понятный первый шаг и ориентир по бюджету",
  "Личный контакт с Марией",
];
const excluded = [
  "Не навязываем платный проект: консультация ни к чему не обязывает",
  "Не настраиваем чужие CRM — разрабатываем собственные системы",
  "Не обещаем конкретное число продаж",
];

/** "How it works" and "what you get / what you don't" — removes the fear of the first call. */
export function AgencyProcess() {
  return (
    <section id="process" className="agency-section nm-process">
      <div className="agency-container">
        <p className="agency-eyebrow">Понятный путь</p>
        <h2>Как это проходит</h2>
        <ol className="agency-steps">
          {steps.map(([title, text], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="nm-promise">
          <div>
            <h3>Что вы получите</h3>
            <ul>
              {included.map((t) => (
                <li key={t}>
                  <Check size={18} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Чего не будет</h3>
            <ul>
              {excluded.map((t) => (
                <li key={t}>
                  <X size={18} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
