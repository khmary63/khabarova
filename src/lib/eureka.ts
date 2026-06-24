// Управление аналитикой и открытием ИИ-чата (виджет NOYA AI).
// Сам виджет монтируется в src/routes/__root.tsx (custom element <noya-chat>),
// а открытие происходит по клику на элементе с атрибутом data-noya-open.
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

// Программно открыть чат NOYA: кликаем по любому элементу с data-noya-open
// (виджет слушает клики по таким элементам глобально).
export function openEurekaChat() {
  if (typeof window === "undefined") return;
  trackAiChatOpen();
  const trigger = document.querySelector<HTMLElement>("[data-noya-open]");
  if (trigger) {
    trigger.click();
  }
}
