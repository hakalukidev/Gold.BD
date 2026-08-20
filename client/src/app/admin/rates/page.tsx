"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setGoldRateSchema, type SetGoldRateInput } from "@/lib/validations/gold";
import { api, ApiError } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBDT, formatDateTime } from "@/lib/format";

interface GoldRateRow {
  id: string;
  pricePerGramBDT: string;
  effectiveAt: string;
}

export default function AdminRatesPage() {
  const queryClient = useQueryClient();
  const { data: rates } = useQuery({
    queryKey: ["admin-rates"],
    queryFn: () => api.get<GoldRateRow[]>("/api/admin/rates"),
  });

  const setRate = useMutation({
    mutationFn: (values: SetGoldRateInput) => api.post("/api/admin/rates", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rates"] });
      queryClient.invalidateQueries({ queryKey: ["gold-rate"] });
      toast.success("Rate updated");
    },
    onError: (error) => toast.error(error instanceof ApiError ? error.message : "Failed to set rate"),
  });

  const form = useForm<SetGoldRateInput>({
    resolver: zodResolver(setGoldRateSchema),
    defaultValues: { pricePerGramBDT: 0 },
  });

  return (
    <div className="space-y-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Set gold rate</CardTitle>
          <CardDescription>Takes effect immediately for new buy/sell orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                setRate.mutate(values);
                form.reset({ pricePerGramBDT: 0 });
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="pricePerGramBDT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per gram (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={setRate.isPending}>
                {setRate.isPending ? "Saving…" : "Update rate"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rate history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price / g</TableHead>
                <TableHead>Effective at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{formatBDT(r.pricePerGramBDT)}</TableCell>
                  <TableCell>{formatDateTime(r.effectiveAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
