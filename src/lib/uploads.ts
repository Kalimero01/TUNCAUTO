import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const VIDEO_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const VIDEO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export type UploadKind = "IMAGE" | "VIDEO";

export function normalizeMime(mime: string): string {
  if (mime === "image/jpg") return "image/jpeg";
  return mime;
}

export function validateUpload(
  file: File,
  kind: UploadKind
): { ok: true } | { ok: false; error: string } {
  const mime = normalizeMime(file.type);
  const allowedMimes = kind === "IMAGE" ? IMAGE_MIMES : VIDEO_MIMES;
  const maxSize = kind === "IMAGE" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (!allowedMimes.has(mime)) {
    return {
      ok: false,
      error:
        kind === "IMAGE"
          ? "Ungültiges Bildformat. JPG, JPEG, PNG oder WEBP erlaubt."
          : "Ungültiges Videoformat. MP4 erlaubt.",
    };
  }

  if (file.size > maxSize) {
    return {
      ok: false,
      error:
        kind === "IMAGE"
          ? "Bild darf maximal 10 MB groß sein."
          : "Video darf maximal 100 MB groß sein.",
    };
  }

  return { ok: true };
}

export async function saveUpload(file: File, kind: UploadKind): Promise<{
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: UploadKind;
}> {
  const validation = validateUpload(file, kind);
  if (!validation.ok) throw new Error(validation.error);

  const mime = normalizeMime(file.type);
  const extMap = kind === "IMAGE" ? IMAGE_EXT : VIDEO_EXT;
  const ext = extMap[mime] ?? (kind === "IMAGE" ? ".bin" : ".bin");
  const filename = `${randomUUID()}${ext}`;
  const subdir = kind === "IMAGE" ? "images" : "videos";
  const dir = path.join(UPLOAD_DIR, subdir);

  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    filename: `${subdir}/${filename}`,
    originalName: file.name.slice(0, 255),
    mimeType: mime,
    size: file.size,
    type: kind,
  };
}

export async function deleteUploadFile(filename: string): Promise<void> {
  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // File may already be removed
  }
}

export function getUploadPublicPath(filename: string): string {
  return `/api/uploads/${filename}`;
}
