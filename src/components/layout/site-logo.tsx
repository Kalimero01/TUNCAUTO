import Image from "next/image";
import Link from "next/link";
import { getLogoUrl } from "@/lib/logo";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  logoUrl: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Invert dark logo artwork for dark backgrounds (header, admin shell). */
  onDark?: boolean;
};

export function SiteLogo({
  logoUrl,
  alt,
  className = "h-14 w-auto max-w-[200px] object-contain",
  priority,
  onDark,
}: SiteLogoProps) {
  return (
    <Image
      src={logoUrl}
      alt={alt}
      width={200}
      height={80}
      className={cn(className, onDark && "brightness-0 invert")}
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
  onDark,
}: {
  logoUrl: string;
  alt: string;
  href?: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center transition-opacity duration-200 ease-out hover:opacity-90">
      <SiteLogo logoUrl={logoUrl} alt={alt} className={className} priority onDark={onDark} />
    </Link>
  );
}

export function resolveSiteLogo(company: { name?: string; logoFile?: string | null } | null | undefined) {
  return {
    logoUrl: getLogoUrl(company),
    alt: company?.name ?? "Tunc Automobile",
  };
}
