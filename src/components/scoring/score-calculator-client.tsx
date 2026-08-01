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
import { calculateScore, type ScoreInputs, type ScoringThresholds, type ScoringWeights } from "@/lib/scoring";
import { submitScore } from "@/actions/scoring";

const DEFAULT_INPUTS: ScoreInputs = {
  audienceFit: 5,
  trustCredibility: 5,
  contentQuality: 5,
  costEfficiency: 5,
  reach: 5,
};

export function ScoreCalculatorClient({
  weights,
  thresholds,
  creators,
}: {
  weights: ScoringWeights;
  thresholds: ScoringThresholds;
  creators: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [inputs, setInputs] = React.useState<ScoreInputs>(DEFAULT_INPUTS);
  const [creatorId, setCreatorId] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);

  const breakdown = React.useMemo(() => calculateScore(inputs, weights, thresholds), [inputs, weights, thresholds]);

  function updateInput(key: keyof ScoreInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
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
      <Card>
        <CardHeader>
          <CardTitle>Rate each category</CardTitle>
          <CardDescription>Score 1-10. Weighted totals update instantly.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreInputSliders values={inputs} onChange={updateInput} weights={weights} />
        </CardContent>
      </Card>

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
            <CardTitle className="text-base">Save to a creator</CardTitle>
            <CardDescription>Optionally attach this score to an existing creator profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={creatorId} onValueChange={setCreatorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a creator" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              Save Score
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
