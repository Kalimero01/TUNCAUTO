import { cmsImageUrl } from "@/lib/cms";

type CompanyLike = { logoFile?: string | null } | null | undefined;

/** Resolved logo URL: uploaded file or bundled default. */
export function getLogoUrl(company?: CompanyLike): string {
  const uploaded = cmsImageUrl(company?.logoFile);
  return uploaded ?? "/logo.png";
}
