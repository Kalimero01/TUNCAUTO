import { describe, expect, it } from "vitest";
import { validateUpload } from "@/lib/uploads";

function mockFile(name: string, type: string, size: number): File {
  return { name, type, size } as File;
}

describe("validateUpload", () => {
  it("accepts valid JPEG images", () => {
    expect(validateUpload(mockFile("photo.jpg", "image/jpeg", 1024), "IMAGE")).toEqual({
      ok: true,
    });
  });

  it("rejects invalid image mime types", () => {
    const result = validateUpload(mockFile("doc.pdf", "application/pdf", 1024), "IMAGE");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Geçersiz görsel/);
  });

  it("rejects oversized images", () => {
    const result = validateUpload(
      mockFile("big.jpg", "image/jpeg", 11 * 1024 * 1024),
      "IMAGE"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/10 MB/);
  });

  it("accepts valid MP4 videos", () => {
    expect(validateUpload(mockFile("clip.mp4", "video/mp4", 1024), "VIDEO")).toEqual({
      ok: true,
    });
  });

  it("rejects oversized videos", () => {
    const result = validateUpload(
      mockFile("big.mp4", "video/mp4", 101 * 1024 * 1024),
      "VIDEO"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/100 MB/);
  });
});
