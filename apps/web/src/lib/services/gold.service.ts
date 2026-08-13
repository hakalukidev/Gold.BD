import { prisma } from "@/lib/prisma/client";
import { redis } from "@/lib/redis";
import { postLedgerEntries } from "@/lib/ledger/ledger-engine";
import { gramsToMg } from "@gold-bd/utils";

const RATE_CACHE_KEY = "gold:rate:current";
const RATE_CACHE_TTL_SECONDS = 60;

export async function getCurrentRate() {
  const cached = await redis.get(RATE_CACHE_KEY);
  if (cached) return JSON.parse(cached) as { pricePerGramBDT: string; effectiveAt: string };

  const rate = await prisma.goldRate.findFirst({ orderBy: { effectiveAt: "desc" } });
  if (!rate) throw new Error("No gold rate has been set yet");

  const payload = { pricePerGramBDT: rate.pricePerGramBDT.toString(), effectiveAt: rate.effectiveAt.toISOString() };
  await redis.set(RATE_CACHE_KEY, JSON.stringify(payload), "EX", RATE_CACHE_TTL_SECONDS);
  return payload;
}

export async function setRate(pricePerGramBDT: number, setById: string) {
  const rate = await prisma.goldRate.create({ data: { pricePerGramBDT, setById } });
  await redis.del(RATE_CACHE_KEY);
  return rate;
}

/** Every rate this platform has actually set, oldest first — real history, not a market-data feed. */
export async function getRateHistory(limit = 30) {
  const rates = await prisma.goldRate.findMany({
    orderBy: { effectiveAt: "asc" },
    take: limit,
  });
  return rates.map((r) => ({
    pricePerGramBDT: r.pricePerGramBDT.toString(),
    effectiveAt: r.effectiveAt.toISOString(),
  }));
}

export async function buyGold(userId: string, goldGrams: number) {
  const wallet = await prisma.wallet.findUniqueOrThrow({ where: { userId } });
  const rate = await getCurrentRate();
  const pricePerGram = Number(rate.pricePerGramBDT);
  const totalAmountBDT = round2(pricePerGram * goldGrams);
  const goldMg = gramsToMg(goldGrams);

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: "BUY",
      status: "PENDING",
      goldMg,
      pricePerGramBDT: pricePerGram,
      totalAmountBDT,
    },
  });

  try {
    await prisma.$transaction(async (tx) => {
      await postLedgerEntries(tx, {
        walletId: wallet.id,
        referenceType: "BUY",
        referenceId: transaction.id,
        postings: [
          { account: "CASH", direction: "DEBIT", amount: totalAmountBDT },
          { account: "GOLD", direction: "CREDIT", amount: goldMg },
        ],
      });
      await tx.transaction.update({ where: { id: transaction.id }, data: { status: "COMPLETED" } });
    });
  } catch (error) {
    await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "FAILED" } });
    throw error;
  }

  return prisma.transaction.findUniqueOrThrow({ where: { id: transaction.id } });
}

export async function sellGold(userId: string, goldGrams: number) {
  const wallet = await prisma.wallet.findUniqueOrThrow({ where: { userId } });
  const rate = await getCurrentRate();
  const pricePerGram = Number(rate.pricePerGramBDT);
  const totalAmountBDT = round2(pricePerGram * goldGrams);
  const goldMg = gramsToMg(goldGrams);

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: "SELL",
      status: "PENDING",
      goldMg,
      pricePerGramBDT: pricePerGram,
      totalAmountBDT,
    },
  });

  try {
    await prisma.$transaction(async (tx) => {
      await postLedgerEntries(tx, {
        walletId: wallet.id,
        referenceType: "SELL",
        referenceId: transaction.id,
        postings: [
          { account: "GOLD", direction: "DEBIT", amount: goldMg },
          { account: "CASH", direction: "CREDIT", amount: totalAmountBDT },
        ],
      });
      await tx.transaction.update({ where: { id: transaction.id }, data: { status: "COMPLETED" } });
    });
  } catch (error) {
    await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "FAILED" } });
    throw error;
  }

  return prisma.transaction.findUniqueOrThrow({ where: { id: transaction.id } });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
