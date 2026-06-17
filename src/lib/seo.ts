import type { Metadata } from "next";
import type { Company } from "@prisma/client";
import { getImpressumFields } from "@/lib/company";
import { getBaseUrl } from "@/lib/utils";

export const SEO_CONFIG = {
  siteName: "Tunc Automobile",
  defaultTitle: "Tunc Automobile | Premium Gebrauchtwagen Ahlen, Hamm, Beckum & Deutschland",
  titleTemplate: "%s | Tunc Automobile",
  defaultDescription:
    "Tunc Automobile in Ahlen — Ihr Premium-Autohändler für Gebrauchtwagen in Hamm, Beckum, NRW und deutschlandweit. Faire An- & Verkauf, Finanzierung und persönliche Beratung.",
  keywords: [
    "Gebrauchtwagen Ahlen",
    "Autohändler Ahlen",
    "Gebrauchtwagen Hamm",
    "Gebrauchtwagen Beckum",
    "Premium Gebrauchtwagen NRW",
    "Tunc Automobile",
    "Auto kaufen Ahlen",
    "Auto verkaufen Ahlen",
  ],
  locale: "de_DE",
  primaryCity: "Ahlen",
  nearbyCities: ["Hamm", "Beckum"] as const,
  region: "Nordrhein-Westfalen",
  country: "Deutschland",
  geo: {
    latitude: 51.7639,
    longitude: 7.8936,
  },
  localTagline:
    "Ihr Autohändler in Ahlen — Kunden aus Hamm, Beckum und ganz Deutschland willkommen",
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path: string): string {
  const base = getBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized === "/" ? "" : normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogType = "website",
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SEO_CONFIG.siteName)
    ? title
    : `${title} | ${SEO_CONFIG.siteName}`;

  return {
    title,
    description,
    keywords: [...SEO_CONFIG.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      locale: SEO_CONFIG.locale,
      url,
      siteName: SEO_CONFIG.siteName,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const pageMetadata = {
  home: {
    ...buildPageMetadata({
      title: SEO_CONFIG.defaultTitle,
      description: SEO_CONFIG.defaultDescription,
      path: "/",
    }),
    title: { absolute: SEO_CONFIG.defaultTitle },
  },
  vehicles: buildPageMetadata({
    title: "Gebrauchtwagen Ahlen, Hamm & Beckum",
    description:
      "Premium Gebrauchtwagen bei Tunc Automobile in Ahlen — durchsuchbare Auswahl für Kunden aus Hamm, Beckum, NRW und ganz Deutschland.",
    path: "/araclar",
  }),
  sell: buildPageMetadata({
    title: "Ankauf in Ahlen & Umgebung",
    description:
      "Fahrzeug-Ankauf bei Tunc Automobile in Ahlen — schnelle Bewertung und faire Angebote für Kunden aus Hamm, Beckum und deutschlandweit.",
    path: "/sat",
  }),
  about: buildPageMetadata({
    title: "Über uns — Autohaus in Ahlen",
    description:
      "Tunc Automobile in Ahlen: Premium Gebrauchtwagen, Transparenz und Service für Kunden aus Hamm, Beckum, NRW und ganz Deutschland.",
    path: "/hakkimizda",
  }),
  contact: buildPageMetadata({
    title: "Kontakt & Anfahrt Ahlen",
    description:
      "Kontaktieren Sie Tunc Automobile in Ahlen (Südstr. 48a) — erreichbar für Kunden aus Hamm, Beckum und deutschlandweit. Telefon, E-Mail & Karte.",
    path: "/iletisim",
  }),
  impressum: buildPageMetadata({
    title: "Impressum",
    description:
      "Impressum von Tunc Automobile, Serkan Tunc, Ahlen — Angaben gemäß § 5 TMG.",
    path: "/impressum",
  }),
  privacy: buildPageMetadata({
    title: "Datenschutz",
    description: "Datenschutzerklärung von Tunc Automobile in Ahlen.",
    path: "/datenschutz",
  }),
  visionMission: buildPageMetadata({
    title: "Vision & Mission",
    description:
      "Vision und Mission von Tunc Automobile — Premium Gebrauchtwagen aus Ahlen für Hamm, Beckum und Deutschland.",
    path: "/vizyon-misyon",
  }),
} satisfies Record<string, Metadata>;

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: SEO_CONFIG.defaultTitle,
      template: SEO_CONFIG.titleTemplate,
    },
    description: SEO_CONFIG.defaultDescription,
    keywords: [...SEO_CONFIG.keywords],
    openGraph: {
      type: "website",
      locale: SEO_CONFIG.locale,
      siteName: SEO_CONFIG.siteName,
      title: SEO_CONFIG.defaultTitle,
      description: SEO_CONFIG.defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: SEO_CONFIG.defaultTitle,
      description: SEO_CONFIG.defaultDescription,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: absoluteUrl("/") },
    icons: { icon: "/favicon.svg" },
  };
}

