import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  price: z.number().positive(),
  mileage: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
