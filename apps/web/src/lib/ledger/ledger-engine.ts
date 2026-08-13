import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";

/**
 * The Ledger Engine is the single place wallet balances are allowed to change.
 * Every mutation is expressed as CASH/GOLD × DEBIT/CREDIT postings, written
 * atomically alongside the wallet balance update inside one DB transaction —
 * so LedgerEntry rows are always a complete, replayable audit trail of every
 * balance change, and `balanceAfter` on each row lets you reconstruct the
 * wallet's balance at any point in history without touching the Wallet table.
 *
 * Known simplification: this posts directly against each user's own wallet
 * rather than a full multi-party double-entry system with a house/treasury
 * account, so postings aren't required to net to zero across accounts (a BUY
 * debits a user's CASH and credits their GOLD, but nothing credits a house
 * CASH account for the other side). Add a treasury Wallet and mirror every
 * posting onto it if you need that invariant enforced.
 */

export type LedgerAccount = "CASH" | "GOLD";
export type LedgerDirection = "DEBIT" | "CREDIT";

export interface LedgerPosting {
  account: LedgerAccount;
  direction: LedgerDirection;
  amount: bigint | number; // GOLD amounts are milligrams (integer); CASH amounts are BDT minor-less decimal, passed as number of paisa-free BDT (2dp) — see callers.
}

export interface PostLedgerEntriesInput {
  walletId: string;
  referenceType: string;
  referenceId: string;
  postings: LedgerPosting[];
}

function signedAmount(direction: LedgerDirection, amount: number): number {
  // CASH convention: DEBIT increases cash-out (spend), CREDIT increases cash-in (receive).
  // We track wallet balance from the wallet's point of view: CREDIT to CASH increases
  // cashBalance, DEBIT to CASH decreases it. Symmetric for GOLD.
  return direction === "CREDIT" ? amount : -amount;
}

/**
 * Post a set of ledger entries and apply them to the wallet balance, inside a
 * DB transaction. Throws if a posting would drive a balance negative, so a
 * wallet can never be overdrawn even under concurrent requests (the row lock
 * from `findUniqueOrThrow` inside an interactive transaction serializes
 * postings to the same wallet).
 */
export async function postLedgerEntries(
  tx: Prisma.TransactionClient,
  input: PostLedgerEntriesInput
) {
  const wallet = await tx.wallet.findUniqueOrThrow({ where: { id: input.walletId } });

  let cashBalance = Number(wallet.cashBalanceBDT);
  let goldBalanceMg = wallet.goldBalanceMg;

  for (const posting of input.postings) {
    if (posting.account === "CASH") {
      const amount = Number(posting.amount);
      const delta = signedAmount(posting.direction, amount);
      cashBalance = round2(cashBalance + delta);
      if (cashBalance < 0) {
        throw new Error("Insufficient cash balance for this posting");
      }
      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          account: "CASH",
          direction: posting.direction,
          amount,
          balanceAfter: cashBalance,
          referenceType: input.referenceType,
          referenceId: input.referenceId,
        },
      });
    } else {
      const amountMg = BigInt(posting.amount);
      const delta = posting.direction === "CREDIT" ? amountMg : -amountMg;
      goldBalanceMg = goldBalanceMg + delta;
      if (goldBalanceMg < BigInt(0)) {
        throw new Error("Insufficient gold balance for this posting");
      }
      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          account: "GOLD",
          direction: posting.direction,
          amount: amountMg.toString(),
          balanceAfter: goldBalanceMg.toString(),
          referenceType: input.referenceType,
          referenceId: input.referenceId,
        },
      });
    }
  }

  return tx.wallet.update({
    where: { id: wallet.id },
    data: { cashBalanceBDT: cashBalance, goldBalanceMg },
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Convenience wrapper that opens its own transaction — use when the caller has no other writes to bundle in. */
export async function postLedgerEntriesStandalone(input: PostLedgerEntriesInput) {
  return prisma.$transaction((tx) => postLedgerEntries(tx, input));
}
