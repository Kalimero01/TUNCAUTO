import {
  buildOsmDirectionsUrl,
  DEFAULT_MAP_LOCATION,
  resolveMapEmbedUrl,
} from "@/lib/map";
import { cn } from "@/lib/utils";

type ContactMapProps = {
  embedUrl?: string | null;
  address?: string | null;
  showAddress?: boolean;
  className?: string;
};

export function ContactMap({
  embedUrl,
  address,
  showAddress = false,
  className,
}: ContactMapProps) {
  const src = resolveMapEmbedUrl(embedUrl);
  const directionsUrl = buildOsmDirectionsUrl(
    DEFAULT_MAP_LOCATION.lat,
    DEFAULT_MAP_LOCATION.lon
  );
  const usesCustomEmbed = Boolean(embedUrl?.trim());

  return (
    <section
      aria-labelledby="standort-heading"
      className={cn(
        "min-w-0 w-full rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-5 backdrop-blur-sm sm:p-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2
            id="standort-heading"
            className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500"
          >
            Standort
          </h2>
          {showAddress && address && (
            <p className="mt-2 whitespace-pre-line text-zinc-300">{address}</p>
          )}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover shrink-0 text-sm font-medium tracking-wide text-metallic hover:text-white"
        >
          Anfahrt planen →
        </a>
      </div>

      <div className="mt-5 aspect-[4/3] max-h-[32rem] w-full min-w-0 overflow-hidden rounded-sm border border-zinc-800/90 shadow-[inset_0_0_0_1px_rgb(168_169_173/0.06)] sm:aspect-[4/3] lg:min-h-[28rem]">
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={
            usesCustomEmbed
              ? "Standort auf der Karte"
              : "Standort auf OpenStreetMap"
          }
          className="h-full w-full"
        />
      </div>

      {!usesCustomEmbed && (
        <p className="mt-2 text-xs text-zinc-600">
          Karte: ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover text-zinc-500 hover:text-zinc-400"
          >
            OpenStreetMap
          </a>{" "}
          Mitwirkende
        </p>
      )}
    </section>
  );
}
