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

const ITEMS: Item[] = [
  { label: "Telegram", href: SITE.telegram, Icon: TelegramIcon, track: "social_telegram" },
  { label: "ВКонтакте", href: SITE.vk, Icon: VkIcon, track: "social_vk" },
  { label: "Max", href: SITE.max, Icon: MaxIcon, track: "social_max" },
  { label: "YouTube", href: SITE.youtube, Icon: Youtube, track: "social_youtube" },
  { label: "RuTube", href: SITE.rutube, Icon: RuTubeIcon, track: "social_rutube" },
  { label: "Instagram", href: SITE.instagram, Icon: Instagram, track: "social_instagram" },
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
