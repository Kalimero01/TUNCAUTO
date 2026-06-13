import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "tuncauto",
    timestamp: new Date().toISOString(),
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
