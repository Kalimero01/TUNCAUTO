import { describe, expect, it, vi } from "vitest";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { vehicle: { findMany } },
}));

import { getAvailableVehicles, getFeaturedVehicles } from "@/lib/vehicle-queries";

describe("vehicle-queries", () => {
  it("getFeaturedVehicles limits to top 3 by price", async () => {
    await getFeaturedVehicles();

    expect(findMany).toHaveBeenCalledWith({
      where: { status: "AVAILABLE" },
      include: { files: true, equipment: true },
      orderBy: { price: "desc" },
      take: 3,
    });
  });

  it("getAvailableVehicles returns all available vehicles alphabetically", async () => {
    await getAvailableVehicles({ fuelType: { equals: "Benzin", mode: "insensitive" } });

    expect(findMany).toHaveBeenCalledWith({
      where: {
        status: "AVAILABLE",
        fuelType: { equals: "Benzin", mode: "insensitive" },
      },
      include: { files: true, equipment: true },
      orderBy: [{ make: "asc" }, { model: "asc" }],
    });

    const args = findMany.mock.calls.at(-1)?.[0];
    expect(args).not.toHaveProperty("take");
  });
});
