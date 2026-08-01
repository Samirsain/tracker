"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  scoringConfigSchema,
  type ScoringConfigFormInput,
  type ScoringConfigInput,
} from "@/lib/validations/score";
import { updateScoringConfig } from "@/actions/scoring";

export function ScoringSettingsForm({ defaultValues }: { defaultValues: ScoringConfigFormInput }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScoringConfigFormInput, unknown, ScoringConfigInput>({
    resolver: zodResolver(scoringConfigSchema),
    defaultValues,
  });

  async function onSubmit(values: ScoringConfigInput) {
    setIsSubmitting(true);
    try {
      await updateScoringConfig(values);
      toast.success("Scoring configuration updated");
    } catch {
      toast.error("Failed to update scoring configuration");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scoring Weights</CardTitle>
          <CardDescription>Adjust how much each category contributes to the total score.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Audience Weight</Label>
            <Input type="number" step="0.1" {...register("audienceWeight")} />
          </div>
          <div className="space-y-1.5">
            <Label>Trust Weight</Label>
            <Input type="number" step="0.1" {...register("trustWeight")} />
          </div>
          <div className="space-y-1.5">
            <Label>Content Weight</Label>
            <Input type="number" step="0.1" {...register("contentWeight")} />
          </div>
          <div className="space-y-1.5">
            <Label>Cost Weight</Label>
            <Input type="number" step="0.1" {...register("costWeight")} />
          </div>
          <div className="space-y-1.5">
            <Label>Reach Weight</Label>
            <Input type="number" step="0.1" {...register("reachWeight")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommendation Thresholds</CardTitle>
          <CardDescription>Minimum percentage score required for each recommendation tier.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Founding Ambassador ≥</Label>
            <Input type="number" {...register("thresholdAmbassador")} />
          </div>
          <div className="space-y-1.5">
            <Label>Paid Reel Campaign ≥</Label>
            <Input type="number" {...register("thresholdPaidReel")} />
          </div>
          <div className="space-y-1.5">
            <Label>Affiliate / Story ≥</Label>
            <Input type="number" {...register("thresholdAffiliate")} />
          </div>
          <div className="space-y-1.5">
            <Label>Barter ≥</Label>
            <Input type="number" {...register("thresholdBarter")} />
          </div>
        </CardContent>
      </Card>

      {Object.keys(errors).length > 0 && (
        <p className="text-xs text-destructive">Please check the values you entered.</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
          Save Scoring Settings
        </Button>
      </div>
    </form>
  );
}
