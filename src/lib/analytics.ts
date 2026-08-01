import { prisma } from "@/lib/prisma";

export async function getTopPerformingCreators() {
  const [highestEngagement, lowestCost, mostFollowers] = await Promise.all([
    prisma.creator.findMany({
      orderBy: { engagementRate: "desc" },
      take: 5,
      select: { id: true, name: true, profileImage: true, engagementRate: true },
    }),
    prisma.creator.findMany({
      where: { reelPrice: { not: null, gt: 0 } },
      orderBy: { reelPrice: "asc" },
      take: 5,
      select: { id: true, name: true, profileImage: true, reelPrice: true },
    }),
    prisma.creator.findMany({
      orderBy: { totalScore: "desc" },
      take: 5,
      select: { id: true, name: true, profileImage: true, totalScore: true },
    }),
  ]);

  const latestScores = await prisma.score.findMany({
    orderBy: { createdAt: "desc" },
    include: { creator: { select: { id: true, name: true, profileImage: true } } },
  });
  const seen = new Set<string>();
  const bestAudienceFit = [];
  for (const score of latestScores) {
    if (seen.has(score.creatorId)) continue;
    seen.add(score.creatorId);
    bestAudienceFit.push(score);
    if (bestAudienceFit.length >= 5) break;
  }
  bestAudienceFit.sort((a, b) => b.audienceFit - a.audienceFit);

  return { highestEngagement, lowestCost, highestRoi: mostFollowers, bestAudienceFit };
}

export async function getCampaignPerformance() {
  const campaigns = await prisma.campaign.findMany();

  const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalViews = campaigns.reduce((sum, c) => sum + c.views, 0);
  const totalSales = campaigns.reduce((sum, c) => sum + c.sales, 0);

  const averageRoi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
  const costPerView = totalViews > 0 ? totalCost / totalViews : 0;
  const costPerSale = totalSales > 0 ? totalCost / totalSales : 0;

  return { averageRoi, costPerView, costPerSale, campaignCount: campaigns.length };
}

export async function getTopCities() {
  const grouped = await prisma.creator.groupBy({
    by: ["audienceCity"],
    _count: { _all: true },
    where: { audienceCity: { not: null } },
    orderBy: { _count: { audienceCity: "desc" } },
    take: 6,
  });
  return grouped.map((g) => ({ city: g.audienceCity ?? "Unknown", count: g._count._all }));
}

export async function getTopLanguages() {
  const grouped = await prisma.creator.groupBy({
    by: ["language"],
    _count: { _all: true },
    where: { language: { not: null } },
    orderBy: { _count: { language: "desc" } },
    take: 6,
  });
  return grouped.map((g) => ({ language: g.language ?? "Unknown", count: g._count._all }));
}
