import { Sparkles } from "lucide-react";
import { trackAiChatOpen } from "@/lib/eureka";

export function EurekaChatLauncher() {
  return (
    <button
      type="button"
      data-noya-open
      onClick={trackAiChatOpen}
      aria-label="Открыть ИИ-чат"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition hover:brightness-110 md:bottom-6 md:right-6"
    >
      <Sparkles className="h-4 w-4" strokeWidth={2} />
      <span className="hidden sm:inline">Поговорить с ИИ-продавцом</span>
      <span className="sm:hidden">ИИ-продавец</span>
    </button>
  );
}
