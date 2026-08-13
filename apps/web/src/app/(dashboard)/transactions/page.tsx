"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBDT, formatDateTime } from "@gold-bd/utils";

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !transactions || transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
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
                    <TableCell>{formatDateTime(t.createdAt)}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.goldGrams ? `${t.goldGrams} g` : "—"}</TableCell>
                    <TableCell>{t.pricePerGramBDT ? formatBDT(t.pricePerGramBDT) : "—"}</TableCell>
                    <TableCell>{formatBDT(t.totalAmountBDT)}</TableCell>
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
