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
    return jsonError("Nicht autorisiert.", 401);
  }
  return { session, userId: session.user.id };
}

export function serializeVehicle(vehicle: {
  id: string;
  make: string;
  model: string;
  year: number;
  price: { toString(): string } | number;
  firstRegistration?: string | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  horsepower: number | null;
  engineDisplacement?: number | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  upholstery?: string | null;
  doors?: string | null;
  seats?: number | null;
  color: string | null;
  description: string | null;
  financingOffer: string | null;
  financingUrl: string | null;
  features: string[];
  equipmentFeatures?: string[];
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

  const legacyEquipment = vehicle.equipment?.sort((a, b) => a.sortOrder - b.sortOrder).map((e) => e.name) ?? [];
  const equipmentFeatures =
    vehicle.equipmentFeatures && vehicle.equipmentFeatures.length > 0
      ? vehicle.equipmentFeatures
      : legacyEquipment;

  return {
    ...vehicle,
    price: vehicle.price.toString(),
    exteriorColor: vehicle.exteriorColor ?? vehicle.color,
    images,
    videos: vehicle.files?.filter((f) => f.type === "VIDEO").map(formatFile) ?? [],
    equipmentFeatures,
    equipment: equipmentFeatures,
    files: undefined,
  };
}

export function serializeSubmission(submission: {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  make: string;
  model: string;
  year: number;
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
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  price?: { toString(): string } | number | null;
  desiredPrice?: { toString(): string } | number | null;
  files?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    type: string;
    originalName: string;
    sortOrder?: number;
  }>;
}) {
  const { files, price, desiredPrice, ...data } = submission;
  void price;
  void desiredPrice;

  return {
    ...data,
    images:
      files
        ?.filter((f) => f.type === "IMAGE")
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map(formatFile) ?? [],
    videos: files?.filter((f) => f.type === "VIDEO").map(formatFile) ?? [],
    isRead: submission.readAt !== null,
    files: undefined,
  };
}

export function serializeTestDriveRequest(request: {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  preferredDateTime: string;
  vehicleModel: string;
  readAt: Date | null;
  createdAt: Date;
}) {
  return {
    ...request,
    isRead: request.readAt !== null,
  };
}

export function serializeContactMessage(message: {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}) {
  return {
    ...message,
    isRead: message.readAt !== null,
  };
}

function formatFile(file: {
  id: string;
  filename: string;
  mimeType: string;
  type: string;
  originalName: string;
  sortOrder?: number;
}) {
  return {
    id: file.id,
    url: `/api/uploads/${file.filename}`,
    mimeType: file.mimeType,
    type: file.type,
    originalName: file.originalName,
    sortOrder: file.sortOrder ?? 0,
  };
}
