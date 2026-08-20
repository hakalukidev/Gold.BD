"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitKycSchema, type SubmitKycInput } from "@/lib/validations/kyc";
import { api, ApiError } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

interface KycProfile {
  id: string;
  nidNumber: string;
  documentUrls: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason: string | null;
}

export default function KycPage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["kyc"],
    queryFn: () => api.get<KycProfile | null>("/api/kyc"),
  });

  const submit = useMutation({
    mutationFn: (values: SubmitKycInput) => api.post("/api/kyc", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const form = useForm<SubmitKycInput>({
    resolver: zodResolver(submitKycSchema),
    defaultValues: { nidNumber: "", documentUrls: [] },
  });

  async function onSubmit(values: SubmitKycInput) {
    try {
      await submit.mutateAsync(values);
      toast.success("KYC submitted — pending review");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Submission failed");
    }
  }

  if (profile && profile.status !== "REJECTED") {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            KYC status
            <Badge variant={profile.status === "APPROVED" ? "default" : "secondary"}>
              {profile.status}
            </Badge>
          </CardTitle>
          <CardDescription>NID: {profile.nidNumber}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Submit KYC</CardTitle>
        <CardDescription>
          {profile?.status === "REJECTED"
            ? `Your previous submission was rejected: ${profile.rejectReason ?? "no reason given"}. Resubmit below.`
            : "Verify your identity to unlock buying and selling gold."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NID number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://…/nid-front.jpg"
                      onChange={(e) => field.onChange(e.target.value ? [e.target.value] : [])}
                    />
                  </FormControl>
                  <FormDescription>
                    File upload isn&apos;t wired up in this scaffold — paste a hosted image URL for now.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting…" : "Submit for review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
