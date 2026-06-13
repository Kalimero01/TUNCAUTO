import { describe, expect, it } from "vitest";
import { buildImpressum, getImpressumFields, mergeCompanyUpdate } from "@/lib/company";
import type { Company } from "@prisma/client";

const existing: Company = {
  id: "company",
  name: "TUNC AUTO",
  owner: "Max Mustermann",
  street: "Musterstraße 1",
  postalCode: "10115",
  city: "Berlin",
  address: "Musterstraße 1\n10115 Berlin\nDeutschland",
  phone: "+49 30 1",
  email: "info@tuncauto.com",
  taxId: "DE123456789",
  mapEmbedUrl: "https://maps.example/embed",
  logoFile: null,
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
    expect(merged.impressum).toContain("Neuer Name");
    expect(merged.impressum).toContain("kontakt@tuncauto.com");
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

    expect(merged.impressum).toContain("Shop");
    expect(merged.impressum).toContain("shop@test.de");
    expect(merged.privacyPolicy).toBe("—");
  });

  it("builds impressum from structured fields", () => {
    const text = buildImpressum({
      name: "Tunc Automobile",
      owner: "Serkan Tunc",
      street: "Südstr. 48a",
      postalCode: "59227",
      city: "Ahlen",
      phone: "01787306033",
      email: "tuncautomobile2022@gmail.com",
      taxId: "DE349004935",
    });

    expect(text).toContain("Tunc Automobile");
    expect(text).toContain("Inhaber: Serkan Tunc");
    expect(text).toContain("USt-IdNr.: DE349004935");
  });

  it("extracts impressum fields from company row", () => {
    const fields = getImpressumFields(existing);

    expect(fields.name).toBe("TUNC AUTO");
    expect(fields.owner).toBe("Max Mustermann");
    expect(fields.taxId).toBe("DE123456789");
  });

  it("regenerates impressum when legal fields change", () => {
    const merged = mergeCompanyUpdate(
      {
        owner: "Neuer Inhaber",
        taxId: "DE999999999",
      },
      existing
    );

    expect(merged.impressum).toContain("Neuer Inhaber");
    expect(merged.impressum).toContain("DE999999999");
  });
});
