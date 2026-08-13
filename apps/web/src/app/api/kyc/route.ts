import type { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/require";
import { submitKycSchema } from "@/lib/validations/kyc";
import { submitKyc, getKycStatus } from "@/lib/services/kyc.service";
import { ok, failFromZod, failFromUnknown } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireUser();
    const profile = await getKycStatus(session.userId);
    return ok(profile);
  } catch (error) {
    return failFromUnknown(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const parsed = submitKycSchema.safeParse(await request.json());
    if (!parsed.success) return failFromZod(parsed.error);

    const profile = await submitKyc(session.userId, parsed.data);
    return ok(profile, 201);
  } catch (error) {
    return failFromUnknown(error);
  }
}
