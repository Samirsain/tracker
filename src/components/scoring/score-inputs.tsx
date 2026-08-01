"use client";

import { Slider } from "@/components/ui/slider";
import { DEFAULT_WEIGHTS, SCORE_CATEGORIES, type ScoreInputs as ScoreInputsType, type ScoringWeights } from "@/lib/scoring";

export function ScoreInputSliders({
  values,
  onChange,
  weights = DEFAULT_WEIGHTS,
}: {
  values: ScoreInputsType;
  onChange: (key: keyof ScoreInputsType, value: number) => void;
  weights?: ScoringWeights;
}) {
  return (
    <div className="space-y-6">
      {SCORE_CATEGORIES.map((category) => {
        const key = category.key as keyof ScoreInputsType;
        const weight = weights[category.weightKey as keyof ScoringWeights];
        return (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {category.label} <span className="font-normal text-muted-foreground">({weight}x)</span>
                </p>
                <p className="text-xs text-muted-foreground">{category.questions.join(" · ")}</p>
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums">{values[key]}</span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[values[key]]}
              onValueChange={([value]) => onChange(key, value)}
            />
          </div>
        );
      })}
    </div>
  );
}
