import { ArrowRight, Sparkles } from "lucide-react";
import mariaHero from "@/assets/maria-hero.jpg";
import { SITE, type VariantConfig } from "@/lib/site";

export function Hero({ config, onOpenChat }: { config: VariantConfig; onOpenChat: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#0a0d14]">
      {/* Фото справа — full-bleed подложка */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[55%]"
      >
        <img
          src={mariaHero}
          alt=""
          className="h-full w-full object-cover object-[center_top] md:object-[right_center]"
          fetchPriority="high"
        />
        {/* Затемнение слева → прозрачно справа */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/85 to-transparent md:from-[#0a0d14] md:via-[#0a0d14]/70 md:to-transparent" />
        {/* Лёгкое затемнение снизу для мобилки */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0d14] to-transparent md:hidden" />
      </div>

      {/* Тёплое сияние сверху-слева для глубины */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[160px]"
      />

      <div className="container-page relative py-20 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 md:text-xs">
            {config.badge}
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
            {config.h1}
          </h1>

          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            {config.subhead}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenChat}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              Поговорить с моим ИИ-продавцом
            </button>
            <a
              href="#lead"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:border-primary/40 hover:bg-primary/10"
            >
              Оставить заявку
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4 text-xs text-white/50">
            <span>{SITE.expert} · {SITE.brand}</span>
            <span className="h-px w-8 bg-white/20" />
            <span>Самара · по всей России</span>
          </div>
        </div>
      </div>
    </section>
  );
}
