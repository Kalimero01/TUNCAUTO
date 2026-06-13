import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildWebSiteJsonLd,
  vehicleImageAlt,
  vehicleMetaDescription,
} from "@/lib/seo";

describe("seo helpers", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/araclar")).toMatch(/\/araclar$/);
  });

  it("builds breadcrumb JSON-LD", () => {
    const data = buildBreadcrumbJsonLd([
      { name: "Startseite", path: "/" },
      { name: "Fahrzeuge", path: "/araclar" },
    ]);
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(2);
  });

  it("builds local business JSON-LD with Ahlen address", () => {
    const data = buildLocalBusinessJsonLd(null);
    expect(data["@type"]).toBe("AutoDealer");
    expect(data.address.addressLocality).toBe("Ahlen");
    expect(data.areaServed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Hamm" }),
        expect.objectContaining({ name: "Beckum" }),
      ])
    );
  });

  it("builds website JSON-LD with search action", () => {
    const data = buildWebSiteJsonLd();
    expect(data["@type"]).toBe("WebSite");
    expect(data.potentialAction["@type"]).toBe("SearchAction");
  });

  it("builds vehicle meta description with region", () => {
    const description = vehicleMetaDescription("BMW", "320i", 2020, "25.000 €");
    expect(description).toContain("Ahlen");
    expect(description).toContain("Hamm");
    expect(description).toContain("BMW 320i");
  });

  it("builds descriptive vehicle image alt text", () => {
    expect(vehicleImageAlt("Audi", "A4", 2019)).toContain("Ahlen");
  });
});