type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.siteName,
    url: absoluteUrl("/"),
    inLanguage: "de-DE",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/araclar")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildLocalBusinessJsonLd(company: Company | null) {
  const fields = getImpressumFields(company);
  const phone = fields.phone.replace(/\s/g, "");
  const formattedPhone = phone.startsWith("0")
    ? `+49${phone.slice(1)}`
    : phone.startsWith("+")
      ? phone
      : `+49${phone}`;

  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${absoluteUrl("/")}#business`,
    name: fields.name,
    description: SEO_CONFIG.defaultDescription,
    url: absoluteUrl("/"),
    telephone: formattedPhone,
    email: fields.email,
    image: absoluteUrl("/favicon.svg"),
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: fields.street,
      addressLocality: fields.city,
      postalCode: fields.postalCode,
      addressRegion: SEO_CONFIG.region,
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO_CONFIG.geo.latitude,
      longitude: SEO_CONFIG.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: SEO_CONFIG.primaryCity },
      ...SEO_CONFIG.nearbyCities.map((city) => ({ "@type": "City", name: city })),
      { "@type": "State", name: SEO_CONFIG.region },
      { "@type": "Country", name: SEO_CONFIG.country },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
  };
}

type VehicleJsonLdInput = {
  make: string;
  model: string;
  slug: string;
  year: number;
  price: string;
  firstRegistration: string | null;
  images: string[];
};

export function buildVehicleJsonLd(vehicle: VehicleJsonLdInput) {
  const name = `${vehicle.make} ${vehicle.model}`;
  const url = absoluteUrl(`/araclar/${vehicle.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.firstRegistration ?? String(vehicle.year),
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
      seller: {
        "@type": "AutoDealer",
        name: SEO_CONFIG.siteName,
        address: {
          "@type": "PostalAddress",
          addressLocality: SEO_CONFIG.primaryCity,
          addressRegion: SEO_CONFIG.region,
          addressCountry: "DE",
        },
      },
    },
    image: vehicle.images.map((img) => (img.startsWith("http") ? img : absoluteUrl(img))),
  };
}

export function vehicleMetaDescription(
  make: string,
  model: string,
  year: number,
  price: string
): string {
  return `${make} ${model} (${year}) für ${price} bei Tunc Automobile in Ahlen — auch für Kunden aus Hamm, Beckum und ganz Deutschland.`;
}

export function vehicleImageAlt(make: string, model: string, year: number): string {
  return `${make} ${model} ${year} — Gebrauchtwagen bei Tunc Automobile, Ahlen`;
}

export function buildVehiclePageMetadata(
  make: string,
  model: string,
  year: number,
  price: string,
  slug: string
): Metadata {
  const title = `${make} ${model} (${year})`;
  const description = vehicleMetaDescription(make, model, year, price);

  return {
    ...buildPageMetadata({ title, description, path: `/araclar/${slug}` }),
    openGraph: {
      type: "website",
      locale: SEO_CONFIG.locale,
      url: absoluteUrl(`/araclar/${slug}`),
      siteName: SEO_CONFIG.siteName,
      title: `${title} | ${SEO_CONFIG.siteName}`,
      description,
    },
  };
}
