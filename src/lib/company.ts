import type { Company } from "@prisma/client";

export type CompanyUpdateInput = {
  name?: unknown;
  owner?: unknown;
  street?: unknown;
  postalCode?: unknown;
  city?: unknown;
  address?: unknown;
  phone?: unknown;
  email?: unknown;
  taxId?: unknown;
  mapEmbedUrl?: unknown;
  impressum?: unknown;
  privacyPolicy?: unknown;
};

export type ImpressumFields = {
  name: string;
  owner: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  taxId: string;
};

const CREATE_DEFAULTS = {
  name: "Tunc Automobile",
  owner: "Serkan Tunc",
  street: "Südstr. 48a",
  postalCode: "59227",
  city: "Ahlen",
  address: "Südstr. 48a\n59227 Ahlen\nDeutschland",
  phone: "01787306033",
  email: "tuncautomobile2022@gmail.com",
  taxId: "DE349004935",
  impressum: "—",
  privacyPolicy: "—",
} as const;

function str(value: unknown): string {
  return value === undefined || value === null ? "" : String(value).trim();
}

function mapEmbed(value: unknown, fallback: string | null | undefined): string | null {
  if (value === undefined) return fallback ?? null;
  const s = str(value);
  return s.length > 0 ? s : null;
}

/** Compose multi-line address from street, postal code and city. */
export function formatAddress(street: string, postalCode: string, city: string): string {
  const lines = [street, [postalCode, city].filter(Boolean).join(" "), "Deutschland"].filter(
    (line) => line.trim().length > 0
  );
  return lines.join("\n");
}

/** Split stored address into street, postal code and city (best effort). */
export function splitAddress(address: string): { street: string; postalCode: string; city: string } {
  const lines = address
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.toLowerCase() !== "deutschland");

  if (lines.length === 0) {
    return { street: "", postalCode: "", city: "" };
  }

  if (lines.length === 1) {
    const match = lines[0].match(/^(\d{4,5})\s+(.+)$/);
    if (match) {
      return { street: "", postalCode: match[1], city: match[2] };
    }
    return { street: lines[0], postalCode: "", city: "" };
  }

  const street = lines[0];
  const rest = lines.slice(1).join(" ");
  const match = rest.match(/^(\d{4,5})\s+(.+)$/);
  if (match) {
    return { street, postalCode: match[1], city: match[2] };
  }

  return { street, postalCode: "", city: rest };
}

/** Extract impressum fields from a company row, falling back to parsed address. */
export function getImpressumFields(company: Company | null): ImpressumFields {
  if (!company) {
    return {
      name: CREATE_DEFAULTS.name,
      owner: CREATE_DEFAULTS.owner,
      street: CREATE_DEFAULTS.street,
      postalCode: CREATE_DEFAULTS.postalCode,
      city: CREATE_DEFAULTS.city,
      phone: CREATE_DEFAULTS.phone,
      email: CREATE_DEFAULTS.email,
      taxId: CREATE_DEFAULTS.taxId,
    };
  }

  const parsed = splitAddress(company.address);

  return {
    name: company.name,
    owner: company.owner || CREATE_DEFAULTS.owner,
    street: company.street || parsed.street,
    postalCode: company.postalCode || parsed.postalCode,
    city: company.city || parsed.city,
    phone: company.phone,
    email: company.email,
    taxId: company.taxId || CREATE_DEFAULTS.taxId,
  };
}

/** Build German Impressum text from structured fields. */
export function buildImpressum(fields: ImpressumFields): string {
  const lines = [
    "Angaben gemäß § 5 TMG",
    "",
    fields.name,
    fields.owner ? `Inhaber: ${fields.owner}` : "",
    fields.street,
    [fields.postalCode, fields.city].filter(Boolean).join(" "),
    "Deutschland",
    "",
    `Telefon: ${fields.phone}`,
    `E-Mail: ${fields.email}`,
    "",
    fields.taxId ? `USt-IdNr.: ${fields.taxId}` : "",
  ].filter((line) => line.length > 0);

  return lines.join("\n");
}

