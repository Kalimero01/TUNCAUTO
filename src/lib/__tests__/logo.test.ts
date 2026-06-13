import { describe, expect, it } from "vitest";
import { DEFAULT_LOGO_URL, getLogoUrl } from "@/lib/logo";

describe("getLogoUrl", () => {
  it("returns default logo when no upload", () => {
    expect(getLogoUrl(null)).toBe(DEFAULT_LOGO_URL);
    expect(getLogoUrl({ logoFile: null })).toBe(DEFAULT_LOGO_URL);
  });

  it("returns upload path when logoFile is set", () => {
    expect(getLogoUrl({ logoFile: "images/abc.png" })).toBe("/api/uploads/images/abc.png");
  });
});
