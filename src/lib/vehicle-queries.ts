import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const vehicleInclude = { files: true, equipment: true } as const;

/** Homepage: top 3 most expensive available vehicles only. */
export async function getFeaturedVehicles() {
  return prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
    include: vehicleInclude,
    orderBy: { price: "desc" },
    take: 3,
  });
}

/** Public listing: all available vehicles, alphabetical by make/model. */
export async function getAvailableVehicles(where: Prisma.VehicleWhereInput = {}) {
  return prisma.vehicle.findMany({
    where: { status: "AVAILABLE", ...where },
    include: vehicleInclude,
    orderBy: [{ make: "asc" }, { model: "asc" }],
  });
}
