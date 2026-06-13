/** Verified via Nominatim for Südstr. 48a, 59227 Ahlen, Germany */
export const DEFAULT_MAP_LOCATION = {
  lat: 51.7594683,
  lon: 7.8924605,
  label: "Tunc Automobile",
} as const;

export function buildOsmEmbedUrl(lat: number, lon: number, padding = 0.008): string {
  const bbox = [lon - padding, lat - padding, lon + padding, lat + padding].join(",");
  const marker = `${lat}%2C${lon}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${marker}`;
}

export function buildOsmDirectionsUrl(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/directions?to=${lat}%2C${lon}`;
}

/** Custom admin embed URL, otherwise free OpenStreetMap embed. */
export function resolveMapEmbedUrl(customUrl: string | null | undefined): string {
  const trimmed = customUrl?.trim();
  if (trimmed) return trimmed;
  return buildOsmEmbedUrl(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lon);
}
