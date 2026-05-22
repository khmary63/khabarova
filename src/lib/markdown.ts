import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

// Posts are authored only by admins (token-gated upsertPost), so we trust the
// markdown source and skip DOMPurify — isomorphic-dompurify fails to initialize
// in the Cloudflare Workers runtime (no DOM), which broke SSR for /blog/$slug.
export function renderMarkdown(md: string): string {
  return marked.parse(md ?? "", { async: false }) as string;
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

