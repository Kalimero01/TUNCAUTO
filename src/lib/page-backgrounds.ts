/**
 * Static page backgrounds (Unsplash License — free for commercial use).
 * Mercedes-Benz G-Class: https://unsplash.com/photos/FkKBjwOtnro
 * Photographer: Unsplash contributor (SONY ILCE-7C)
 */
export const MERCEDES_G_CLASS_BG = "/images/mercedes-g-class-bg.jpg";

/** Pexels License — free for commercial use. Photo: Pixabay via Pexels #97075 */
export const ABOUT_TUNC_AUTO_IMAGE = "/images/about-tunc-auto.jpg";

export const PAGE_BACKGROUND_ATTRIBUTION = {
  image: MERCEDES_G_CLASS_BG,
  source: "https://unsplash.com/photos/FkKBjwOtnro",
  license: "https://unsplash.com/license",
} as const;

export const ABOUT_IMAGE_ATTRIBUTION = {
  image: ABOUT_TUNC_AUTO_IMAGE,
  source: "https://www.pexels.com/photo/97075/",
  license: "https://www.pexels.com/license/",
} as const;
