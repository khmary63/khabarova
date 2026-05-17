// Управление виджетом Eureka (внешний чат-ассистент).
// Сам виджет монтируется в src/routes/__root.tsx.
export function openEurekaChat() {
  if (typeof window === "undefined") return;
  window.postMessage("open-na-widget", "*");
  // Yandex.Metrika goal
  try {
    (window as unknown as { ym?: (id: number, action: string, goal: string) => void }).ym?.(
      107882480,
      "reachGoal",
      "eureka_open",
    );
  } catch {
    // ignore
  }
}
