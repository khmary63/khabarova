import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  extractYoutubeId,
  getPortfolioMediaKind,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from "@/lib/portfolio-media";

type Props = {
  images: string[];
  layout?: "web" | "mobile";
  title: string;
  tag?: string;
};

function MediaFrame({
  src,
  title,
  alt,
  className,
  mode,
}: {
  src: string;
  title: string;
  alt: string;
  className: string;
  mode: "preview" | "lightbox";
}) {
  const kind = getPortfolioMediaKind(src);
  const ytId = extractYoutubeId(src);

  if (kind === "youtube" && ytId) {
    if (mode === "preview") {
      return (
        <div className={`relative ${className}`}>
          <img
            src={youtubeThumbnailUrl(ytId)}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-white shadow-lg">
              <Play className="h-7 w-7 fill-current pl-0.5" />
            </span>
          </span>
        </div>
      );
    }
    return (
      <iframe
        src={youtubeEmbedUrl(ytId, { autoplay: true })}
        title={title}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  if (kind === "file-video") {
    return (
      <video
        src={src}
        className={className}
        muted={mode === "preview"}
        loop={mode === "preview"}
        autoPlay
        controls={mode === "lightbox"}
        playsInline
        preload="auto"
      />
    );
  }

  return <img src={src} alt={alt} className={className} loading={mode === "preview" ? "lazy" : undefined} />;
}

export function PortfolioGallery({ images, layout = "web", title, tag }: Props) {
  const list = images.length ? images : [];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);

  const count = list.length;
  const isMobile = layout === "mobile";
  const aspect = isMobile ? "aspect-[9/16]" : "aspect-[16/10]";
  const current = list[index] || "";
  const currentKind = getPortfolioMediaKind(current);

  const go = useCallback(
    (dir: number) => {
      if (count === 0) return;
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  // On phones a desktop screenshot is unreadable at screen width: open it zoomed (pan with a finger).
  useEffect(() => {
    if (!open) return;
    setZoom(window.innerWidth < 640 && !isMobile && getPortfolioMediaKind(list[index] || "") === "image");
  }, [open, index, isMobile, list]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  if (count === 0) {
    return (
      <div
        className={`flex ${aspect} w-full items-center justify-center rounded-2xl bg-neutral-900 text-xs text-muted-foreground`}
      >
        Нет медиа
      </div>
    );
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const mediaClass = `h-full w-full ${isMobile ? "object-contain" : "object-cover object-top"}`;
  const lightboxMediaClass = isMobile
    ? "max-h-[82vh] w-auto min-w-[min(70vw,320px)] rounded-[1.7rem] object-contain"
    : currentKind === "youtube"
      ? "aspect-video h-auto max-h-[85vh] w-[min(92vw,960px)] rounded-xl bg-black shadow-2xl"
      : "max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl";

  return (
    <>
      {/* Preview carousel */}
      <div className="group/gal relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative block ${aspect} w-full overflow-hidden rounded-2xl bg-neutral-900`}
          aria-label={`Открыть галерею: ${title}`}
        >
          <MediaFrame
            src={current}
            title={`${title} — видео`}
            alt={`${title} — экран ${index + 1}`}
            className={`${mediaClass}${currentKind === "image" ? " transition-transform duration-500 group-hover/gal:scale-[1.02]" : ""}`}
            mode="preview"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {tag && (
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
              {tag}
            </span>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
            {index + 1} / {count}
          </span>
          <span
            aria-hidden
            className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white backdrop-blur md:hidden"
          >
            <ZoomIn className="h-4 w-4" />
          </span>
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Назад"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-100 backdrop-blur transition-opacity hover:bg-black/70 md:opacity-0 md:group-hover/gal:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Вперёд"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-100 backdrop-blur transition-opacity hover:bg-black/70 md:opacity-0 md:group-hover/gal:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Экран ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`relative h-1.5 rounded-full transition-all after:absolute after:-inset-2 after:content-[''] ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
            {index + 1} / {count}
          </span>

          {!isMobile && currentKind === "image" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => !z);
              }}
              aria-label={zoom ? "Уменьшить" : "Увеличить"}
              className="absolute left-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:hidden"
            >
              {zoom ? <ZoomOut className="h-6 w-6" /> : <ZoomIn className="h-6 w-6" />}
            </button>
          )}

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Назад"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 md:left-6"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          )}

          <div
            className="flex max-h-full max-w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={zoom ? undefined : onTouchStart}
            onTouchEnd={zoom ? undefined : onTouchEnd}
          >
            {!isMobile && zoom && currentKind === "image" ? (
              <div className="max-h-[78vh] max-w-[96vw] overflow-auto rounded-xl bg-black shadow-2xl">
                <img
                  src={current}
                  alt={`${title} — экран ${index + 1}`}
                  className="h-auto w-[210vw] max-w-none"
                />
              </div>
            ) : isMobile ? (
              <div className="relative overflow-hidden rounded-[2.2rem] border-[6px] border-neutral-800 bg-black shadow-2xl">
                <MediaFrame
                  src={current}
                  title={`${title} — видео`}
                  alt={`${title} — экран ${index + 1}`}
                  className={lightboxMediaClass}
                  mode="lightbox"
                />
              </div>
            ) : (
              <MediaFrame
                src={current}
                title={`${title} — видео`}
                alt={`${title} — экран ${index + 1}`}
                className={lightboxMediaClass}
                mode="lightbox"
              />
            )}
          </div>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Вперёд"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 md:right-6"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
