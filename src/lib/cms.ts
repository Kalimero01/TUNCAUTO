import { prisma } from "@/lib/prisma";

export async function getCompany() {
  try {
    return await prisma.company.findUnique({ where: { id: "company" } });
  } catch {
    return null;
  }
}

export async function getAbout() {
  try {
    return await prisma.about.findUnique({ where: { id: "about" } });
  } catch {
    return null;
  }
}

export async function getVisionMission() {
  try {
    return await prisma.visionMission.findUnique({ where: { id: "vision_mission" } });
  } catch {
    return null;
  }
}

export async function getHomeMedia() {
  try {
    return await prisma.homeMedia.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getHomeTexts() {
  try {
    return await prisma.homeText.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getSocialLinks() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { platform: "asc" },
    });
    return links.filter((link) => link.url.trim() !== "");
  } catch {
    return [];
  }
}

export function cmsImageUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `/api/uploads/${filename}`;
}
