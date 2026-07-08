import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

// Posts are authored only by admins (token-gated upsertPost), so we trust the
// markdown source and skip DOMPurify — isomorphic-dompurify fails to initialize
// in the Cloudflare Workers runtime (no DOM), which broke SSR for /blog/$slug.

/**
 * Приводит markdown статей к единому виду, чтобы статьи без SEO/GEO-прогона
 * форматировались так же, как оптимизированные:
 *  - строки-«псевдозаголовки» из сплошного жирного текста (**Заголовок**)
 *    превращаются в настоящие заголовки `###`;
 *  - убираются декоративные горизонтальные разделители (`---`, `***`, `___`),
 *    которые в неоптимизированных статьях создают эффект «простыни».
 * Содержимое блоков кода (```), естественно, не трогается.
 */
export function normalizeMarkdown(md: string): string {
  if (!md) return "";
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inFence = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    // Декоративные разделители — убираем для единообразия
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      continue;
    }
    // Строка целиком в **жирном** (опц. с двоеточием) → настоящий заголовок
    const boldHeading = trimmed.match(/^\*\*(.+?)\*\*:?$/);
    if (boldHeading && !/^\s*[-*+]\s/.test(line) && !/^\s*\d+\.\s/.test(line)) {
      const text = boldHeading[1].trim().replace(/\*\*/g, "");
      if (text.length > 0 && text.length <= 120) {
        out.push(`### ${text}`);
        continue;
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

/**
 * Схлопывает подряд идущие «одиночные» изображения (каждое в своём `<p>`)
 * в адаптивную сетку-галерею по ширине страницы. Это выравнивает старые
 * статьи, где картинки были вставлены по одной и вставали столбиком, под тот
 * же вид, что даёт новый блок-галерея в редакторе.
 */
function groupConsecutiveImages(html: string): string {
  return html.replace(
    /(?:<p>\s*<img[^>]*>\s*<\/p>\s*){2,}/g,
    (block) => {
      const imgs = block.match(/<img[^>]*>/g) || [];
      const count = imgs.length;
      const cols = count === 1 ? 1 : count === 2 || count === 4 ? 2 : 3;
      return `<div class="img-grid" data-cols="${cols}" style="--img-grid-cols:${cols}">${imgs.join("")}</div>`;
    },
  );
}

export function renderMarkdown(md: string): string {
  const html = marked.parse(normalizeMarkdown(md ?? ""), { async: false }) as string;
  return groupConsecutiveImages(html);
}


/**
 * Извлекает FAQ-пары из markdown-секции, начинающейся с заголовка
 * `## FAQ` / `## Частые вопросы` / `## Вопросы и ответы`. Внутри секции
 * каждый `### ...?` считается вопросом, последующие строки до следующего
 * `### ` или `## ` — ответом. Используется для FAQPage JSON-LD.
 */
export function extractFaq(md: string): Array<{ q: string; a: string }> {
  if (!md) return [];
  const lines = md.split(/\r?\n/);
  // Find FAQ section start
  let i = lines.findIndex((l) =>
    /^##\s+(faq|частые вопросы|вопросы и ответы|q&a)\b/i.test(l.trim()),
  );
  if (i === -1) return [];
  i += 1;
  const faqs: Array<{ q: string; a: string }> = [];
  let curQ: string | null = null;
  let curA: string[] = [];
  const flush = () => {
    if (curQ) {
      const a = curA.join("\n").trim().replace(/\s+/g, " ");
      if (a) faqs.push({ q: curQ, a });
    }
    curQ = null;
    curA = [];
  };
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line)) {
      // next top-level section — stop
      flush();
      break;
    }
    const qMatch = line.match(/^###\s+(.+?)\s*$/);
    if (qMatch) {
      flush();
      curQ = qMatch[1].replace(/[*_`]/g, "").trim();
      continue;
    }
    if (curQ) curA.push(line);
  }
  flush();
  return faqs.slice(0, 20);
}

/** Грубая оценка количества слов (для schema.org wordCount). */
export function wordCount(md: string): number {
  if (!md) return 0;
  const plain = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~\-]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

