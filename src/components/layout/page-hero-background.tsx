import { cn } from "@/lib/utils";

type PageHeroBackgroundProps = {
  imageSrc: string;
  kicker: string;
  title: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
};

export function PageHeroBackground({
  imageSrc,
  kicker,
  title,
  subtitle,
  className,
  compact = false,
}: PageHeroBackgroundProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        compact ? "min-h-[40vh]" : "min-h-[50vh] sm:min-h-[55vh]",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center parallax-bg"
        style={{ backgroundImage: `url(${imageSrc})` }}
        role="img"
        aria-label=""
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15" />

      <div className="relative mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 sm:pb-16">
        <div className="max-w-2xl animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-metallic">{kicker}</p>
          <h1 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
