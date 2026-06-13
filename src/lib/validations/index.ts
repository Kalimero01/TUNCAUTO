import { z } from "zod";
import { ALL_EQUIPMENT_FEATURES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/vehicle-constants";

export const loginSchema = z.object({
  login: z.string().min(1, "Benutzername oder E-Mail erforderlich."),
  password: z.string().min(1, "Passwort erforderlich."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort erforderlich."),
    newPassword: z.string().min(12, "Das neue Passwort muss mindestens 12 Zeichen lang sein."),
    confirmPassword: z.string().min(1, "Passwortbestätigung erforderlich."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Die neuen Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const vehicleSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive(),
  firstRegistration: z
    .string()
    .regex(/^\d{1,2}\/\d{4}$/, "Format: MM/YYYY")
    .optional()
    .nullable()
    .or(z.literal("")),
  mileage: z.coerce.number().int().min(0).optional().nullable(),
  fuelType: z.enum(FUEL_TYPES as unknown as [string, ...string[]]).optional().nullable().or(z.literal("")),
  transmission: z
    .enum(TRANSMISSION_TYPES as unknown as [string, ...string[]])
    .optional()
    .nullable()
    .or(z.literal("")),
  horsepower: z.coerce.number().int().min(0).optional().nullable(),
  engineDisplacement: z.coerce.number().int().min(0).optional().nullable(),
  exteriorColor: z.string().max(50).optional().nullable(),
  interiorColor: z.string().max(50).optional().nullable(),
  upholstery: z.string().max(50).optional().nullable(),
  doors: z.string().max(20).optional().nullable(),
  seats: z.coerce.number().int().min(1).max(20).optional().nullable(),
  financingUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  equipmentFeatures: z
    .array(z.enum(ALL_EQUIPMENT_FEATURES as unknown as [string, ...string[]]))
    .max(ALL_EQUIPMENT_FEATURES.length)
    .optional(),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED"]).optional(),
});

const yesNoDetails = z
  .object({
    value: z.enum(["yes", "no", ""]),
    details: z.string().max(200).optional().nullable(),
  })
  .refine(
    (d) => d.value !== "yes" || (d.details && d.details.trim().length > 0),
    { message: "Ja-Auswahl erfordert eine Beschreibung (max. 200 Zeichen)." }
  );

export const submissionSchema = z.object({
  sellerName: z.string().min(2).max(100),
  sellerEmail: z.string().email(),
  sellerPhone: z.string().min(3).max(20),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive(),
  desiredPrice: z.coerce.number().positive().optional().nullable(),
  mileage: z.coerce.number().int().min(0).optional().nullable(),
  fuelType: z.string().max(50).optional().nullable(),
  transmission: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  hasAccident: yesNoDetails,
  hasRepaint: yesNoDetails,
  hasPartsReplaced: yesNoDetails,
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  senderName: z.string().min(1).max(100).optional(),
});

export const liveChatStartSchema = z.object({
  customerName: z.string().min(2).max(100),
});

export const homeTextSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const aboutSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
});

export const companySchema = z.object({
  name: z.string().min(1).max(200),
  owner: z.string().max(200),
  street: z.string().max(200),
  postalCode: z.string().max(20),
  city: z.string().max(100),
  address: z.string().min(1).max(500),
  phone: z.string().min(1).max(50),
  email: z.string().email(),
  taxId: z.string().max(50),
  mapEmbedUrl: z.string().max(2000).optional().nullable(),
  impressum: z.string().min(1).max(50000),
  privacyPolicy: z.string().min(1).max(50000),
});

export const socialLinkSchema = z.object({
  platform: z.enum(["FACEBOOK", "INSTAGRAM", "TIKTOK"]),
  url: z
    .string()
    .max(500)
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message: "Ungültige URL",
    }),
  isActive: z.coerce.boolean().optional(),
});

export function parseYesNo(value: FormDataEntryValue | null): {
  value: "yes" | "no" | "";
  details: string | null;
} {
  const raw = String(value ?? "");
  if (raw === "yes" || raw === "no") {
    return { value: raw, details: null };
  }
  return { value: "", details: null };
}

export function parseYesNoWithDetails(
  value: FormDataEntryValue | null,
  details: FormDataEntryValue | null
) {
  const v = String(value ?? "");
  return {
    value: v === "yes" || v === "no" ? v : ("" as const),
    details: details ? String(details).slice(0, 200) : null,
  };
}
