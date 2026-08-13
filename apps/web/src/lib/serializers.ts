import type { Transaction, Wallet } from "@/generated/prisma/client";
import type { TransactionSummary, WalletSummary } from "@gold-bd/shared-types";

/** Prisma rows carry BigInt (goldMg) and Decimal fields, neither of which JSON.stringify can
 * serialize on its own — every response that includes a Transaction must go through this. */
export function toTransactionSummary(t: Transaction): TransactionSummary {
  return {
    id: t.id,
    type: t.type,
    status: t.status,
    goldGrams: t.goldMg != null ? (Number(t.goldMg) / 1000).toFixed(3) : null,
    pricePerGramBDT: t.pricePerGramBDT?.toString() ?? null,
    totalAmountBDT: t.totalAmountBDT.toString(),
    createdAt: t.createdAt.toISOString(),
  };
}

/** Wallet.goldBalanceMg is a BigInt, which JSON.stringify can't serialize on its own. */
export function toWalletSummary(wallet: Wallet): WalletSummary {
  return {
    cashBalanceBDT: wallet.cashBalanceBDT.toString(),
    goldBalanceGrams: (Number(wallet.goldBalanceMg) / 1000).toFixed(3),
  };
}
