"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScoreInputSliders } from "@/components/scoring/score-inputs";
import { ScoreRing } from "@/components/scoring/score-ring";
import { RecommendationBadge } from "@/components/creators/badges";
import { calculateScore, type ScoreInputs, type ScoringThresholds, type ScoringWeights } from "@/lib/scoring";
import { submitScore } from "@/actions/scoring";

const DEFAULT_INPUTS: ScoreInputs = {
  audienceFit: 5,
  trustCredibility: 5,
  contentQuality: 5,
  costEfficiency: 5,
  reach: 5,
};

export function AddScoreDialog({
  creatorId,
  weights,
  thresholds,
  trigger,
}: {
  creatorId: string;
  weights: ScoringWeights;
  thresholds: ScoringThresholds;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [inputs, setInputs] = React.useState<ScoreInputs>(DEFAULT_INPUTS);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const breakdown = React.useMemo(() => calculateScore(inputs, weights, thresholds), [inputs, weights, thresholds]);

  function updateInput(key: keyof ScoreInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await submitScore({ creatorId, ...inputs });
      toast.success("Score saved");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to save score");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Plus /> Add Score
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Score this creator</DialogTitle>
          <DialogDescription>Rate each category from 1-10. Totals update instantly.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[1.4fr_1fr]">
          <ScoreInputSliders values={inputs} onChange={updateInput} weights={weights} />
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-muted/50 p-4">
            <ScoreRing
              percentage={breakdown.percentage}
              grade={breakdown.grade}
              size={120}
              strokeWidth={9}
              color={breakdown.recommendationColor}
            />
            <RecommendationBadge recommendation={breakdown.recommendation} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Save Score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
