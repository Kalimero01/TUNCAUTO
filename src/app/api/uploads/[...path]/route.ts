import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/uploads";

type Params = { params: Promise<{ path: string[] }> };

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { path: segments } = await params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  const relative = segments.join("/");
  if (relative.includes("..") || relative.startsWith("/")) {
    return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  }

  const filePath = path.join(UPLOAD_DIR, relative);
  const resolved = path.resolve(filePath);
  const uploadRoot = path.resolve(UPLOAD_DIR);

  if (!resolved.startsWith(uploadRoot + path.sep) && resolved !== uploadRoot) {
    return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  }

  try {
    const buffer = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }
}
