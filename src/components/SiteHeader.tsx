import { Link, useLoaderData } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  const rootData = useLoaderData({ from: "__root__" }) as
    | { apps?: boolean; blog?: boolean }
    | undefined;
  const settings = {
    apps: rootData?.apps ?? true,
    blog: rootData?.blog ?? true,
  };


  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="border-b border-border/40 bg-surface/40">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <a
            href={SITE.phoneHref}
            data-track="header_phone"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            {SITE.phone}
          </a>
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            <span>Менеджер на связи: пн–пт, 9:00–18:00 МСК</span>
          </div>
        </div>
      </div>
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label={`${SITE.brand} — ${SITE.expert}, ${SITE.city}`}>
          <img
            src={logo}
            alt={`${SITE.brand} — ${SITE.expert}`}
            className="h-14 w-auto object-contain brightness-125 contrast-110 drop-shadow-[0_0_12px_rgba(201,168,76,0.45)] md:h-16"
          />
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
          <Link to="/contacts" className="transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Контакты</Link>
        </nav>
        <a
          href="#lead"
          data-track="header_lead_audit"
          className="hidden rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/20 md:inline-flex"
        >
          Бесплатный ИИ-аудит
        </a>
      </div>
    </header>
  );
}
