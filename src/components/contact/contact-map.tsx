import {
  buildOsmDirectionsUrl,
  DEFAULT_MAP_LOCATION,
  resolveMapEmbedUrl,
} from "@/lib/map";

type ContactMapProps = {
  embedUrl?: string | null;
  address?: string | null;
};

export function ContactMap({ embedUrl, address }: ContactMapProps) {
  const src = resolveMapEmbedUrl(embedUrl);
  const directionsUrl = buildOsmDirectionsUrl(
    DEFAULT_MAP_LOCATION.lat,
    DEFAULT_MAP_LOCATION.lon
  );
  const usesCustomEmbed = Boolean(embedUrl?.trim());

  return (
    <section aria-labelledby="standort-heading" className="min-w-0 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2
            id="standort-heading"
            className="text-sm font-medium uppercase tracking-widest text-zinc-500"
          >
            Standort
          </h2>
          {address && (
            <p className="mt-2 whitespace-pre-line text-zinc-300">{address}</p>
          )}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover shrink-0 text-sm font-medium text-metallic hover:text-white"
        >
          Anfahrt planen →
        </a>
      </div>

      <div className="mt-4 aspect-[4/3] max-h-[28rem] w-full min-w-0 overflow-hidden rounded-sm border border-zinc-800 sm:aspect-[16/10]">
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
