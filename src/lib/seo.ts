// Общие SEO / GEO (Generative Engine Optimization) хелперы.
// Цель: единообразно отдавать ИИ-поисковикам (ChatGPT, Perplexity, Google AI Overviews,
// Яндекс Нейро, Bing Copilot) максимум структурированных фактов о бренде, эксперте,
// услугах, ценах и кейсах — чтобы попадать в цитаты.

import { SITE, CASES } from "./site";

export const SITE_URL = "https://neyromarket.com";

export const absUrl = (path: string) => {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.brand,
  alternateName: ["НейроМаркет | ИИ для бизнеса", "Neyromarket"],
  url: SITE_URL,
  email: SITE.email,
  telephone: SITE.phone,
  logo: absUrl("/favicon.png"),
  image: absUrl("/favicon.png"),
  founder: { "@id": PERSON_ID },
  founderName: SITE.expert,
  areaServed: [
    { "@type": "Country", name: "Россия" },
    { "@type": "AdministrativeArea", name: "СНГ" },
  ],
  knowsAbout: [
    "Внедрение ИИ-сотрудников в продажи",
    "ИИ-продавцы 24/7",
    "Нейроворонки",
    "Автоматизация продаж",
    "Чат-боты на LLM",
    "Интеграция с amoCRM и Bitrix24",
    "YCLIENTS онлайн-запись",
    "Вайбкодинг и MVP-разработка",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Ташкентская, 173",
    addressLocality: SITE.city,
    postalCode: "443125",
    addressCountry: "RU",
  },
  sameAs: [SITE.vk, SITE.telegram, SITE.youtube, SITE.instagram, SITE.rutube, SITE.avito],
});

export const personSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.expert,
  givenName: "Мария",
  familyName: "Хабарова",
  jobTitle: "Эксперт по внедрению ИИ-сотрудников в продажи",
  description:
    "Эксперт и основатель агентства НейроМаркет. Внедряет ИИ-продавцов, нейроворонки и автоматизацию отделов продаж в B2B и малом бизнесе. Самара, работает по всей России и СНГ.",
  url: SITE_URL,
  image: absUrl("/favicon.png"),
  worksFor: { "@id": ORG_ID },
  knowsAbout: [
    "ИИ-продавцы",
    "Нейроворонки",
    "Автоматизация отдела продаж",
    "Промпт-инжиниринг",
    "Вайбкодинг",
    "amoCRM",
    "Bitrix24",
    "YCLIENTS",
  ],
  knowsLanguage: ["ru"],
  sameAs: [SITE.vk, SITE.telegram, SITE.youtube, SITE.instagram, SITE.rutube],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE.brand,
  url: SITE_URL,
  inLanguage: "ru-RU",
  publisher: { "@id": ORG_ID },
});

export const breadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absUrl(it.path),
  })),
});

export const faqSchema = (items: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const serviceSchema = (opts: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  audience?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: opts.name,
  description: opts.description,
  url: absUrl(opts.url),
  serviceType: opts.serviceType,
  provider: { "@id": ORG_ID },
  areaServed: [
    { "@type": "Country", name: "Россия" },
    { "@type": "AdministrativeArea", name: "СНГ" },
  ],
  audience: opts.audience
    ? { "@type": "BusinessAudience", audienceType: opts.audience }
    : undefined,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "RUB",
    lowPrice: "35000",
    availability: "https://schema.org/InStock",
    url: absUrl(opts.url),
    eligibleRegion: { "@type": "Country", name: "Россия" },
  },
});

export const caseStudiesItemList = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Кейсы внедрения ИИ-сотрудников НейроМаркет",
  itemListElement: CASES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: c.niche,
      url: c.link,
      about: `${c.niche}, ${c.city}`,
      description: `Результат: ${c.metric} ${c.metricLabel}. Срок: ${c.term}.`,
    },
  })),
});
