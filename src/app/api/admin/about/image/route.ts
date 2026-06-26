import { prisma } from "@/lib/prisma";
import { jsonData, requireAdmin } from "@/lib/api-helpers";
import { deleteUploadFile } from "@/lib/uploads";

export async function DELETE() {
  const authResult = await requireAdmin();
  if (authResult instanceof Response) return authResult;

  const existing = await prisma.about.findUnique({ where: { id: "about" } });
  if (!existing?.imageFile) {
    return jsonData({ imageFile: null, imageMime: null });
  }

  await deleteUploadFile(existing.imageFile);
  const about = await prisma.about.update({
    where: { id: "about" },
    data: { imageFile: null, imageMime: null },
  });

  return jsonData(about);
}
