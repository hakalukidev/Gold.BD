"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { depositSchema, withdrawSchema, type DepositInput } from "@/lib/validations/wallet";
import { ApiError } from "@/lib/api-client";
import { useDeposit, useWithdraw, useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formatBDT } from "@gold-bd/utils";

function DepositForm() {
  const deposit = useDeposit();
  const form = useForm<DepositInput>({
    resolver: zodResolver(depositSchema),
    defaultValues: { amountBDT: 0 },
  });

  async function onSubmit(values: DepositInput) {
    try {
      await deposit.mutateAsync(values.amountBDT);
      toast.success("Deposit successful");
      form.reset({ amountBDT: 0 });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Deposit failed");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amountBDT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (BDT)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Processing…" : "Deposit"}
        </Button>
      </form>
    </Form>
  );
}

function WithdrawForm() {
  const withdraw = useWithdraw();
  const form = useForm<DepositInput>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { amountBDT: 0 },
  });

  async function onSubmit(values: DepositInput) {
    try {
      await withdraw.mutateAsync(values.amountBDT);
      toast.success("Withdrawal successful");
      form.reset({ amountBDT: 0 });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Withdrawal failed");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amountBDT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (BDT)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Processing…" : "Withdraw"}
        </Button>
      </form>
    </Form>
  );
}

export default function WalletPage() {
  const { data: wallet } = useWallet();

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>
          Cash balance: <span className="font-medium text-foreground">{wallet ? formatBDT(wallet.cashBalanceBDT) : "…"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit">
          <TabsList className="w-full">
            <TabsTrigger value="deposit" className="flex-1">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw" className="flex-1">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="pt-4">
            <DepositForm />
          </TabsContent>
          <TabsContent value="withdraw" className="pt-4">
            <WithdrawForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
