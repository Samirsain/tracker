import { cn } from "@/lib/utils";
import {
  RELATIONSHIP_BADGE_CLASSES,
  RELATIONSHIP_STAGE_OPTIONS,
  STATUS_BADGE_CLASSES,
  STATUS_OPTIONS,
  labelFor,
} from "@/lib/constants";
import { RECOMMENDATION_COLORS, type Recommendation } from "@/lib/scoring";

export function RelationshipStageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        RELATIONSHIP_BADGE_CLASSES[stage]
      )}
    >
      {labelFor(RELATIONSHIP_STAGE_OPTIONS, stage)}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_BADGE_CLASSES[status]
      )}
    >
      {labelFor(STATUS_OPTIONS, status)}
    </span>
  );
}

export function RecommendationBadge({ recommendation }: { recommendation: string | null }) {
  if (!recommendation) {
    return <span className="text-xs text-muted-foreground">Not scored</span>;
  }
  const color = RECOMMENDATION_COLORS[recommendation as Recommendation] ?? "#64748b";
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {recommendation}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex h-8 w-12 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary tabular-nums">
      {Math.round(score)}
    </span>
  );
}
