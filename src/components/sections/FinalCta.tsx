import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

const LINKS = [
  { label: SITE.phone, href: SITE.phoneHref, sub: "Звонок или WhatsApp — отвечаем в течение дня", track: "final_phone" },
  { label: "Telegram-канал", href: SITE.telegram, sub: "Канал Марии — кейсы и разборы", track: "final_telegram" },
  { label: "ВКонтакте", href: SITE.vk, sub: "Основная площадка НейроМаркет", track: "final_vk" },
  { label: "Max", href: SITE.max, sub: "Бизнес-канал в Max", track: "final_max" },
  { label: SITE.email, href: SITE.emailHref, sub: "Email для подробных запросов", track: "final_email" },
];

export function FinalCta() {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-[120px]"
          />
          <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Работаем с бизнесами Самары и всей России
              </h2>
              <p className="mt-4 max-w-lg text-sm text-muted-foreground">
                Подписывайтесь, читайте кейсы и пишите напрямую — отвечаем быстро, как наш ИИ-продавец.
              </p>
              <a
                href="#lead"
                data-track="final_lead_audit"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Получить бесплатный ИИ-аудит
              </a>
            </div>
            <div className="space-y-3">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  data-track={l.track}
                  className="group flex items-center justify-between rounded-xl border border-border bg-background p-4 transition hover:border-primary/40"
                >
                  <div>
                    <div className="font-display text-base font-semibold">{l.label}</div>
                    <div className="text-xs text-muted-foreground">{l.sub}</div>
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
