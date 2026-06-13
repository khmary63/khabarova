import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAnalytics, type AnalyticsSummary } from "@/lib/analytics.functions";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Аналитика" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AnalyticsPage,
});

const TOKEN_KEY = "blog-admin-token";

function AnalyticsPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const fetchFn = useServerFn(getAnalytics);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) {
      setToken(t);
      load(t, days);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(t: string, d: number) {
    setLoading(true);
    try {
      const res = await fetchFn({ data: { token: t, days: d } });
      if (!res.ok) {
        toast.error(res.error);
        setAuthed(false);
        localStorage.removeItem(TOKEN_KEY);
        return;
      }
      setSummary(res.summary);
      setAuthed(true);
      localStorage.setItem(TOKEN_KEY, t);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  function onLogin(e: FormEvent) {
    e.preventDefault();
    load(token, days);
  }

  function onChangeDays(d: number) {
    setDays(d);
    if (authed) load(token, d);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Аналитика</h1>
          <Link to="/blog/admin" className="text-sm text-muted-foreground hover:text-foreground">
            ← Админка блога
          </Link>
        </div>

        {!authed ? (
          <form onSubmit={onLogin} className="max-w-md space-y-3 rounded-2xl border border-border bg-surface p-6">
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">
              Пароль администратора
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Загружаем…" : "Войти"}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Период:</span>
              {[7, 14, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChangeDays(d)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    days === d
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {d} дн.
                </button>
              ))}
              <button
                type="button"
                onClick={() => load(token, days)}
                disabled={loading}
                className="ml-auto rounded-full border border-border bg-surface px-4 py-1.5 text-sm transition hover:border-primary/40 disabled:opacity-60"
              >
                {loading ? "Обновляем…" : "Обновить"}
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(TOKEN_KEY);
                  setAuthed(false);
                  setToken("");
                  setSummary(null);
                }}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted-foreground transition hover:border-primary/40"
              >
                Выйти
              </button>
            </div>

            {summary && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Stat label="Просмотров страниц" value={summary.totals.views} />
                  <Stat label="Кликов по плашкам" value={summary.totals.clicks} />
                  <Stat label="Уникальных сессий" value={summary.totals.sessions} />
                </div>

                <Section title="Клики: блог / приложения / всего">
                  <ClicksBreakdown byPage={summary.byPage} total={summary.totals.clicks} />
                </Section>

                <Section title="По дням">
                  <DailyChart data={summary.byDay} />
                </Section>

                <Section title="По страницам">
                  <PagesTable data={summary.byPage} />
                </Section>

                <Section title="По плашкам (что нажимают)">
                  <ClicksTable data={summary.byClick} />
                </Section>

                <Section title="Последние клики">
                  <RecentTable data={summary.recentClicks} />
                </Section>
              </>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold">{value.toLocaleString("ru-RU")}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DailyChart({ data }: { data: { day: string; views: number; clicks: number }[] }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.views, d.clicks)));
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 overflow-x-auto pb-2">
        {data.map((d) => (
          <div key={d.day} className="flex min-w-[28px] flex-col items-center gap-1">
            <div className="flex h-32 items-end gap-0.5">
              <div
                title={`${d.views} просмотров`}
                className="w-2.5 rounded-t bg-primary/70"
                style={{ height: `${(d.views / max) * 100}%` }}
              />
              <div
                title={`${d.clicks} кликов`}
                className="w-2.5 rounded-t bg-success/80"
                style={{ height: `${(d.clicks / max) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground">{d.day.slice(5)}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-primary/70" /> Просмотры
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-success/80" /> Клики
        </span>
      </div>
    </div>
  );
}

function PagesTable({ data }: { data: { path: string; views: number; clicks: number; conversion: number }[] }) {
  if (!data.length) return <p className="text-sm text-muted-foreground">Нет данных за период.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
            <th className="py-2">Страница</th>
            <th className="py-2 text-right">Просмотры</th>
            <th className="py-2 text-right">Клики</th>
            <th className="py-2 text-right">Конверсия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.path} className="border-b border-border/40">
              <td className="py-2 font-mono text-xs">{r.path}</td>
              <td className="py-2 text-right">{r.views}</td>
              <td className="py-2 text-right">{r.clicks}</td>
              <td className="py-2 text-right font-semibold text-primary">{r.conversion}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClicksBreakdown({
  byPage,
  total,
}: {
  byPage: { path: string; views: number; clicks: number; conversion: number }[];
  total: number;
}) {
  const blog = byPage
    .filter((p) => p.path === "/blog" || p.path.startsWith("/blog/"))
    .reduce((s, p) => s + p.clicks, 0);
  const apps = byPage
    .filter((p) => p.path === "/apps" || p.path.startsWith("/apps/"))
    .reduce((s, p) => s + p.clicks, 0);

  const bars = [
    { label: "Блог", value: blog, color: "bg-primary/70" },
    { label: "Приложения", value: apps, color: "bg-success/80" },
    { label: "Всего", value: total, color: "bg-foreground/60" },
  ];
  const max = Math.max(1, ...bars.map((b) => b.value));

  if (total === 0) return <p className="text-sm text-muted-foreground">Пока нет кликов за период.</p>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {bars.map((b) => (
          <div key={b.label} className="rounded-xl border border-border bg-background p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{b.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold">
              {b.value.toLocaleString("ru-RU")}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-sm text-muted-foreground">{b.label}</div>
            <div className="h-6 flex-1 overflow-hidden rounded-full bg-border/40">
              <div
                className={`h-full rounded-full ${b.color}`}
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </div>
            <div className="w-12 shrink-0 text-right text-sm font-semibold">{b.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



function ClicksTable({ data }: { data: { path: string; label: string; clicks: number }[] }) {
  if (!data.length) return <p className="text-sm text-muted-foreground">Пока никто не кликал.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
            <th className="py-2">Страница</th>
            <th className="py-2">Плашка</th>
            <th className="py-2 text-right">Кликов</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={`${r.path}_${r.label}_${i}`} className="border-b border-border/40">
              <td className="py-2 font-mono text-xs">{r.path}</td>
              <td className="py-2">{r.label}</td>
              <td className="py-2 text-right font-semibold">{r.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentTable({
  data,
}: {
  data: { path: string; label: string; target: string | null; created_at: string }[];
}) {
  if (!data.length) return <p className="text-sm text-muted-foreground">Ещё нет кликов.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
            <th className="py-2">Когда</th>
            <th className="py-2">Страница</th>
            <th className="py-2">Плашка</th>
            <th className="py-2">Куда</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-b border-border/40">
              <td className="py-2 text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleString("ru-RU")}
              </td>
              <td className="py-2 font-mono text-xs">{r.path}</td>
              <td className="py-2">{r.label}</td>
              <td className="py-2 truncate text-xs text-muted-foreground" style={{ maxWidth: 240 }}>
                {r.target ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
