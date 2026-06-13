import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const staticPages: Array<{
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/araclar", priority: 0.9, changeFrequency: "daily" },
  { path: "/sat", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hakkimizda", priority: 0.7, changeFrequency: "monthly" },
  { path: "/vizyon-misyon", priority: 0.6, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.8, changeFrequency: "monthly" },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
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
    ...staticPages.map(({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
    ...vehicles.map((v) => ({
      url: `${baseUrl}/araclar/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
