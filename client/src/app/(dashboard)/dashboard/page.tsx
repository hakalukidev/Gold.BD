"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { useGoldRate } from "@/hooks/use-gold-rate";
import { useTransactions } from "@/hooks/use-transactions";
import { formatBDT, formatDateTime } from "@gold-bd/utils";

const kycVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  NOT_SUBMITTED: "outline",
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default function DashboardPage() {
  const { data: user } = useMe();
  const { data: wallet } = useWallet();
  const { data: rate } = useGoldRate();
  const { data: transactions } = useTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.fullName}` : ""}</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s your account at a glance.</p>
        </div>
        {user && (
          <Badge variant={kycVariant[user.kycStatus]}>KYC: {user.kycStatus.replace("_", " ")}</Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Cash balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {wallet ? formatBDT(wallet.cashBalanceBDT) : "…"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Gold balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{wallet ? `${wallet.goldBalanceGrams} g` : "…"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Gold rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {rate ? `${formatBDT(rate.pricePerGramBDT)}/g` : "…"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button render={<Link href="/buy-gold">Buy gold</Link>} />
        <Button variant="outline" render={<Link href="/sell-gold">Sell gold</Link>} />
        <Button variant="outline" render={<Link href="/wallet">Deposit / withdraw</Link>} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions || transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <ul className="divide-y">
              {transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="font-medium">{t.type}</span>{" "}
                    <span className="text-muted-foreground">{formatDateTime(t.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{formatBDT(t.totalAmountBDT)}</span>
                    <Badge variant={t.status === "COMPLETED" ? "default" : t.status === "FAILED" ? "destructive" : "secondary"}>
                      {t.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
