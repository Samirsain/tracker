import { prisma } from "@/lib/prisma";
import { NICHE_OPTIONS, RELATIONSHIP_STAGE_OPTIONS, labelFor } from "@/lib/constants";

const SCORE_BUCKETS = [
  { label: "0-59", min: 0, max: 59.999 },
  { label: "60-69", min: 60, max: 69.999 },
  { label: "70-79", min: 70, max: 79.999 },
  { label: "80-89", min: 80, max: 89.999 },
  { label: "90-100", min: 90, max: 100 },
];

export async function getDashboardStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalCreators,
    qualifiedCreators,
    activeCampaigns,
    ambassadors,
    scoreAgg,
    engagementAgg,
    priceAgg,
    monthlyCollaborations,
  ] = await Promise.all([
    prisma.creator.count(),
    prisma.creator.count({ where: { totalScore: { gte: 70 } } }),
    prisma.campaign.count({ where: { status: "ACTIVE" } }),
    prisma.creator.count({ where: { relationshipStage: "AMBASSADOR" } }),
    prisma.creator.aggregate({ _avg: { totalScore: true } }),
    prisma.creator.aggregate({ _avg: { engagementRate: true } }),
    prisma.creator.aggregate({ _avg: { reelPrice: true, postPrice: true, storyPrice: true } }),
    prisma.campaignCreator.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  const avgCost =
    [priceAgg._avg.reelPrice, priceAgg._avg.postPrice, priceAgg._avg.storyPrice]
      .filter((value): value is number => value !== null)
      .reduce((sum, value, _idx, arr) => sum + value / arr.length, 0) || 0;

  return {
    totalCreators,
    qualifiedCreators,
    activeCampaigns,
    ambassadors,
    averageScore: scoreAgg._avg.totalScore ?? 0,
    averageCost: avgCost,
    averageEngagement: engagementAgg._avg.engagementRate ?? 0,
    monthlyCollaborations,
  };
}

export async function getScoreDistribution() {
  const creators = await prisma.creator.findMany({ select: { totalScore: true } });
  return SCORE_BUCKETS.map((bucket) => ({
    range: bucket.label,
    count: creators.filter((c) => c.totalScore >= bucket.min && c.totalScore <= bucket.max).length,
  }));
}

export async function getRelationshipFunnel() {
  const grouped = await prisma.creator.groupBy({
    by: ["relationshipStage"],
    _count: { _all: true },
  });
  const map = new Map(grouped.map((g) => [g.relationshipStage, g._count._all]));
  return RELATIONSHIP_STAGE_OPTIONS.map((stage) => ({
    stage: stage.label,
    count: map.get(stage.value as never) ?? 0,
  }));
}

export async function getTopNiches() {
  const grouped = await prisma.creator.groupBy({
    by: ["niche"],
    _count: { _all: true },
    orderBy: { _count: { niche: "desc" } },
    take: 6,
  });
  return grouped.map((g) => ({
    niche: labelFor(NICHE_OPTIONS, g.niche),
    count: g._count._all,
  }));
}

export async function getAverageScoreByNiche() {
  const grouped = await prisma.creator.groupBy({
    by: ["niche"],
    _avg: { totalScore: true },
    _count: { _all: true },
  });
  return grouped
    .filter((g) => g._count._all > 0)
    .map((g) => ({
      niche: labelFor(NICHE_OPTIONS, g.niche),
      averageScore: Math.round((g._avg.totalScore ?? 0) * 10) / 10,
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
}

export async function getMonthlyCollaborationsTrend() {
  const months: { key: string; label: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({
      key: `${start.getFullYear()}-${start.getMonth()}`,
      label: start.toLocaleDateString("en-US", { month: "short" }),
      start,
      end,
    });
  }

  const results = await Promise.all(
    months.map((month) =>
      prisma.campaignCreator.count({
        where: { createdAt: { gte: month.start, lt: month.end } },
      })
    )
  );

  return months.map((month, idx) => ({ month: month.label, collaborations: results[idx] }));
}

export async function getCampaignRoi() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return campaigns.map((campaign) => ({
    name: campaign.name,
    roi: campaign.cost > 0 ? Math.round(((campaign.revenue - campaign.cost) / campaign.cost) * 1000) / 10 : 0,
  }));
}

export async function getRecentActivity() {
  const [recentCreators, recentScores, recentCommunications, upcomingFollowUps] = await Promise.all([
    prisma.creator.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, profileImage: true, niche: true, createdAt: true },
    }),
    prisma.score.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { creator: { select: { id: true, name: true, profileImage: true } } },
    }),
    prisma.communication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { creator: { select: { id: true, name: true, profileImage: true } } },
    }),
    prisma.communication.findMany({
      where: { nextFollowUpDate: { gte: new Date() } },
      orderBy: { nextFollowUpDate: "asc" },
      take: 5,
      include: { creator: { select: { id: true, name: true, profileImage: true } } },
    }),
  ]);

  return { recentCreators, recentScores, recentCommunications, upcomingFollowUps };
}
