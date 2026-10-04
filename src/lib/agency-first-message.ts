import type { Direction } from "./agency";

/** Short opener for each direction. No prices, no promises: only a question and an offer of a call. */
const OPENERS: Record<Direction, string> = {
  creative:
    "Увидела вашу заявку на продвижение бренда. Расскажите в двух словах, чем занимаетесь и что сейчас важнее: сайт, соцсети или регулярный контент?",
  automation:
    "Увидела вашу заявку на автоматизацию. Что сейчас забирает больше всего времени: ответы клиентам, заявки, отчёты?",
  leads:
    "Увидела вашу заявку на привлечение клиентов. В какой вы нише и в каком регионе работаете?",
};

const CLOSER = "Могу созвониться сегодня или завтра. Консультация бесплатная, 30 минут.";

export type FirstMessageInput = {
  name: string;
  direction: Direction;
  /** Free text from the lead, e.g. "Результат диагностики: …" or the checklist request. */
  task?: string;
};

/** Ready-to-send first message for Maria to paste or send in one tap. */
export function firstMessage({ name, direction, task = "" }: FirstMessageInput) {
  const who = name.trim().split(/\s+/)[0] || "";
  const hello = who ? `Здравствуйте, ${who}!` : "Здравствуйте!";
  let body = OPENERS[direction];
  if (/чек-лист/i.test(task)) {
    body = "Вы запросили наш чек-лист «Что в бизнесе можно отдать ИИ». Что из него отметили?";
  } else if (/^Результат диагностики:/i.test(task)) {
    const picked = task.replace(/^Результат диагностики:\s*/i, "").trim();
    body = `Вы прошли диагностику на сайте и выбрали «${picked}». Расскажите коротко о вашем бизнесе, и подумаем, с чего начать.`;
  }
  return `${hello} Это Мария Хабарова, НейроМаркет. ${body} ${CLOSER}`;
}

/** wa.me link that opens a WhatsApp chat with the lead and the message already typed. */
export function whatsappLink(phone: string, message: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.length === 10) digits = "7" + digits;
  if (digits.length < 8) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
