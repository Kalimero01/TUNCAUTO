import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "@/lib/password";

describe("validatePasswordStrength", () => {
  it("rejects short passwords", () => {
    expect(validatePasswordStrength("Short1!")).toMatch(/12 Zeichen/);
  });

  it("requires uppercase letter", () => {
    expect(validatePasswordStrength("alllowercase1!")).toMatch(/Großbuchstaben/);
  });

  it("requires lowercase letter", () => {
    expect(validatePasswordStrength("ALLUPPERCASE1!")).toMatch(/Kleinbuchstaben/);
  });

  it("requires digit", () => {
    expect(validatePasswordStrength("NoDigitsHere!!")).toMatch(/Ziffer/);
  });

  it("requires special character", () => {
    expect(validatePasswordStrength("NoSpecialChar1")).toMatch(/Sonderzeichen/);
  });

  it("accepts strong passwords", () => {
    expect(validatePasswordStrength("ChangeMeImmediately123!")).toBeNull();
  });
});
