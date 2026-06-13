import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export async function requireAdmin(): Promise<
  { session: Session; userId: string } | NextResponse
> {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("Yetkisiz erişim.", 401);
  }
  return { session, userId: session.user.id };
}

export function serializeVehicle(vehicle: {
  id: string;
  make: string;
  model: string;
  year: number;
  price: { toString(): string } | number;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  horsepower: number | null;
  color: string | null;
  description: string | null;
  financingOffer: string | null;
  financingUrl: string | null;
  features: string[];
  status: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  files?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    type: string;
    originalName: string;
    sortOrder?: number;
  }>;
  equipment?: Array<{ id: string; name: string; sortOrder: number }>;
}) {
  const images =
    vehicle.files
      ?.filter((f) => f.type === "IMAGE")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .slice(0, 10)
      .map(formatFile) ?? [];

  return {
    ...vehicle,
    price: vehicle.price.toString(),
    images,
    videos: vehicle.files?.filter((f) => f.type === "VIDEO").map(formatFile) ?? [],
    equipment: vehicle.equipment?.sort((a, b) => a.sortOrder - b.sortOrder).map((e) => e.name) ?? [],
    files: undefined,
  };
}

export function serializeSubmission(submission: {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string | null;
  make: string;
  model: string;
  year: number;
  price: { toString(): string } | number;
  desiredPrice: { toString(): string } | number | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  hasAccident: boolean | null;
  accidentDetails: string | null;
  hasRepaint: boolean | null;
  repaintDetails: string | null;
  hasPartsReplaced: boolean | null;
  partsDetails: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  files?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    type: string;
    originalName: string;
  }>;
  _count?: { chatMessages: number };
}) {
  return {
    ...submission,
    price: submission.price.toString(),
    desiredPrice: submission.desiredPrice?.toString() ?? null,
    images: submission.files?.filter((f) => f.type === "IMAGE").map(formatFile) ?? [],
    videos: submission.files?.filter((f) => f.type === "VIDEO").map(formatFile) ?? [],
    unreadMessages: submission._count?.chatMessages,
    files: undefined,
    _count: undefined,
  };
}

function formatFile(file: {
  id: string;
  filename: string;
  mimeType: string;
  type: string;
  originalName: string;
}) {
  return {
    id: file.id,
    url: `/api/uploads/${file.filename}`,
    mimeType: file.mimeType,
    type: file.type,
    originalName: file.originalName,
  };
}
