import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_MIMES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const VIDEO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export type UploadKind = "IMAGE" | "VIDEO";

export function validateUpload(
  file: File,
  kind: UploadKind
): { ok: true } | { ok: false; error: string } {
  const allowedMimes = kind === "IMAGE" ? IMAGE_MIMES : VIDEO_MIMES;
  const maxSize = kind === "IMAGE" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (!allowedMimes.has(file.type)) {
    return {
      ok: false,
      error:
        kind === "IMAGE"
          ? "Geçersiz görsel formatı. JPEG, PNG, WebP veya GIF yükleyin."
          : "Geçersiz video formatı. MP4, WebM veya MOV yükleyin.",
    };
  }

  if (file.size > maxSize) {
    return {
      ok: false,
      error:
        kind === "IMAGE"
          ? "Görsel boyutu en fazla 10 MB olabilir."
          : "Video boyutu en fazla 100 MB olabilir.",
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

  const extMap = kind === "IMAGE" ? IMAGE_EXT : VIDEO_EXT;
  const ext = extMap[file.type] ?? (kind === "IMAGE" ? ".bin" : ".bin");
  const filename = `${randomUUID()}${ext}`;
  const subdir = kind === "IMAGE" ? "images" : "videos";
  const dir = path.join(UPLOAD_DIR, subdir);

  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return {
    filename: `${subdir}/${filename}`,
    originalName: file.name.slice(0, 255),
    mimeType: file.type,
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
