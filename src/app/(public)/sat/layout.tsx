import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.sell;

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Ankauf", path: "/sat" },
        ])}
      />
      {children}
    </>
  );
}
