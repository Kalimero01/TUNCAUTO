import { describe, expect, it } from "vitest";
import { getLogoUrl } from "@/lib/logo";

describe("getLogoUrl", () => {
  it("returns default logo when no upload", () => {
    expect(getLogoUrl(null)).toBe("/logo.png");
    expect(getLogoUrl({ logoFile: null })).toBe("/logo.png");
  });

  it("returns upload path when logoFile is set", () => {
    expect(getLogoUrl({ logoFile: "images/abc.png" })).toBe("/api/uploads/images/abc.png");
  });
});
