"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MessageSquareText } from "lucide-react";
import { verifyOtpSchema, type VerifyOtpInput } from "@/lib/validations/auth";
import { api, ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const purpose = (searchParams.get("purpose") === "REGISTER" ? "REGISTER" : "LOGIN") as
    | "REGISTER"
    | "LOGIN";
  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { phone, code: "", purpose },
  });

  async function onSubmit(values: VerifyOtpInput) {
    try {
      await api.post("/api/auth/verify-otp", values);
      toast.success("Verified — welcome to Gold BD");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Verification failed");
    }
  }

  return (
    <Card className="shadow-lg shadow-black/5">
      <CardHeader>
        <span className="mb-1 flex size-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <MessageSquareText className="size-4.5" strokeWidth={1.75} />
        </span>
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {phone ? <span className="font-medium text-foreground">{phone}</span> : "your phone"}.
          Check the server console in local dev (SMS is mocked).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>6-digit code</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      className="h-11 text-center text-lg tracking-[0.5em]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Verifying…" : "Verify"}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Didn&apos;t get a code? Go back and submit the {purpose === "REGISTER" ? "registration" : "login"} form again to request a new one.
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
