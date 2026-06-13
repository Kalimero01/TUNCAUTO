import { cmsImageUrl } from "@/lib/cms";

export const DEFAULT_LOGO_URL = "/logo.svg";

type CompanyLike = { logoFile?: string | null } | null | undefined;

/** Resolved logo URL: uploaded file or bundled default. */
export function getLogoUrl(company?: CompanyLike): string {
  const uploaded = cmsImageUrl(company?.logoFile);
  return uploaded ?? DEFAULT_LOGO_URL;
}
