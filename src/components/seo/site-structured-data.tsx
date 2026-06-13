import { getCompany } from "@/lib/cms";
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export async function SiteStructuredData() {
  const company = await getCompany();

  return (
    <JsonLd data={[buildLocalBusinessJsonLd(company), buildWebSiteJsonLd()]} />
  );
}
