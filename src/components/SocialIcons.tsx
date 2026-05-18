import { Youtube, Instagram } from "lucide-react";
import { SITE } from "@/lib/site";
import type { ComponentType, SVGProps } from "react";

// Иконки брендов без поддержки в lucide — простые inline SVG
const TelegramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.94 4.34 18.6 20.07c-.25 1.11-.91 1.39-1.84.86l-5.08-3.74-2.45 2.36c-.27.27-.5.5-1.02.5l.37-5.18 9.43-8.52c.41-.36-.09-.57-.63-.21L6.72 13.27 1.7 11.7c-1.09-.34-1.11-1.09.23-1.61L20.53 2.9c.91-.34 1.7.22 1.41 1.44Z" />
  </svg>
);

const VkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.84 17.43c-5.4 0-8.48-3.7-8.61-9.85h2.71c.09 4.52 2.08 6.43 3.66 6.82V7.58h2.55v3.9c1.56-.17 3.2-1.95 3.75-3.9h2.55c-.42 2.4-2.2 4.18-3.46 4.92 1.27.6 3.3 2.16 4.07 4.93h-2.8c-.6-1.88-2.1-3.34-4.11-3.54v3.54h-.31Z" />
  </svg>
);

const MaxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 19V5l5 8 5-8v14" />
    <path d="M16 19l5-7-5-7" />
  </svg>
);

type Item = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  track: string;
};

const RuTubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 8.4c.3-2.2 1.9-3.7 4-4C8.2 4 10 4 12 4s3.8 0 6 .1c2.1.3 3.7 1.8 4 4 .1 1.3.1 2.7.1 4s0 2.7-.1 4c-.3 2.2-1.9 3.7-4 4-2.2.1-4 .1-6 .1s-3.8 0-6-.1c-2.1-.3-3.7-1.8-4-4C1.9 13.1 1.9 11.7 2 10.4V8.4Zm8.5 6.1 5-2.1-5-2.1v4.2Z" />
  </svg>
);

const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5.01L2 22l5.08-1.33A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.54 0-2.98-.43-4.21-1.17l-.3-.18-3.06.8.82-2.98-.19-.3A7.95 7.95 0 014 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8zm4.24-5.83c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.64-.14-.22-.01-.35.1-.46.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41-.14 0-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01 0 1.18.86 2.32.98 2.5.12.18 1.7 2.6 4.12 3.63.57.25 1.02.39 1.37.5.58.19 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
  </svg>
);

const AvitoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2 20h4l1.5-3h9l1.5 3h4L12 2zm-2.5 12L12 8l2.5 6h-5z" />
  </svg>
);

const ITEMS: Item[] = [
  { label: "Telegram", href: SITE.telegram, Icon: TelegramIcon, track: "social_telegram" },
  { label: "ВКонтакте", href: SITE.vk, Icon: VkIcon, track: "social_vk" },
  { label: "WhatsApp", href: SITE.whatsapp, Icon: WhatsAppIcon, track: "social_whatsapp" },
  { label: "Max", href: SITE.max, Icon: MaxIcon, track: "social_max" },
  { label: "YouTube", href: SITE.youtube, Icon: Youtube, track: "social_youtube" },
  { label: "RuTube", href: SITE.rutube, Icon: RuTubeIcon, track: "social_rutube" },
  { label: "Instagram", href: SITE.instagram, Icon: Instagram, track: "social_instagram" },
  { label: "Avito", href: SITE.avito, Icon: AvitoIcon, track: "social_avito" },
];

type Props = {
  className?: string;
  size?: "sm" | "md";
  trackPrefix?: string;
};

export function SocialIcons({ className = "", size = "md", trackPrefix }: Props) {
  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const icon = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {ITEMS.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            title={item.label}
            data-track={trackPrefix ? `${trackPrefix}_${item.track}` : item.track}
            className={`inline-flex ${dim} items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary`}
          >
            <item.Icon className={icon} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
