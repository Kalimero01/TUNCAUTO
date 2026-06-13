import Image from "next/image";
import Link from "next/link";
import { getLogoUrl } from "@/lib/logo";

type SiteLogoProps = {
  logoUrl: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ logoUrl, alt, className = "h-14 w-auto max-w-[200px] object-contain", priority }: SiteLogoProps) {
  return (
    <Image
      src={logoUrl}
      alt={alt}
      width={200}
      height={80}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}

export function SiteLogoLink({
  logoUrl,
  alt,
  href = "/",
  className,
}: {
  logoUrl: string;
  alt: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center transition-opacity duration-200 ease-out hover:opacity-90">
      <SiteLogo logoUrl={logoUrl} alt={alt} className={className} priority />
    </Link>
  );
}

export function resolveSiteLogo(company: { name?: string; logoFile?: string | null } | null | undefined) {
  return {
    logoUrl: getLogoUrl(company),
    alt: company?.name ?? "Tunc Automobile",
  };
}
