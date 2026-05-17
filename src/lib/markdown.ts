import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

// Posts are authored only by admins (token-gated upsertPost), so we trust the
// markdown source and skip DOMPurify — isomorphic-dompurify fails to initialize
// in the Cloudflare Workers runtime (no DOM), which broke SSR for /blog/$slug.
export function renderMarkdown(md: string): string {
  return marked.parse(md ?? "", { async: false }) as string;
}
