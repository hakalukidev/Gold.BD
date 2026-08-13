import type { NextRequest } from "next/server";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { completeOtpLogin } from "@/lib/services/auth.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";
import type { PublicUser } from "@gold-bd/shared-types";

export async function POST(request: NextRequest) {
  const parsed = verifyOtpSchema.safeParse(await request.json());
  if (!parsed.success) return failFromZod(parsed.error);

  try {
    const user = await completeOtpLogin(parsed.data.phone, parsed.data.code, parsed.data.purpose);
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
