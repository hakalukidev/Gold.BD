"use client";

import { History } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatBDT, formatDateTime } from "@/lib/format";

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <EmptyState icon={History} title="No transactions yet" description="Buy, sell, deposit, or withdraw to see activity here." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Gold</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                    <TableCell className="font-medium">{t.type}</TableCell>
                    <TableCell>{t.goldGrams ? `${t.goldGrams} g` : "—"}</TableCell>
                    <TableCell>{t.pricePerGramBDT ? formatBDT(t.pricePerGramBDT) : "—"}</TableCell>
                    <TableCell className="font-medium">{formatBDT(t.totalAmountBDT)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          t.status === "COMPLETED" ? "default" : t.status === "FAILED" ? "destructive" : "secondary"
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
