import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.probefahrt;

export default function ProbefahrtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Probefahrt", path: "/probefahrt" },
        ])}
      />
      {children}
    </>
  );
}
