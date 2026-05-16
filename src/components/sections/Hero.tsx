import { ArrowRight, Sparkles } from "lucide-react";
import mariaHero from "@/assets/maria-hero-wide.jpg";
import { SITE, type VariantConfig } from "@/lib/site";

export function Hero({ config, onOpenChat }: { config: VariantConfig; onOpenChat: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#0a0d14]">
      {/* Full-bleed фоновое фото */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          src={mariaHero}
          alt=""
          className="h-full w-full object-cover object-[70%_center] md:object-[center_center]"
          fetchPriority="high"
        />
        {/* Слева — плотное затемнение под текст, справа — почти прозрачно (Мария видна) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] from-0% via-[#0a0d14]/85 via-35% to-[#0a0d14]/10 to-100%" />
        {/* Лёгкий vignette сверху и снизу для глубины и читаемости */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0d14]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0d14] to-transparent" />
        {/* На мобилке усиливаем затемнение, чтобы текст читался поверх фото */}
        <div className="absolute inset-0 bg-[#0a0d14]/55 md:hidden" />
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

          <h1 className="mt-6 font-display font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl [text-shadow:_0_2px_24px_rgb(10_13_20_/_0.6)] whitespace-pre-line text-5xl">
            {config.h1}
          </h1>

          <p className="mt-6 max-w-xl text-base text-white/80 [text-shadow:_0_1px_12px_rgb(10_13_20_/_0.5)] md:text-4xl">
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

          <div className="mt-10 flex items-center gap-4 text-xs text-white/60">
            <span>{SITE.expert} · {SITE.brand}</span>
            <span className="h-px w-8 bg-white/20" />
            <span>Самара · по всей России</span>
          </div>
        </div>
      </div>
    </section>
  );
}
