import { describe, expect, it } from "vitest";
import {
  buildOsmDirectionsUrl,
  buildOsmEmbedUrl,
  DEFAULT_MAP_LOCATION,
  resolveMapEmbedUrl,
} from "@/lib/map";

describe("map helpers", () => {
  it("builds OSM embed URL with marker", () => {
    const url = buildOsmEmbedUrl(51.7594683, 7.8924605);
    expect(url).toContain("openstreetmap.org/export/embed.html");
    expect(url).toContain("marker=51.7594683%2C7.8924605");
  });

  it("builds OSM directions URL", () => {
    expect(buildOsmDirectionsUrl(51.7594683, 7.8924605)).toBe(
      "https://www.openstreetmap.org/directions?to=51.7594683%2C7.8924605"
    );
  });

  it("uses custom embed when provided", () => {
    expect(resolveMapEmbedUrl("https://maps.example/embed")).toBe(
      "https://maps.example/embed"
    );
  });

  it("falls back to default OSM embed when empty", () => {
    const url = resolveMapEmbedUrl(null);
    expect(url).toBe(
      buildOsmEmbedUrl(DEFAULT_MAP_LOCATION.lat, DEFAULT_MAP_LOCATION.lon)
    );
  });
});
