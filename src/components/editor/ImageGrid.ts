import { Node, mergeAttributes } from "@tiptap/core";

export type GridImage = { src: string; alt?: string };

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGrid: {
      /** Вставить блок-галерею из нескольких изображений. */
      setImageGrid: (images: GridImage[]) => ReturnType;
    };
  }
}

/**
 * Атомарный блок-галерея. Хранит массив изображений в атрибуте и рендерится
 * как `<div data-img-grid data-cols="N">` с вложенными `<img>`. Такой div
 * проходит через turndown (сохраняется как raw HTML) и marked (пропускается
 * как HTML-блок) без потерь, поэтому переживает цикл редактирования.
 */
export const ImageGrid = Node.create({
  name: "imageGrid",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      images: {
        default: [] as GridImage[],
        parseHTML: (el) =>
          Array.from(el.querySelectorAll("img")).map((img) => ({
            src: img.getAttribute("src") || "",
            alt: img.getAttribute("alt") || "",
          })),
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-img-grid]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const images = (node.attrs.images as GridImage[]) || [];
    const count = images.length || 1;
    // 1 → одиночный, 2/4 → 2 колонки, 3/5/6+ → 3 колонки
    const cols = count === 1 ? 1 : count === 2 || count === 4 ? 2 : 3;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-img-grid": "",
        "data-cols": String(cols),
        class: "img-grid",
        style: `--img-grid-cols:${cols}`,
      }),
      ...images.map((img) => [
        "img",
        { src: img.src, alt: img.alt || "", loading: "lazy" },
      ]),
    ];
  },

  addCommands() {
    return {
      setImageGrid:
        (images) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { images },
          }),
    };
  },
});
