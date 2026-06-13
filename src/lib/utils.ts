import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatMileage(km: number | null | undefined): string {
  if (km == null) return "Nicht angegeben";
  return `${new Intl.NumberFormat("de-DE").format(km)} km`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function vehicleSlug(make: string, model: string, year: number, id: string): string {
  const base = slugify(`${make}-${model}-${year}`);
  return `${base}-${id.slice(-6)}`;
}

export function sanitizeText(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export function getBaseUrl(): string {
  const fromEnv = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : undefined,
  ].find(Boolean);

  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:3000";
}
