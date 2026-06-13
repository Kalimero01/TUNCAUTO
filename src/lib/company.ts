import type { Company } from "@prisma/client";

export type CompanyUpdateInput = {
  name?: unknown;
  address?: unknown;
  phone?: unknown;
  email?: unknown;
  mapEmbedUrl?: unknown;
  impressum?: unknown;
  privacyPolicy?: unknown;
};

const CREATE_DEFAULTS = {
  name: "TUNC AUTO",
  address: "—",
  phone: "—",
  email: "info@tuncauto.com",
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

/** Merge partial admin payload with existing company row for validation. */
export function mergeCompanyUpdate(
  body: CompanyUpdateInput,
  existing: Company | null
): {
  name: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string | null;
  impressum: string;
  privacyPolicy: string;
} {
  const base = existing ?? null;

  const merged = {
    name: body.name !== undefined ? str(body.name) : (base?.name ?? ""),
    address: body.address !== undefined ? str(body.address) : (base?.address ?? ""),
    phone: body.phone !== undefined ? str(body.phone) : (base?.phone ?? ""),
    email: body.email !== undefined ? str(body.email) : (base?.email ?? ""),
    mapEmbedUrl: mapEmbed(body.mapEmbedUrl, base?.mapEmbedUrl),
    impressum: body.impressum !== undefined ? str(body.impressum) : (base?.impressum ?? ""),
    privacyPolicy:
      body.privacyPolicy !== undefined ? str(body.privacyPolicy) : (base?.privacyPolicy ?? ""),
  };

  if (!base) {
    if (!merged.name) merged.name = CREATE_DEFAULTS.name;
    if (!merged.address) merged.address = CREATE_DEFAULTS.address;
    if (!merged.phone) merged.phone = CREATE_DEFAULTS.phone;
    if (!merged.email) merged.email = CREATE_DEFAULTS.email;
    if (!merged.impressum) merged.impressum = CREATE_DEFAULTS.impressum;
    if (!merged.privacyPolicy) merged.privacyPolicy = CREATE_DEFAULTS.privacyPolicy;
  }

  return merged;
}
