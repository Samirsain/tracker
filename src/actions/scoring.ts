"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateScore, DEFAULT_THRESHOLDS, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { scoreSchema, scoringConfigSchema, type ScoreInput, type ScoringConfigInput } from "@/lib/validations/score";

export async function getScoringConfig() {
  const config = await prisma.scoringConfig.findUnique({ where: { id: 1 } });
  if (config) return config;

  return prisma.scoringConfig.create({
    data: { id: 1, ...DEFAULT_WEIGHTS, ...DEFAULT_THRESHOLDS },
  });
}

export async function updateScoringConfig(input: ScoringConfigInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") {
    throw new Error("Only admins can change scoring weights.");
  }

  const data = scoringConfigSchema.parse(input);

  const config = await prisma.scoringConfig.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/settings");
  revalidatePath("/score-calculator");
  return config;
}

export async function submitScore(input: ScoreInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = scoreSchema.parse(input);
  const config = await getScoringConfig();

  const breakdown = calculateScore(
    data,
    {
      audienceWeight: config.audienceWeight,
      trustWeight: config.trustWeight,
      contentWeight: config.contentWeight,
      costWeight: config.costWeight,
      reachWeight: config.reachWeight,
    },
    {
      thresholdAmbassador: config.thresholdAmbassador,
      thresholdPaidReel: config.thresholdPaidReel,
      thresholdAffiliate: config.thresholdAffiliate,
      thresholdBarter: config.thresholdBarter,
    }
  );

  const [score] = await prisma.$transaction([
    prisma.score.create({
      data: {
        creatorId: data.creatorId,
        audienceFit: data.audienceFit,
        trustCredibility: data.trustCredibility,
        contentQuality: data.contentQuality,
        costEfficiency: data.costEfficiency,
        reach: data.reach,
        audienceScore: breakdown.audienceScore,
        trustScore: breakdown.trustScore,
        contentScore: breakdown.contentScore,
        costScore: breakdown.costScore,
        reachScore: breakdown.reachScore,
        totalScore: breakdown.totalScore,
        grade: breakdown.grade,
        recommendation: breakdown.recommendation,
        scoredById: session.user.id,
      },
    }),
    prisma.creator.update({
      where: { id: data.creatorId },
      data: {
        totalScore: breakdown.totalScore,
        grade: breakdown.grade,
        recommendation: breakdown.recommendation,
      },
    }),
  ]);

  revalidatePath("/creators");
  revalidatePath(`/creators/${data.creatorId}`);
  revalidatePath("/dashboard");

  return { score, breakdown };
}
