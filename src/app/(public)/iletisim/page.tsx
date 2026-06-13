import { ContactInfoCard } from "@/components/contact/contact-info-card";
import { ContactMap } from "@/components/contact/contact-map";
import { PageHeroBackground } from "@/components/layout/page-hero-background";
import { getCompany } from "@/lib/cms";
import { MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.contact;

export const dynamic = "force-dynamic";

const OPENING_HOURS = [
  { days: "Montag – Freitag", hours: "09:00 – 18:00 Uhr" },
  { days: "Samstag", hours: "10:00 – 14:00 Uhr" },
  { days: "Sonntag", hours: "Geschlossen" },
] as const;

export default async function ContactPage() {
  const company = await getCompany();

  return (
    <div>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Kontakt", path: "/iletisim" },
        ])}
      />

      <PageHeroBackground
        imageSrc={MERCEDES_G_CLASS_BG}
        kicker="Kontakt"
        title="Kontakt"
        subtitle="Besuchen Sie uns in Ahlen oder kontaktieren Sie uns — wir betreuen Kunden aus Hamm, Beckum, NRW und deutschlandweit."
      />

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <ContactMap embedUrl={company?.mapEmbedUrl} address={company?.address} />

          <div className="flex min-w-0 flex-col gap-4">
            <ContactInfoCard label="Adresse">
              <p className="whitespace-pre-line leading-relaxed">{company?.address ?? "—"}</p>
            </ContactInfoCard>

            <ContactInfoCard label="Telefon">
              <a
                href={`tel:${company?.phone}`}
                className="link-hover text-lg text-metallic hover:text-white"
              >
                {company?.phone ?? "—"}
              </a>
            </ContactInfoCard>

            <ContactInfoCard label="E-Mail">
              <a
                href={`mailto:${company?.email}`}
                className="link-hover break-all text-lg text-metallic hover:text-white"
              >
                {company?.email ?? "—"}
              </a>
            </ContactInfoCard>

            <ContactInfoCard label="Öffnungszeiten">
              <ul className="space-y-2">
                {OPENING_HOURS.map((entry) => (
                  <li
                    key={entry.days}
                    className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center"
                  >
                    <span className="text-zinc-400">{entry.days}</span>
                    <span className="font-medium text-zinc-200">{entry.hours}</span>
                  </li>
                ))}
              </ul>
            </ContactInfoCard>
          </div>
        </div>
      </section>
    </div>
  );
}
