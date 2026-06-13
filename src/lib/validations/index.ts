import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(1, "Kullanıcı adı veya e-posta gerekli."),
  password: z.string().min(1, "Şifre gerekli."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli."),
    newPassword: z.string().min(12, "Yeni şifre en az 12 karakter olmalıdır."),
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Yeni şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export const vehicleSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive(),
  mileage: z.coerce.number().int().min(0).optional().nullable(),
  fuelType: z.string().max(50).optional().nullable(),
  transmission: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  features: z.array(z.string().max(100)).max(20).optional(),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED"]).optional(),
});

export const submissionSchema = z.object({
  sellerName: z.string().min(2).max(100),
  sellerEmail: z.string().email(),
  sellerPhone: z.string().max(20).optional().nullable(),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive(),
  mileage: z.coerce.number().int().min(0).optional().nullable(),
  fuelType: z.string().max(50).optional().nullable(),
  transmission: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  senderName: z.string().min(1).max(100).optional(),
});

export const rejectSubmissionSchema = z.object({
  adminNotes: z.string().max(2000).optional().nullable(),
});
