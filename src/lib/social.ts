import { prisma } from "@/lib/prisma";
import type { SocialPlatform as PrismaSocialPlatform } from "@prisma/client";

export const SOCIAL_PLATFORMS = ["FACEBOOK", "INSTAGRAM", "TIKTOK"] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
};

export const SOCIAL_PLATFORM_ARIA_LABELS: Record<SocialPlatform, string> = {
  FACEBOOK: "TUNC AUTO auf Facebook",
  INSTAGRAM: "TUNC AUTO auf Instagram",
  TIKTOK: "TUNC AUTO auf TikTok",
};

export const SOCIAL_LINK_PENDING_TITLE = "Link folgt";

export async function ensureSocialPlatforms() {
  for (const platform of SOCIAL_PLATFORMS) {
    const existing = await prisma.socialLink.findFirst({ where: { platform } });
    if (!existing) {
      await prisma.socialLink.create({
        data: {
          platform: platform as PrismaSocialPlatform,
          url: "",
          isActive: false,
        },
      });
    }
  }
}

export function isSocialUrlActive(url: string, isActive: boolean) {
  return isActive && url.trim() !== "";
}
