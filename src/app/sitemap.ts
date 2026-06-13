import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const staticPages = [
  "",
  "/araclar",
  "/sat",
  "/hakkimizda",
  "/vizyon-misyon",
  "/iletisim",
  "/impressum",
  "/datenschutz",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  let vehicles: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    vehicles = await prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB may be unavailable during CI build
  }

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/araclar" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/araclar" ? 0.9 : 0.6,
    })),
    ...vehicles.map((v) => ({
      url: `${baseUrl}/araclar/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
