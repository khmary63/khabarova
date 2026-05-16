import { CASES, type VariantConfig } from "@/lib/site";

export function Cases({ config }: { config: VariantConfig }) {
  const ordered = config.caseOrder.map((i) => CASES[i]);
  return (
    <section id="cases" className="border-b border-border py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Кейсы</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Конкретные цифры до и после внедрения
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Покупают доверие, а не услугу. Поэтому без иллюстраций — только то, что реально измерили.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {ordered.map((c) => (
            <article
              key={c.niche}
              className="grid gap-6 rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong md:grid-cols-[1fr_2fr_auto] md:p-8"
            >
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {c.city}
                </div>
                <div className="mt-2 font-display text-xl font-semibold leading-tight">
                  {c.niche}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
                  Срок: {c.term}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-destructive/80">До</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.before}</p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-primary">После</div>
                  <p className="mt-2 text-sm leading-relaxed">{c.after}</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center md:items-end md:text-right">
                <div className="num font-display text-4xl font-semibold tracking-tight text-primary md:text-5xl">
                  {c.metric}
                </div>
                <div className="mt-1 max-w-[140px] text-xs text-muted-foreground">
                  {c.metricLabel}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
