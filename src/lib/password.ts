import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 12) {
    return "Das Passwort muss mindestens 12 Zeichen lang sein.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Das Passwort muss mindestens einen Großbuchstaben enthalten.";
  }
  if (!/[a-z]/.test(password)) {
    return "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.";
  }
  if (!/[0-9]/.test(password)) {
    return "Das Passwort muss mindestens eine Ziffer enthalten.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Das Passwort muss mindestens ein Sonderzeichen enthalten.";
  }
  return null;
}
