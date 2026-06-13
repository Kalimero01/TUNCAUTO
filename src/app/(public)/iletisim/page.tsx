import { getCompany } from "@/lib/cms";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.contact;

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const company = await getCompany();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Kontakt", path: "/iletisim" },
        ])}
      />
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-metallic">Kontakt</p>
        <h1 className="mt-4 text-3xl font-light text-white">Kontakt</h1>
        <p className="mt-4 text-zinc-400">
          Besuchen Sie uns in Ahlen oder kontaktieren Sie uns — wir betreuen Kunden aus Hamm,
          Beckum, NRW und deutschlandweit.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Adresse</h2>
            <p className="mt-3 whitespace-pre-line text-zinc-300">{company?.address ?? "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Telefon</h2>
            <a href={`tel:${company?.phone}`} className="link-hover mt-3 block text-metallic hover:text-white">
              {company?.phone ?? "—"}
            </a>
          </div>
          <div>
            <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">E-Mail</h2>
            <a href={`mailto:${company?.email}`} className="link-hover mt-3 block text-metallic hover:text-white">
              {company?.email ?? "—"}
            </a>
          </div>
        </div>

        {company?.mapEmbedUrl && (
          <div className="overflow-hidden rounded-sm border border-zinc-800">
            <iframe
              src={company.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          </div>
        )}
      </div>
    </div>
  );
}
