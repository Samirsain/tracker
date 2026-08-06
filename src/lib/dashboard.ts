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
  try {
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
      prisma.creator.count().catch(() => 0),
      prisma.creator.count({ where: { totalScore: { gte: 70 } } }).catch(() => 0),
      prisma.campaign.count({ where: { status: "ACTIVE" } }).catch(() => 0),
      prisma.creator.count({ where: { relationshipStage: "AMBASSADOR" } }).catch(() => 0),
      prisma.creator.aggregate({ _avg: { totalScore: true } }).catch(() => ({ _avg: { totalScore: null } })),
      prisma.creator.aggregate({ _avg: { engagementRate: true } }).catch(() => ({ _avg: { engagementRate: null } })),
      prisma.creator.aggregate({ _avg: { reelPrice: true, postPrice: true, storyPrice: true } }).catch(() => ({ _avg: { reelPrice: null, postPrice: null, storyPrice: null } })),
      prisma.campaignCreator.count({ where: { createdAt: { gte: startOfMonth } } }).catch(() => 0),
    ]);

    const prices = [priceAgg._avg.reelPrice, priceAgg._avg.postPrice, priceAgg._avg.storyPrice].filter(
      (v): v is number => typeof v === "number" && !isNaN(v)
    );
    const avgCost = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    return {
      totalCreators: totalCreators ?? 0,
      qualifiedCreators: qualifiedCreators ?? 0,
      activeCampaigns: activeCampaigns ?? 0,
      ambassadors: ambassadors ?? 0,
      averageScore: scoreAgg._avg.totalScore ?? 0,
      averageCost: avgCost,
      averageEngagement: engagementAgg._avg.engagementRate ?? 0,
      monthlyCollaborations: monthlyCollaborations ?? 0,
    };
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    return {
      totalCreators: 0,
      qualifiedCreators: 0,
      activeCampaigns: 0,
      ambassadors: 0,
      averageScore: 0,
      averageCost: 0,
      averageEngagement: 0,
      monthlyCollaborations: 0,
    };
  }
}

export async function getScoreDistribution() {
  try {
    const creators = await prisma.creator.findMany({ select: { totalScore: true } });
    return SCORE_BUCKETS.map((bucket) => ({
      range: bucket.label,
      count: creators.filter((c) => c.totalScore >= bucket.min && c.totalScore <= bucket.max).length,
    }));
  } catch {
    return SCORE_BUCKETS.map((b) => ({ range: b.label, count: 0 }));
  }
}

export async function getRelationshipFunnel() {
  try {
    const grouped = await prisma.creator.groupBy({
      by: ["relationshipStage"],
      _count: { _all: true },
    });
    const map = new Map(grouped.map((g) => [g.relationshipStage, g._count._all]));
    return RELATIONSHIP_STAGE_OPTIONS.map((stage) => ({
      stage: stage.label,
      count: map.get(stage.value as never) ?? 0,
    }));
  } catch {
    return RELATIONSHIP_STAGE_OPTIONS.map((stage) => ({ stage: stage.label, count: 0 }));
  }
}

export async function getTopNiches() {
  try {
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
  } catch {
    return [];
  }
}

export async function getAverageScoreByNiche() {
  try {
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
  } catch {
    return [];
  }
}

export async function getMonthlyCollaborationsTrend() {
  try {
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
        }).catch(() => 0)
      )
    );

    return months.map((month, idx) => ({ month: month.label, collaborations: results[idx] }));
  } catch {
    return [];
  }
}

export async function getCampaignRoi() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return campaigns.map((campaign) => ({
      name: campaign.name,
      roi: campaign.cost > 0 ? Math.round(((campaign.revenue - campaign.cost) / campaign.cost) * 1000) / 10 : 0,
    }));
  } catch {
    return [];
  }
}

export async function getRecentActivity() {
  try {
    const [recentCreators, recentScores, recentCommunications, upcomingFollowUps] = await Promise.all([
      prisma.creator.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, profileImage: true, niche: true, createdAt: true },
      }).catch(() => []),
      prisma.score.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { creator: { select: { id: true, name: true, profileImage: true } } },
      }).catch(() => []),
      prisma.communication.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { creator: { select: { id: true, name: true, profileImage: true } } },
      }).catch(() => []),
      prisma.communication.findMany({
        where: { nextFollowUpDate: { gte: new Date() } },
        orderBy: { nextFollowUpDate: "asc" },
        take: 5,
        include: { creator: { select: { id: true, name: true, profileImage: true } } },
      }).catch(() => []),
    ]);

    return { recentCreators, recentScores, recentCommunications, upcomingFollowUps };
  } catch {
    return { recentCreators: [], recentScores: [], recentCommunications: [], upcomingFollowUps: [] };
  }
}
