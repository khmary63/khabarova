/** Client-only HTML → Markdown. Avoid top-level turndown import (breaks Node ESM / Nitro). */

type TurndownCtor = typeof import("turndown").default;

let turndownPromise: Promise<InstanceType<TurndownCtor>> | null = null;

async function getTurndown() {
  if (typeof window === "undefined") {
    throw new Error("htmlToMarkdown доступен только в браузере");
  }
  if (!turndownPromise) {
    turndownPromise = import("turndown").then(({ default: TurndownService }) => {
      const td = new TurndownService({
        headingStyle: "atx",
        bulletListMarker: "-",
        codeBlockStyle: "fenced",
      });
      td.keep(["u", "sup", "sub"]);
      // Галерея хранится как raw HTML — marked потом пропускает HTML как есть.
      td.addRule("imageGrid", {
        filter: (node) =>
          node.nodeName === "DIV" && (node as HTMLElement).hasAttribute("data-img-grid"),
        replacement: (_content, node) => `\n\n${(node as HTMLElement).outerHTML}\n\n`,
      });
      return td;
    });
  }
  return turndownPromise;
}

export async function htmlToMarkdown(html: string): Promise<string> {
  const trimmed = html.trim();
  if (!trimmed) return "";
  const td = await getTurndown();
  return td.turndown(trimmed);
}
