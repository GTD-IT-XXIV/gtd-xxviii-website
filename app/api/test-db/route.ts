import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.registration.count();
  return NextResponse.json({ registrations: count });
}
