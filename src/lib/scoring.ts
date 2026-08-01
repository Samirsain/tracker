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

export function autoEngagementRate(params: {
  followers: number;
  avgLikes: number;
  avgComments: number;
}): number {
  if (!params.followers) return 0;
  return ((params.avgLikes + params.avgComments) / params.followers) * 100;
}

export function autoCostEfficiencyScore(params: {
  price: number;
  reach: number;
}): number {
  if (!params.price || !params.reach) return 0;
  // Cost per 1000 reached — lower is better. Normalize to a 1-10 scale via a soft curve.
  const cpm = (params.price / params.reach) * 1000;
  if (cpm <= 1) return 10;
  if (cpm >= 50) return 1;
  return Math.round(10 - (cpm / 50) * 9);
}
