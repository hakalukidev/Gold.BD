import { prisma } from "@/lib/prisma/client";
import type { SubmitKycInput, ReviewKycInput } from "@/lib/validations/kyc";

export async function submitKyc(userId: string, input: SubmitKycInput) {
  const profile = await prisma.kycProfile.upsert({
    where: { userId },
    create: {
      userId,
      nidNumber: input.nidNumber,
      documentUrls: input.documentUrls,
      status: "PENDING",
    },
    update: {
      nidNumber: input.nidNumber,
      documentUrls: input.documentUrls,
      status: "PENDING",
      reviewedById: null,
      reviewedAt: null,
      rejectReason: null,
    },
  });

  await prisma.user.update({ where: { id: userId }, data: { kycStatus: "PENDING" } });
  return profile;
}

export async function getKycStatus(userId: string) {
  return prisma.kycProfile.findUnique({ where: { userId } });
}

export async function reviewKyc(reviewerId: string, input: ReviewKycInput) {
  const profile = await prisma.kycProfile.update({
    where: { id: input.kycProfileId },
    data: {
      status: input.decision,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
      rejectReason: input.decision === "REJECTED" ? input.rejectReason ?? "Not specified" : null,
    },
  });

  await prisma.user.update({ where: { id: profile.userId }, data: { kycStatus: profile.status } });
  return profile;
}
