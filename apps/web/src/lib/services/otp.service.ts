import { prisma } from "@/lib/prisma/client";
import { smsProvider } from "@/lib/services/sms-provider";
import type { OtpPurpose } from "@/generated/prisma/client";

const OTP_TTL_MINUTES = 5;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueOtp(phone: string, purpose: OtpPurpose) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

  await prisma.otpToken.create({ data: { phone, code, purpose, expiresAt } });

  const verb = purpose === "REGISTER" ? "registration" : "login";
  await smsProvider.send(phone, `Your Gold BD ${verb} code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes.`);

  return { expiresAt };
}

export async function verifyOtp(phone: string, code: string, purpose: OtpPurpose) {
  const token = await prisma.otpToken.findFirst({
    where: { phone, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!token) throw new Error("No pending OTP for this number — request a new code");
  if (token.expiresAt < new Date()) throw new Error("OTP has expired — request a new code");
  if (token.code !== code) throw new Error("Incorrect code");

  await prisma.otpToken.update({ where: { id: token.id }, data: { consumedAt: new Date() } });
  return true;
}
