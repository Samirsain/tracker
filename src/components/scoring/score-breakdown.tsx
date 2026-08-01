import { Progress } from "@/components/ui/progress";
import { SCORE_CATEGORIES, type ScoreBreakdown as ScoreBreakdownType, type ScoreInputs } from "@/lib/scoring";

const SCORE_FIELD_MAP: Record<string, keyof ScoreBreakdownType> = {
  audienceFit: "audienceScore",
  trustCredibility: "trustScore",
  contentQuality: "contentScore",
  costEfficiency: "costScore",
  reach: "reachScore",
};

export function ScoreBreakdownList({
  inputs,
  breakdown,
}: {
  inputs: ScoreInputs;
  breakdown: ScoreBreakdownType;
}) {
  return (
    <div className="space-y-4">
      {SCORE_CATEGORIES.map((category) => {
        const rawValue = inputs[category.key as keyof ScoreInputs];
        const weightedScore = breakdown[SCORE_FIELD_MAP[category.key]] as number;
        return (
          <div key={category.key} className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">{category.label}</p>
              <p className="text-sm text-muted-foreground">
                {rawValue}/10 · <span className="font-medium text-foreground">{weightedScore.toFixed(1)} pts</span>
              </p>
            </div>
            <Progress value={(rawValue / 10) * 100} />
          </div>
        );
      })}
    </div>
  );
}
