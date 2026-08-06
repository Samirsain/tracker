export type ScoreInputs = {
  audienceFit: number;
  trustCredibility: number;
  contentQuality: number;
  costEfficiency: number;
  reach: number;
};

export type ScoringWeights = {
  audienceWeight: number;
  trustWeight: number;
  contentWeight: number;
  costWeight: number;
  reachWeight: number;
};

export type ScoringThresholds = {
  thresholdAmbassador: number;
  thresholdPaidReel: number;
  thresholdAffiliate: number;
  thresholdBarter: number;
};

export const DEFAULT_WEIGHTS: ScoringWeights = {
  audienceWeight: 3,
  trustWeight: 2.5,
  contentWeight: 2,
  costWeight: 1.5,
  reachWeight: 1,
};

export const DEFAULT_THRESHOLDS: ScoringThresholds = {
  thresholdAmbassador: 90,
  thresholdPaidReel: 80,
  thresholdAffiliate: 70,
  thresholdBarter: 60,
};

export const SCORE_CATEGORIES = [
  {
    key: "audienceFit",
    label: "Audience Fit",
    weightKey: "audienceWeight",
    questions: [
      "Does the audience match our customer?",
      "Is the audience health conscious?",
      "Does the audience have premium buying power?",
      "Is there strong brand alignment?",
    ],
  },
  {
    key: "trustCredibility",
    label: "Trust & Credibility",
    weightKey: "trustWeight",
    questions: [
      "Do followers trust the creator?",
      "Are recommendations authentic?",
      "Are there too many promotions?",
      "Is comment quality high?",
    ],
  },
  {
    key: "contentQuality",
    label: "Content Quality",
    weightKey: "contentWeight",
    questions: ["Editing", "Storytelling", "Consistency", "Creativity", "Product explanation"],
  },
  {
    key: "costEfficiency",
    label: "Cost Efficiency",
    weightKey: "costWeight",
    questions: ["Price vs Reach", "Price vs Views", "Price vs Engagement"],
  },
  {
    key: "reach",
    label: "Reach",
    weightKey: "reachWeight",
    questions: ["Followers", "Average Views", "Story Reach"],
  },
] as const;

export type Recommendation =
  | "Founding Ambassador"
  | "Paid Reel Campaign"
  | "Affiliate / Story Campaign"
  | "Barter"
  | "Skip";

export const RECOMMENDATION_COLORS: Record<Recommendation, string> = {
  "Founding Ambassador": "#166534", // dark green
  "Paid Reel Campaign": "#22c55e", // green
  "Affiliate / Story Campaign": "#eab308", // yellow
  Barter: "#f97316", // orange
  Skip: "#ef4444", // red
};

export type ScoreBreakdown = {
  audienceScore: number;
  trustScore: number;
  contentScore: number;
  costScore: number;
  reachScore: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  recommendation: Recommendation;
  recommendationColor: string;
};

function clampInput(value: number) {
  return Math.min(10, Math.max(1, Math.round(value)));
}

