import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "@/lib/password";
import { slugify, vehicleSlug } from "@/lib/utils";

describe("password validation", () => {
  it("rejects weak passwords", () => {
    expect(validatePasswordStrength("short")).toBeTruthy();
    expect(validatePasswordStrength("nouppercase123!")).toBeTruthy();
  });

  it("accepts strong passwords", () => {
    expect(validatePasswordStrength("SecurePass123!")).toBeNull();
  });
});

describe("slug utilities", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("BMW 320i")).toBe("bmw-320i");
  });

  it("creates vehicle slugs with id suffix", () => {
    const slug = vehicleSlug("BMW", "320i", 2022, "abc123def456");
    expect(slug).toContain("bmw-320i-2022");
    expect(slug).toContain("ef456");
  });
});
