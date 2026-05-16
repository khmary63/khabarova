import type { VariantConfig } from "@/lib/site";

export function Pains({ config }: { config: VariantConfig }) {
  return (
    <section className="border-b border-border py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Это про вас?
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Если узнали себя хотя бы в одном пункте — мы решаем эту задачу системно
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {config.pains.map((p, i) => (
            <div
              key={p.title}
              className="group relative rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong"
            >
              <div className="font-mono text-[11px] text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