export function calculateScore(
  inputs: ScoreInputs,
  weights: ScoringWeights = DEFAULT_WEIGHTS,
  thresholds: ScoringThresholds = DEFAULT_THRESHOLDS
): ScoreBreakdown {
  const audienceFit = clampInput(inputs.audienceFit);
  const trustCredibility = clampInput(inputs.trustCredibility);
  const contentQuality = clampInput(inputs.contentQuality);
  const costEfficiency = clampInput(inputs.costEfficiency);
  const reach = clampInput(inputs.reach);

  const audienceScore = audienceFit * weights.audienceWeight;
  const trustScore = trustCredibility * weights.trustWeight;
  const contentScore = contentQuality * weights.contentWeight;
  const costScore = costEfficiency * weights.costWeight;
  const reachScore = reach * weights.reachWeight;

  const totalScore = audienceScore + trustScore + contentScore + costScore + reachScore;
  const maxScore =
    10 *
    (weights.audienceWeight +
      weights.trustWeight +
      weights.contentWeight +
      weights.costWeight +
      weights.reachWeight);
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  const recommendation = getRecommendation(percentage, thresholds);

  return {
    audienceScore,
    trustScore,
    contentScore,
    costScore,
    reachScore,
    totalScore,
    maxScore,
    percentage,
    grade: getGrade(percentage),
    recommendation,
    recommendationColor: RECOMMENDATION_COLORS[recommendation],
  };
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

export function getRecommendation(
  percentage: number,
  thresholds: ScoringThresholds = DEFAULT_THRESHOLDS
): Recommendation {
  if (percentage >= thresholds.thresholdAmbassador) return "Founding Ambassador";
  if (percentage >= thresholds.thresholdPaidReel) return "Paid Reel Campaign";
  if (percentage >= thresholds.thresholdAffiliate) return "Affiliate / Story Campaign";
  if (percentage >= thresholds.thresholdBarter) return "Barter";
  return "Skip";
}

// ─── Auto-suggested slider values ─────────────────────────────────────────
//
// These turn a creator's stored metrics into 1-10 starting points for the
// three categories that are actually measurable. Audience Fit and Content
// Quality stay manual — no stored number can honestly stand in for
// "does this audience match our customer" or "is the editing good".
//
// A returned 0 means "not enough data to suggest" — never a score of zero.

/**
 * Cost per 1000 reached, in whatever currency prices are stored in (the rest of
 * the app formats prices as USD).
 * ponytail: linear between these two bounds; tune them to your market rather
 * than reshaping the curve. Defaults are fitted to the reel pricing currently in
 * this workspace (observed CPM ≈ 1-11).
 */
export const CPM_BEST = 1;
export const CPM_WORST = 25;

/** Engagement rate a creator of this size is expected to hit. Scoring against
 *  a tier benchmark stops mega-accounts being punished for normal decay. */
function expectedEngagementRate(followers: number): number {
  if (followers >= 1_000_000) return 1.6;
  if (followers >= 100_000) return 2.5;
  if (followers >= 10_000) return 3.5;
  return 5;
}

export function autoEngagementRate(params: {
  followers: number;
  avgLikes: number;
  avgComments: number;
}): number {
  if (!params.followers) return 0;
  return ((params.avgLikes + params.avgComments) / params.followers) * 100;
}

export function autoCostEfficiencyScore(params: { price: number; reach: number }): number {
  if (!params.price || !params.reach) return 0;
  const cpm = (params.price / params.reach) * 1000;
  return clampInput(10 - ((cpm - CPM_BEST) / (CPM_WORST - CPM_BEST)) * 9);
}

/** Audience size on a log scale: ~1k followers → 1, ~10M → 10. */
export function autoReachScore(params: { followers: number; avgReelViews: number }): number {
  const audience = Math.max(params.followers, params.avgReelViews);
  if (audience <= 0) return 0;
  return clampInput(1 + ((Math.log10(audience) - 3) / 4) * 9);
}

/** Engagement vs. the benchmark for that follower tier: at benchmark → 5,
 *  double the benchmark → 10. Used as the Trust & Credibility starting point,
 *  since a bought/inflated following shows up here first. */
export function autoTrustScore(params: { engagementRate: number; followers: number }): number {
  if (params.engagementRate <= 0) return 0;
  return clampInput((params.engagementRate / expectedEngagementRate(params.followers)) * 5);
}

export type CreatorMetrics = {
  followers: number;
  avgReelViews: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  reelPrice: number | null;
  postPrice: number | null;
  storyPrice: number | null;
};

export type Suggestion = {
  values: Partial<ScoreInputs>;
  /** Human-readable reason per suggested field, shown next to the sliders. */
  basis: Partial<Record<keyof ScoreInputs, string>>;
};

export function suggestScores(metrics: CreatorMetrics): Suggestion {
  const values: Partial<ScoreInputs> = {};
  const basis: Suggestion["basis"] = {};

  const reach = autoReachScore(metrics);
  if (reach) {
    values.reach = reach;
    const audience = Math.max(metrics.followers, metrics.avgReelViews);
    basis.reach = `${audience.toLocaleString("en-US")} ${metrics.avgReelViews > metrics.followers ? "avg reel views" : "followers"}`;
  }

  // Prefer the stored rate; fall back to recomputing it from raw counts.
  const er = metrics.engagementRate > 0 ? metrics.engagementRate : autoEngagementRate(metrics);
  const trust = autoTrustScore({ engagementRate: er, followers: metrics.followers });
  if (trust) {
    values.trustCredibility = trust;
    basis.trustCredibility = `${er.toFixed(2)}% engagement vs ${expectedEngagementRate(metrics.followers)}% expected at this size`;
  }

  const price = metrics.reelPrice ?? metrics.postPrice ?? metrics.storyPrice ?? 0;
  const reachForCpm = metrics.avgReelViews || metrics.followers;
  const cost = autoCostEfficiencyScore({ price, reach: reachForCpm });
  if (cost) {
    values.costEfficiency = cost;
    basis.costEfficiency = `$${((price / reachForCpm) * 1000).toFixed(1)} per 1,000 reached`;
  }

  return { values, basis };
}
