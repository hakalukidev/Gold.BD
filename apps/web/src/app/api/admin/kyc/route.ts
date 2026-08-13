import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/auth/require";
import { reviewKycSchema } from "@/lib/validations/kyc";
import { reviewKyc } from "@/lib/services/kyc.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAdmin();
    const profiles = await prisma.kycProfile.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { fullName: true, phone: true } } },
    });
    return ok(profiles);
  } catch (error) {
    return failFromUnknown(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const parsed = reviewKycSchema.safeParse(await request.json());
    if (!parsed.success) return failFromZod(parsed.error);

    const profile = await reviewKyc(session.userId, parsed.data);
    return ok(profile);
  } catch (error) {
    return failFromUnknown(error);
  }
}
