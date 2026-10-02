import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
const links = [
  ["/#directions", "Направления"],
  ["/#cases", "Кейсы"],
  ["/#demo", "Демо"],
  ["/#about", "О Марии"],
  ["/roi", "Калькулятор ROI"],
  ["/apps", "Портфолио"],
  ["/blog", "Блог"],
  ["/reviews", "Отзывы"],
  ["/contacts", "Контакты"],
];
export function AgencyHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="agency-header">
      <a className="agency-skip" href="#main-content">
        Перейти к содержанию
      </a>
      <div className="agency-container agency-topbar">
        <span>ИИ-решения для бизнеса</span>
        <a href={SITE.phoneHref} data-track="agency_phone">
          {SITE.phone}
        </a>
      </div>
      <div className="agency-container agency-navbar">
        <a href="/" className="agency-brand" aria-label="НейроМаркет — главная">
          <img src="/agency-brand.webp" width="44" height="44" alt="" />
          <span>
            НейроМаркет<small>Агентство ИИ-решений</small>
          </span>
        </a>
        <nav className="agency-desktop-nav" aria-label="Основная навигация">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <button
          className="agency-menu-button"
          aria-controls="agency-mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="agency-mobile-menu"
          className="agency-mobile-nav agency-container"
          aria-label="Мобильная навигация"
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href="/#lead" onClick={() => setOpen(false)}>
            Консультация 30 минут
          </a>
        </nav>
      )}
    </header>
  );
}
