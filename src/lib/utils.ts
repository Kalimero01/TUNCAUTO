import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatMileage(km: number | null | undefined): string {
  if (km == null) return "Belirtilmemiş";
  return `${new Intl.NumberFormat("tr-TR").format(km)} km`;
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
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return "http://localhost:3000";
}
