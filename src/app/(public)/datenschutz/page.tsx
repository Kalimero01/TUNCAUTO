import { getCompany } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.privacy;

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const company = await getCompany();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-light text-white">Datenschutzerklärung</h1>
      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-zinc-400">
        {company?.privacyPolicy ?? "Datenschutzerklärung wird in Kürze veröffentlicht."}
      </div>
    </div>
  );
}
