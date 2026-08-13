import { prisma } from "@/lib/prisma/client";
import { postLedgerEntries } from "@/lib/ledger/ledger-engine";
import { paymentProvider } from "@/lib/services/payment.service";

export async function getWallet(userId: string) {
  return prisma.wallet.findUniqueOrThrow({ where: { userId } });
}

export async function deposit(userId: string, amountBDT: number) {
  const wallet = await prisma.wallet.findUniqueOrThrow({ where: { userId } });

  const transaction = await prisma.transaction.create({
    data: { userId, type: "DEPOSIT", totalAmountBDT: amountBDT, status: "PENDING" },
  });
  const paymentRequest = await prisma.paymentRequest.create({
    data: { userId, transactionId: transaction.id, amountBDT, status: "PENDING" },
  });

  const result = await paymentProvider.charge(amountBDT, transaction.id);

  if (!result.success) {
    await prisma.$transaction([
      prisma.transaction.update({ where: { id: transaction.id }, data: { status: "FAILED" } }),
      prisma.paymentRequest.update({ where: { id: paymentRequest.id }, data: { status: "FAILED" } }),
    ]);
    throw new Error(result.reason);
  }

  return prisma.$transaction(async (tx) => {
    await postLedgerEntries(tx, {
      walletId: wallet.id,
      referenceType: "DEPOSIT",
      referenceId: transaction.id,
      postings: [{ account: "CASH", direction: "CREDIT", amount: amountBDT }],
    });
    await tx.transaction.update({ where: { id: transaction.id }, data: { status: "COMPLETED" } });
    await tx.paymentRequest.update({ where: { id: paymentRequest.id }, data: { status: "SUCCEEDED" } });
    return tx.wallet.findUniqueOrThrow({ where: { id: wallet.id } });
  });
}

export async function withdraw(userId: string, amountBDT: number) {
  const wallet = await prisma.wallet.findUniqueOrThrow({ where: { userId } });

  const transaction = await prisma.transaction.create({
    data: { userId, type: "WITHDRAW", totalAmountBDT: amountBDT, status: "PENDING" },
  });

  try {
    const updatedWallet = await prisma.$transaction(async (tx) => {
      await postLedgerEntries(tx, {
        walletId: wallet.id,
        referenceType: "WITHDRAW",
        referenceId: transaction.id,
        postings: [{ account: "CASH", direction: "DEBIT", amount: amountBDT }],
      });
      await tx.transaction.update({ where: { id: transaction.id }, data: { status: "COMPLETED" } });
      return tx.wallet.findUniqueOrThrow({ where: { id: wallet.id } });
    });
    return updatedWallet;
  } catch (error) {
    await prisma.transaction.update({ where: { id: transaction.id }, data: { status: "FAILED" } });
    throw error;
  }
}
