"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBDT, formatDateTime } from "@gold-bd/utils";

interface AdminTransaction {
  id: string;
  type: string;
  status: string;
  goldGrams: string | null;
  pricePerGramBDT: string | null;
  totalAmountBDT: string;
  createdAt: string;
  user: { fullName: string; phone: string };
}

export default function AdminTransactionsPage() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => api.get<AdminTransaction[]>("/api/admin/transactions"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Gold</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{formatDateTime(t.createdAt)}</TableCell>
                    <TableCell>{t.user.fullName} · {t.user.phone}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.goldGrams ? `${t.goldGrams} g` : "—"}</TableCell>
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
