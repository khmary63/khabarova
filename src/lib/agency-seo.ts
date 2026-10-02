import { AGENCY_FAQ, DIRECTIONS, directionById, type Direction } from "./agency";
import {
  SITE_URL,
  ORG_ID,
  organizationSchema,
  personSchema,
  websiteSchema,
  breadcrumbSchema,
  faqSchema,
  caseStudiesItemList,
} from "./seo";
export const AGENCY_TITLE =
  "НейроМаркет — агентство ИИ-решений: контент, автоматизация, лидогенерация";
export const AGENCY_DESCRIPTION =
  "AI-креаторство, сайты и SMM, внедрение ИИ-сотрудников и автоматизация бизнеса, лидогенерация. Агентство НейроМаркет. Бесплатная консультация 30 минут.";
export function agencyHead(direction?: Direction) {
  const d = direction ? directionById(direction) : undefined;
  const title = d ? `${d.label} — ${d.price} | НейроМаркет` : AGENCY_TITLE;
  const description = d
    ? `${d.description} ${d.price}. Бесплатная консультация 30 минут.`
    : AGENCY_DESCRIPTION;
  const path = d?.path || "/";
  const url = SITE_URL + path;
  const services = (d ? [d] : DIRECTIONS).map((item) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${item.path}#service`,
    name: item.label,
    description: item.description,
    url: SITE_URL + item.path,
    provider: { "@id": ORG_ID },
    availableLanguage: "ru",
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      url: SITE_URL + item.path,
      description: `Стартовая стоимость ${item.price}. Итог по согласованному объёму работ.`,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: item.id === "leads" ? 60000 : 15000,
        priceCurrency: "RUB",
      },
    },
  }));
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "author", content: "НейроМаркет, Мария Хабарова" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      organizationSchema(),
      personSchema(),
      websiteSchema(),
      ...services,
      faqSchema(d?.faq || AGENCY_FAQ),
      breadcrumbSchema(
        d
          ? [
              { name: "Главная", path: "/" },
              { name: d.label, path: d.path },
            ]
          : [{ name: "Главная", path: "/" }],
      ),
      ...(!direction || direction === "automation" ? [caseStudiesItemList()] : []),
    ].map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema).replace(/</g, "\\u003c"),
    })),
  };
}
