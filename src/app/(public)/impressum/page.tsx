import type { Metadata } from "next";
import { getCompany } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function ImpressumPage() {
  const company = await getCompany();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-light text-white">Impressum</h1>
      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-zinc-400">
        {company?.impressum ?? "Impressum wird in Kürze veröffentlicht."}
      </div>
    </div>
  );
}
