import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { aiChat } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Здравствуйте! 👋 Я — ИИ-продавец Марии Хабаровой. Прямо сейчас вы видите, как я работаю.\n\nРасскажите коротко: чем занимается ваш бизнес и где сейчас «болит» в продажах? Подберу решение и запишу на бесплатный 30-минутный аудит к Марии.",
};

export function AiChat({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const send = useServerFn(aiChat);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: "Сеть подвела. Попробуйте ещё раз или оставьте заявку формой ниже." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-6 md:bottom-6 md:w-[400px]">
      <div className="flex h-[min(80vh,640px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-primary/20">
        <header className="flex items-center justify-between border-b border-border bg-background/60 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative grid h-9 w-9 place-items-center rounded-full bg-primary/15">
              <Bot className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">ИИ-продавец Марии</div>
              <div className="text-[11px] text-muted-foreground">Записывает в YClients · отвечает за 3 сек</div>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} aria-label="Закрыть чат" className="rounded-full p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-background"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 pl-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              ИИ печатает…
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border bg-background/60 p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишите сообщение…"
            maxLength={500}
            disabled={loading}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
            aria-label="Отправить"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}

export function AiChatLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition hover:brightness-110 md:bottom-6 md:right-6"
    >
      <Sparkles className="h-4 w-4" strokeWidth={2} />
      Поговорить с ИИ-продавцом
    </button>
  );
}
