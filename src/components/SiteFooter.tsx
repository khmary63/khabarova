import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold tracking-tight">{SITE.brand}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Внедряем ИИ-сотрудников в продажи. Работаем с бизнесами Самары и всей России.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Контакты</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={SITE.phoneHref} className="hover:text-primary">{SITE.phone}</a> · <a href={SITE.whatsapp} className="hover:text-primary">WhatsApp</a></li>
            <li><a href={SITE.emailHref} className="hover:text-primary">{SITE.email}</a></li>
            <li><a href={SITE.telegram} target="_blank" rel="noreferrer" className="hover:text-primary">Telegram-канал</a></li>
            <li><a href={SITE.vk} target="_blank" rel="noreferrer" className="hover:text-primary">ВКонтакте</a></li>
            <li><a href={SITE.max} target="_blank" rel="noreferrer" className="hover:text-primary">Max</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Где мы</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Авито · 2ГИС — {SITE.city}</li>
            <li>Дистанционно — вся Россия</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} {SITE.brand}. {SITE.expert}.</div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/privacy" className="hover:text-primary">Политика конфиденциальности</Link>
            <span>·</span>
            <a href="/privacy-policy.pdf" target="_blank" rel="noreferrer" className="hover:text-primary">Скачать PDF</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
