"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScoreInputSliders } from "@/components/scoring/score-inputs";
import { ScoreRing } from "@/components/scoring/score-ring";
import { ScoreBreakdownList } from "@/components/scoring/score-breakdown";
import { RecommendationBadge } from "@/components/creators/badges";
import {
  calculateScore,
  suggestScores,
  type CreatorMetrics,
  type ScoreInputs,
  type ScoringThresholds,
  type ScoringWeights,
  type Suggestion,
} from "@/lib/scoring";
import { submitScore } from "@/actions/scoring";

const DEFAULT_INPUTS: ScoreInputs = {
  audienceFit: 5,
  trustCredibility: 5,
  contentQuality: 5,
  costEfficiency: 5,
  reach: 5,
};

export type CalculatorCreator = { id: string; name: string } & CreatorMetrics;

export function ScoreCalculatorClient({
  weights,
  thresholds,
  creators,
}: {
  weights: ScoringWeights;
  thresholds: ScoringThresholds;
  creators: CalculatorCreator[];
}) {
  const router = useRouter();
  const [inputs, setInputs] = React.useState<ScoreInputs>(DEFAULT_INPUTS);
  const [creatorId, setCreatorId] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [basis, setBasis] = React.useState<Suggestion["basis"]>({});

  const breakdown = React.useMemo(() => calculateScore(inputs, weights, thresholds), [inputs, weights, thresholds]);

  function updateInput(key: keyof ScoreInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    // Once you move a slider yourself, the suggested-value hint is no longer
    // describing what's on screen.
    setBasis((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function handleCreatorChange(id: string) {
    setCreatorId(id);
    const creator = creators.find((c) => c.id === id);
    if (!creator) return;

    const { values, basis: why } = suggestScores(creator);
    setInputs({ ...DEFAULT_INPUTS, ...values });
    setBasis(why);

    const filled = Object.keys(values).length;
    toast[filled ? "success" : "info"](
      filled
        ? `${filled} categories auto-filled from ${creator.name}'s real data.`
        : `${creator.name} has no follower/pricing data saved — rate manually.`
    );
  }

  async function handleSave() {
    if (!creatorId) {
      toast.error("Select a creator to save this score to.");
      return;
    }
    setIsSaving(true);
    try {
      await submitScore({ creatorId, ...inputs });
      toast.success("Score saved to creator profile.");
      router.push(`/creators/${creatorId}`);
    } catch {
      toast.error("Something went wrong saving the score.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Start from a creator</CardTitle>
            <CardDescription>
              Reach, Trust and Cost Efficiency get filled from their saved metrics. Audience Fit and
              Content Quality are always yours to judge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={creatorId} onValueChange={handleCreatorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a creator (optional)" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate each category</CardTitle>
            <CardDescription>Score 1-10. Weighted totals update instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreInputSliders values={inputs} onChange={updateInput} weights={weights} basis={basis} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <ScoreRing percentage={breakdown.percentage} grade={breakdown.grade} color={breakdown.recommendationColor} />
            <RecommendationBadge recommendation={breakdown.recommendation} />
            <p className="text-sm text-muted-foreground">
              {breakdown.totalScore.toFixed(1)} / {breakdown.maxScore.toFixed(0)} points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreBreakdownList inputs={inputs} breakdown={breakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Save</CardTitle>
            <CardDescription>
              {creatorId
                ? `Attaches this score to ${creators.find((c) => c.id === creatorId)?.name ?? "the selected creator"}.`
                : "Select a creator above to save this score."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleSave} disabled={isSaving || !creatorId}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              Save Score
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
