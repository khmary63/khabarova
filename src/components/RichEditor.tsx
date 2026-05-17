import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Code,
} from "lucide-react";

type Props = {
  valueHtml: string;
  onChangeHtml: (html: string) => void;
  onUploadImage: (file: File) => Promise<string>;
};

export function RichEditor({ valueHtml, onChangeHtml, onUploadImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
    content: valueHtml || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChangeHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[420px] rounded-b-lg border border-t-0 border-border bg-background px-4 py-3 focus:outline-none",
      },
    },
  });

  // Sync external value changes (e.g. when loading a post)
  useEffect(() => {
    if (!editor) return;
    if (valueHtml !== editor.getHTML()) {
      editor.commands.setContent(valueHtml || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueHtml, editor]);

  if (!editor) return null;

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    try {
      const url = await onUploadImage(file);
      editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="rounded-lg">
      <Toolbar
        editor={editor}
        onPickImage={() => fileInputRef.current?.click()}
      />
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) await handleImageFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Toolbar({ editor, onPickImage }: { editor: Editor; onPickImage: () => void }) {
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground";
  const activeCls = "bg-muted text-foreground";

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-border bg-surface px-2 py-1.5">
      <ToolBtn label="Жирный" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Курсив" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolBtn>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolBtn label="Заголовок H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Заголовок H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolBtn>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolBtn label="Список" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Нумерованный список" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Цитата" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Код" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </ToolBtn>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolBtn
        label="Ссылка"
        active={editor.isActive("link")}
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("URL ссылки", prev ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Картинка" onClick={onPickImage}>
        <ImageIcon className="h-4 w-4" />
      </ToolBtn>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolBtn label="Отменить" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Повторить" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolBtn>
    </div>
  );

  function ToolBtn({
    children,
    onClick,
    active,
    label,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    label: string;
  }) {
    return (
      <button type="button" title={label} onClick={onClick} className={`${btn} ${active ? active : ""}`.trim()}>
        {children}
      </button>
    );
  }
}
