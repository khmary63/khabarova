// Управление аналитикой ИИ-чата (виджет NOYA AI).
// Сам виджет монтируется в src/routes/__root.tsx (custom element <noya-chat>),
// а открытие происходит по атрибуту data-noya-open на кнопке.
export function trackAiChatOpen() {
  if (typeof window === "undefined") return;
  try {
    (window as unknown as { ym?: (id: number, action: string, goal: string) => void }).ym?.(
      107882480,
      "reachGoal",
      "ai_chat_open",
    );
  } catch {
    // ignore
  }
}
