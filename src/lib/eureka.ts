// Управление виджетом Eureka (внешний чат-ассистент).
// Сам виджет монтируется в src/routes/__root.tsx.
export function openEurekaChat() {
  if (typeof window === "undefined") return;
  window.postMessage("open-na-widget", window.location.origin);
}
