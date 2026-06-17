import { prisma } from "@/lib/prisma";
import { SOCIAL_PLATFORMS, isSocialUrlActive, type SocialPlatform } from "@/lib/social";

export type SocialLinkDisplay = {
  platform: SocialPlatform;
  url: string;
  hasUrl: boolean;
};

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

export async function getSocialLinks(): Promise<SocialLinkDisplay[]> {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { platform: "asc" },
    });
    const byPlatform = new Map(links.map((link) => [link.platform, link]));

    return SOCIAL_PLATFORMS.map((platform) => {
      const link = byPlatform.get(platform);
      const url = link?.url.trim() ?? "";
      return {
        platform,
        url,
        hasUrl: isSocialUrlActive(url, link?.isActive ?? false),
      };
    });
  } catch {
    return SOCIAL_PLATFORMS.map((platform) => ({
      platform,
      url: "",
      hasUrl: false,
    }));
  }
}

export function cmsImageUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `/api/uploads/${filename}`;
}
