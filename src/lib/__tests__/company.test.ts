import { describe, expect, it } from "vitest";
import { mergeCompanyUpdate } from "@/lib/company";
import type { Company } from "@prisma/client";

const existing: Company = {
  id: "company",
  name: "TUNC AUTO",
  address: "Berlin",
  phone: "+49 30 1",
  email: "info@tuncauto.com",
  mapEmbedUrl: "https://maps.example/embed",
  impressum: "Impressum text",
  privacyPolicy: "Privacy text",
  updatedAt: new Date(),
};

describe("mergeCompanyUpdate", () => {
  it("keeps legal fields when updating contact only", () => {
    const merged = mergeCompanyUpdate(
      {
        name: "Neuer Name",
        address: "Hamburg",
        phone: "+49 40 2",
        email: "kontakt@tuncauto.com",
        mapEmbedUrl: "",
      },
      existing
    );

    expect(merged.name).toBe("Neuer Name");
    expect(merged.impressum).toBe("Impressum text");
    expect(merged.privacyPolicy).toBe("Privacy text");
    expect(merged.mapEmbedUrl).toBeNull();
  });

  it("keeps contact fields when updating legal only", () => {
    const merged = mergeCompanyUpdate(
      {
        impressum: "Neues Impressum",
        privacyPolicy: "Neue Datenschutz",
      },
      existing
    );

    expect(merged.name).toBe("TUNC AUTO");
    expect(merged.impressum).toBe("Neues Impressum");
  });

  it("applies defaults on first create with contact fields only", () => {
    const merged = mergeCompanyUpdate(
      {
        name: "Shop",
        address: "Street 1",
        phone: "123",
        email: "shop@test.de",
      },
      null
    );

    expect(merged.impressum).toBe("—");
    expect(merged.privacyPolicy).toBe("—");
  });
});
