"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  Banknote,
  Gem,
  History,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useMe } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { useGoldRate } from "@/hooks/use-gold-rate";
import { useTransactions } from "@/hooks/use-transactions";
import { formatBDT, formatDateTime } from "@/lib/format";
import type { TransactionType } from "@/types";

const kycVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NOT_SUBMITTED: "outline",
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

const transactionIcon: Record<TransactionType, LucideIcon> = {
  BUY: ArrowUpRight,
  SELL: ArrowDownRight,
  DEPOSIT: ArrowDownToLine,
  WITHDRAW: ArrowUpFromLine,
};

export default function DashboardPage() {
  const { data: user } = useMe();
  const { data: wallet } = useWallet();
  const { data: rate } = useGoldRate();
  const { data: transactions } = useTransactions();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome${user ? `, ${user.fullName}` : ""}`}
        description="Here's your account at a glance."
        action={
          user && (
            <Badge variant={kycVariant[user.kycStatus]}>KYC: {user.kycStatus.replace("_", " ")}</Badge>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Banknote} label="Cash balance" value={wallet ? formatBDT(wallet.cashBalanceBDT) : "…"} />
        <StatCard icon={Gem} label="Gold balance" value={wallet ? `${wallet.goldBalanceGrams} g` : "…"} />
        <StatCard icon={TrendingUp} label="Gold rate" value={rate ? `${formatBDT(rate.pricePerGramBDT)}/g` : "…"} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button nativeButton={false} render={<Link href="/buy-gold">Buy gold</Link>} />
        <Button variant="outline" nativeButton={false} render={<Link href="/sell-gold">Sell gold</Link>} />
        <Button variant="outline" nativeButton={false} render={<Link href="/wallet">Deposit / withdraw</Link>} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <EmptyState icon={History} title="No transactions yet" description="Your buys, sells, deposits, and withdrawals will show up here." />
          ) : (
            <ul className="divide-y">
              {transactions.slice(0, 5).map((t) => {
                const Icon = transactionIcon[t.type];
                return (
                  <li key={t.id} className="flex items-center gap-3 py-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{t.type}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatBDT(t.totalAmountBDT)}</span>
                      <Badge variant={t.status === "COMPLETED" ? "default" : t.status === "FAILED" ? "destructive" : "secondary"}>
                        {t.status}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
