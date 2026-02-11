import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const id = body?.id ?? body?.registrationId;

    if (!id) {
      return NextResponse.json({ error: "Missing registration id" }, { status: 400 });
    }

    const regId = String(id);

    const reg = await prisma.registration.findUnique({
      where: { id: regId },
      select: { id: true, paymentStatus: true },
    });

    // Idempotent: already deleted is fine
    if (!reg) {
      return NextResponse.json({ ok: true, alreadyDeleted: true });
    }

    // Never delete paid registrations
    if (reg.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true, kept: "PAID" });
    }

    await prisma.registration.delete({
      where: { id: reg.id },
    });

    return NextResponse.json({ ok: true, deleted: true });
  } catch (e: any) {
    console.error("release route error:", e);
    return NextResponse.json(
      { error: "Release failed on server", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
