"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBDT, formatDateTime } from "@/lib/format";

interface AdminUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: "USER" | "ADMIN";
  kycStatus: string;
  createdAt: string;
  cashBalanceBDT: string;
  goldBalanceGrams: string;
}

interface PendingKyc {
  id: string;
  nidNumber: string;
  documentUrls: string[];
  user: { fullName: string; phone: string };
}

function PendingKycReview() {
  const queryClient = useQueryClient();
  const { data: pending } = useQuery({
    queryKey: ["admin-kyc-pending"],
    queryFn: () => api.get<PendingKyc[]>("/api/admin/kyc"),
  });

  const review = useMutation({
    mutationFn: (input: { kycProfileId: string; decision: "APPROVED" | "REJECTED" }) =>
      api.patch("/api/admin/kyc", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kyc-pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Review failed"),
  });

  if (!pending || pending.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending KYC review ({pending.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pending.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="font-medium">{p.user.fullName} · {p.user.phone}</p>
              <p className="text-sm text-muted-foreground">NID: {p.nidNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => review.mutate({ kycProfileId: p.id, decision: "APPROVED" })}
                disabled={review.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => review.mutate({ kycProfileId: p.id, decision: "REJECTED" })}
                disabled={review.isPending}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<AdminUser[]>("/api/admin/users"),
  });

  return (
    <div className="space-y-6">
      <PendingKycReview />
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Cash</TableHead>
                    <TableHead>Gold</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.fullName}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "ADMIN" ? "default" : "outline"}>{u.role}</Badge>
                      </TableCell>
                      <TableCell>{u.kycStatus.replace("_", " ")}</TableCell>
                      <TableCell>{formatBDT(u.cashBalanceBDT)}</TableCell>
                      <TableCell>{u.goldBalanceGrams} g</TableCell>
                      <TableCell>{formatDateTime(u.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
