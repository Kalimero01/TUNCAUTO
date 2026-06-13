import { describe, expect, it } from "vitest";
import { validatePasswordStrength } from "@/lib/password";

describe("validatePasswordStrength", () => {
  it("rejects short passwords", () => {
    expect(validatePasswordStrength("Short1!")).toMatch(/12 karakter/);
  });

  it("requires uppercase letter", () => {
    expect(validatePasswordStrength("alllowercase1!")).toMatch(/büyük harf/);
  });

  it("requires lowercase letter", () => {
    expect(validatePasswordStrength("ALLUPPERCASE1!")).toMatch(/küçük harf/);
  });

  it("requires digit", () => {
    expect(validatePasswordStrength("NoDigitsHere!!")).toMatch(/rakam/);
  });

  it("requires special character", () => {
    expect(validatePasswordStrength("NoSpecialChar1")).toMatch(/özel karakter/);
  });

  it("accepts strong passwords", () => {
    expect(validatePasswordStrength("ChangeMeImmediately123!")).toBeNull();
  });
});
