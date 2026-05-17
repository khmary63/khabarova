import { Link, useRouteContext, useLoaderData } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  // Read site settings injected by the root loader. Falls back to true if missing.
  let settings: { apps: boolean; blog: boolean } = { apps: true, blog: true };
  try {
    const data = useLoaderData({ from: "__root__" }) as { apps?: boolean; blog?: boolean } | undefined;
    if (data) settings = { apps: data.apps ?? true, blog: data.blog ?? true };
  } catch {
    // useLoaderData throws if used outside a matched route — keep defaults
  }
  // Touch useRouteContext to avoid unused-import lint if needed elsewhere
  void useRouteContext;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt={SITE.brand} className="h-9 w-9 rounded-md object-contain" />
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-tight">{SITE.brand}</div>
            <div className="text-[11px] text-muted-foreground">{SITE.expert} · {SITE.city}</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="/#cases" className="transition hover:text-foreground">Кейсы</a>
          <a href="/#demo" className="transition hover:text-foreground">Демо</a>
          <a href="/#about" className="transition hover:text-foreground">О Марии</a>
          {settings.apps && (
            <Link to="/apps" className="transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Приложения</Link>
          )}
          {settings.blog && (
            <Link to="/blog" className="transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Блог</Link>
          )}
        </nav>
        <a
          href="#lead"
          className="hidden rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/20 md:inline-flex"
        >
          Бесплатный ИИ-аудит
        </a>
      </div>
    </header>
  );
}
