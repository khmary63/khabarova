export function StickyMobileCta({ onOpenChat }: { onOpenChat?: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      {onOpenChat ? (
        <button
          type="button"
          onClick={onOpenChat}
          className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30"
        >
          Поговорить с ИИ-продавцом
        </button>
      ) : (
        <a
          href="#lead"
          className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30"
        >
          Получить бесплатный ИИ-аудит
        </a>
      )}
    </div>
  );
}
