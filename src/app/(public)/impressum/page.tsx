import type { Metadata } from "next";
import { getCompany } from "@/lib/cms";
import { getImpressumFields } from "@/lib/company";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function ImpressumPage() {
  const company = await getCompany();
  const fields = getImpressumFields(company);

  if (!company) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-light text-white">Impressum</h1>
        <p className="mt-8 text-zinc-400">Impressum wird in Kürze veröffentlicht.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-light text-white">Impressum</h1>

      <section className="mt-8 space-y-8 text-zinc-400">
        <div>
          <h2 className="text-lg font-medium text-white">Angaben gemäß § 5 TMG</h2>
          <address className="mt-3 not-italic leading-relaxed">
            <p className="font-medium text-zinc-300">{fields.name}</p>
            {fields.owner && <p>Inhaber: {fields.owner}</p>}
            {fields.street && <p>{fields.street}</p>}
            {(fields.postalCode || fields.city) && (
              <p>
                {[fields.postalCode, fields.city].filter(Boolean).join(" ")}
              </p>
            )}
            <p>Deutschland</p>
          </address>
        </div>

        <div>
          <h2 className="text-lg font-medium text-white">Kontakt</h2>
          <dl className="mt-3 space-y-2">
            <div>
              <dt className="text-sm text-zinc-500">Telefon</dt>
              <dd>
                <a href={`tel:${fields.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {fields.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-500">E-Mail</dt>
              <dd>
                <a href={`mailto:${fields.email}`} className="hover:text-white">
                  {fields.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {fields.taxId && (
          <div>
            <h2 className="text-lg font-medium text-white">Umsatzsteuer-ID</h2>
            <p className="mt-3">USt-IdNr.: {fields.taxId}</p>
          </div>
        )}
      </section>
    </div>
  );
}
