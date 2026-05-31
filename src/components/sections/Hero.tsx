import { ArrowRight, Check, Sparkles, Calculator } from "lucide-react";
import { Link } from "@tanstack/react-router";
import mariaHero from "@/assets/maria-hero.jpg";
import { SITE, type VariantConfig } from "@/lib/site";

export function Hero({ config, onOpenChat }: { config: VariantConfig; onOpenChat: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* фоновое сияние */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"
      />
      <div className="container-page relative grid items-center gap-10 py-16 md:grid-cols-2 md:gap-12 md:py-24">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {config.badge}
          </div>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {config.h1}
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            {config.subhead}
          </p>

          <ul className="mt-7 space-y-3">
            {config.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm md:text-base">
                <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-sm border border-border bg-surface">
                  <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {config.source === "main" && (
            <div className="mt-7 rounded-xl border border-border bg-surface/60 p-5">
              <p className="text-sm font-semibold text-foreground">Для кого подходит:</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/msb"
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition hover:border-primary/50 hover:bg-primary/5"
                >
                  Я малый бизнес
                </Link>
                <Link
                  to="/b2b"
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition hover:border-primary/50 hover:bg-primary/5"
                >
                  Я отдел продаж B2B
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenChat}
              data-track="hero_open_chat"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              Поговорить с моим ИИ-продавцом
            </button>
            <Link
              to="/roi"
              data-track="hero_roi_calc"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20"
            >
              <Calculator className="h-4 w-4" strokeWidth={2} />
              Рассчитать ROI за 1 минуту
            </Link>
            <a
              href="#lead"
              data-track="hero_lead_form"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/10"
            >
              Оставить заявку
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Этот ИИ-продавец сам запишет вас на аудит — за 30 секунд.
          </p>

          <div className="mt-10 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Самара</span>
            <span className="h-px w-8 bg-border" />
            <span>Работаем по всей России</span>
          </div>
        </div>

        <div className="relative reveal" style={{ animationDelay: "0.1s" }}>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-surface">
            <img
              src={mariaHero}
              alt={`${SITE.expert} — эксперт по ИИ-автоматизации продаж, ${SITE.brand}, ${SITE.city}`}
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
            <div className="absolute inset-x-5 bottom-5">
              <div className="rounded-xl border border-border bg-background/85 p-4 backdrop-blur">
                <div className="font-display text-base font-semibold leading-tight">{SITE.expert}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Основатель {SITE.brand} · эксперт по ИИ-автоматизации
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-full border border-border bg-surface/40 md:block" />
        </div>
      </div>
    </section>
  );
}
