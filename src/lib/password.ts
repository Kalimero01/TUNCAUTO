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
    return "Şifre en az 12 karakter olmalıdır.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Şifre en az bir büyük harf içermelidir.";
  }
  if (!/[a-z]/.test(password)) {
    return "Şifre en az bir küçük harf içermelidir.";
  }
  if (!/[0-9]/.test(password)) {
    return "Şifre en az bir rakam içermelidir.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Şifre en az bir özel karakter içermelidir.";
  }
  return null;
}