/** Merge partial admin payload with existing company row for validation. */
export function mergeCompanyUpdate(
  body: CompanyUpdateInput,
  existing: Company | null
): {
  name: string;
  owner: string;
  street: string;
  postalCode: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  mapEmbedUrl: string | null;
  impressum: string;
  privacyPolicy: string;
} {
  const base = existing ?? null;
  const parsed = splitAddress(base?.address ?? "");

  const street =
    body.street !== undefined
      ? str(body.street)
      : body.address !== undefined
        ? splitAddress(str(body.address)).street
        : (base?.street || parsed.street);
  const postalCode =
    body.postalCode !== undefined
      ? str(body.postalCode)
      : body.address !== undefined
        ? splitAddress(str(body.address)).postalCode
        : (base?.postalCode || parsed.postalCode);
  const city =
    body.city !== undefined
      ? str(body.city)
      : body.address !== undefined
        ? splitAddress(str(body.address)).city
        : (base?.city || parsed.city);

  const merged = {
    name: body.name !== undefined ? str(body.name) : (base?.name ?? ""),
    owner: body.owner !== undefined ? str(body.owner) : (base?.owner ?? ""),
    street,
    postalCode,
    city,
    address:
      body.address !== undefined
        ? str(body.address)
        : formatAddress(street, postalCode, city) || (base?.address ?? ""),
    phone: body.phone !== undefined ? str(body.phone) : (base?.phone ?? ""),
    email: body.email !== undefined ? str(body.email) : (base?.email ?? ""),
    taxId: body.taxId !== undefined ? str(body.taxId) : (base?.taxId ?? ""),
    mapEmbedUrl: mapEmbed(body.mapEmbedUrl, base?.mapEmbedUrl),
    impressum: body.impressum !== undefined ? str(body.impressum) : (base?.impressum ?? ""),
    privacyPolicy:
      body.privacyPolicy !== undefined ? str(body.privacyPolicy) : (base?.privacyPolicy ?? ""),
  };

  if (!base) {
    if (!merged.name) merged.name = CREATE_DEFAULTS.name;
    if (!merged.owner) merged.owner = CREATE_DEFAULTS.owner;
    if (!merged.street) merged.street = CREATE_DEFAULTS.street;
    if (!merged.postalCode) merged.postalCode = CREATE_DEFAULTS.postalCode;
    if (!merged.city) merged.city = CREATE_DEFAULTS.city;
    if (!merged.address) merged.address = CREATE_DEFAULTS.address;
    if (!merged.phone) merged.phone = CREATE_DEFAULTS.phone;
    if (!merged.email) merged.email = CREATE_DEFAULTS.email;
    if (!merged.taxId) merged.taxId = CREATE_DEFAULTS.taxId;
    if (!merged.impressum) merged.impressum = CREATE_DEFAULTS.impressum;
    if (!merged.privacyPolicy) merged.privacyPolicy = CREATE_DEFAULTS.privacyPolicy;
  }

  const impressumFields: ImpressumFields = {
    name: merged.name,
    owner: merged.owner,
    street: merged.street,
    postalCode: merged.postalCode,
    city: merged.city,
    phone: merged.phone,
    email: merged.email,
    taxId: merged.taxId,
  };

  if (
    body.impressum === undefined &&
    (body.name !== undefined ||
      body.owner !== undefined ||
      body.street !== undefined ||
      body.postalCode !== undefined ||
      body.city !== undefined ||
      body.address !== undefined ||
      body.phone !== undefined ||
      body.email !== undefined ||
      body.taxId !== undefined)
  ) {
    merged.impressum = buildImpressum(impressumFields);
    merged.address = formatAddress(merged.street, merged.postalCode, merged.city);
  }

  return merged;
}
