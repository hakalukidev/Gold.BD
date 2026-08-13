import { prisma } from "@/lib/prisma/client";
import { requireUser } from "@/lib/auth/require";
import { ok, failFromUnknown } from "@/lib/api-response";
import type { PublicUser } from "@gold-bd/shared-types";

export async function GET() {
  try {
    const session = await requireUser();
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
    const publicUser: PublicUser = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      kycStatus: user.kycStatus,
      createdAt: user.createdAt.toISOString(),
    };
    return ok(publicUser);
  } catch (error) {
    return failFromUnknown(error);
  }
}
