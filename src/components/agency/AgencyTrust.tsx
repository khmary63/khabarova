import atom from "@/assets/partners/atom.png";
import academy from "@/assets/partners/academy.jpg";
import okhota from "@/assets/partners/okhota.webp";
import neuroagents from "@/assets/partners/neuroagents.png";
import boreychuk from "@/assets/partners/boreychuk.webp";
import polishuk from "@/assets/partners/polishuk.webp";
import { trackAgency } from "@/lib/agency-tracking";

type Card = {
  name: string;
  note: string;
  href: string;
  logo?: string;
  light?: boolean;
  /** Portrait: fill the tile instead of fitting a logo. */
  photo?: boolean;
  /** Link carries a referral code. */
  referral?: boolean;
};
const partners: Card[] = [
  {
    name: "АО «АТОМ формула ИИ»",
    note: "Информационно-технологическая компания, резидент Сколково",
    href: "https://getatom.ru/start?ref=XXS5GK6E",
    logo: atom,
    referral: true,
  },
  {
    name: "ООО «Академия Интернет-Маркетинга»",
    note: "Партнёр",
    href: "https://fabrikaklonov.ru/?gcpc=b0579",
    logo: academy,
    light: true,
    referral: true,
  },
  {
    name: "Neuroagents",
    note: "IT-проект",
    href: "https://noya-ai.ru/?ref=NK9PE9EA",
    logo: neuroagents,
    light: true,
    referral: true,
  },
  {
    name: "Дмитрий Борейчук",
    note: "Маркетолог, предприниматель, основатель Wake up Marketing",
    href: "https://wake-up-marketing.ru/",
    logo: boreychuk,
    photo: true,
  },
  {
    name: "Михаил Полищук",
    note: "Блогер, автор образовательных продуктов в нише AI-контента",
    href: "https://www.youtube.com/@polishuk01",
    logo: polishuk,
    photo: true,
  },
];
const clients: Card[] = [
  {
    name: "Ресторан «Охота»",
    note: "г. Салехард",
    href: "https://vk.ru/rest_oxota",
    logo: okhota,
  },
];

function Item({ c }: { c: Card }) {
  return (
    <a
      className="nm-trust-card"
      href={c.href}
      target="_blank"
      rel={c.referral ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      onClick={() => trackAgency("agency_partner_open", { partner: c.name })}
    >
      {c.logo ? (
        <span className={`nm-trust-logo${c.light ? " is-light" : ""}${c.photo ? " is-photo" : ""}`}>
          <img src={c.logo} alt={c.photo ? c.name : ""} loading="lazy" />
        </span>
      ) : (
        <span className="nm-trust-logo nm-trust-initial" aria-hidden="true">
          {c.name.trim()[0]}
        </span>
      )}
      <span>
        <b>{c.name}</b>
        <small>{c.note}</small>
      </span>
    </a>
  );
}

/** Partners and clients, as provided by the owner. No metrics or claims beyond their own descriptions. */
export function AgencyTrust() {
  return (
    <section id="partners" className="agency-section nm-trust">
      <div className="agency-container">
        <p className="agency-eyebrow">С кем мы работаем</p>
        <h2>Партнёры и клиенты</h2>
        <h3 className="nm-trust-label">Партнёры</h3>
        <div className="nm-trust-grid">
          {partners.map((c) => (
            <Item key={c.name} c={c} />
          ))}
        </div>
        <h3 className="nm-trust-label">Клиенты</h3>
        <div className="nm-trust-grid">
          {clients.map((c) => (
            <Item key={c.name} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
