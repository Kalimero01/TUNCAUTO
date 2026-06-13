export const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const VIDEO_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const EXT_TO_IMAGE_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".av1": "image/avif",
};

/** HTML `accept` value for image file inputs */
export const IMAGE_ACCEPT =
  "image/jpeg,image/jpg,image/png,image/webp,image/avif,.avif,.av1";

export const IMAGE_FORMAT_LABEL = "JPG, JPEG, PNG, WEBP oder AVIF";

function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

export function normalizeMime(mime: string): string {
  if (mime === "image/jpg") return "image/jpeg";
  return mime;
}

function extensionMime(name: string, kind: "IMAGE" | "VIDEO"): string | null {
  const ext = fileExtension(name);
  if (kind === "IMAGE") return EXT_TO_IMAGE_MIME[ext] ?? null;
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  return null;
}

/** Resolve MIME from browser type or file extension (some AVIF files report empty type). */
export function resolveUploadMime(file: File, kind: "IMAGE" | "VIDEO"): string {
  const fromType = normalizeMime(file.type.trim());
  const allowed = kind === "IMAGE" ? IMAGE_MIMES : VIDEO_MIMES;
  if (fromType && allowed.has(fromType)) return fromType;

  const fromExt = extensionMime(file.name, kind);
  if (fromExt && allowed.has(fromExt)) return fromExt;

  return fromType;
}

export function isAllowedImageFile(file: File): boolean {
  return IMAGE_MIMES.has(resolveUploadMime(file, "IMAGE"));
}
