import { Users, BadgeCheck, Megaphone, Crown, Target, DollarSign, Heart, CalendarRange } from "lucide-react";

import {
  getAverageScoreByNiche,
  getCampaignRoi,
  getDashboardStats,
  getMonthlyCollaborationsTrend,
  getRecentActivity,
  getRelationshipFunnel,
  getScoreDistribution,
  getTopNiches,
} from "@/lib/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  AverageScoreByNicheChart,
  CampaignRoiChart,
  MonthlyCollaborationsChart,
  RelationshipFunnelChart,
  ScoreDistributionChart,
  TopNichesChart,
} from "@/components/dashboard/charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, distribution, funnel, roi, monthly, niches, avgScoreByNiche, activity] = await Promise.all([
    getDashboardStats(),
    getScoreDistribution(),
    getRelationshipFunnel(),
    getCampaignRoi(),
    getMonthlyCollaborationsTrend(),
    getTopNiches(),
    getAverageScoreByNiche(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          A data-driven overview of your creator roster and collaborations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Creators" value={formatCompactNumber(stats.totalCreators)} icon={Users} />
        <StatCard label="Qualified Creators" value={formatCompactNumber(stats.qualifiedCreators)} icon={BadgeCheck} />
        <StatCard label="Active Campaigns" value={formatCompactNumber(stats.activeCampaigns)} icon={Megaphone} />
        <StatCard label="Ambassadors" value={formatCompactNumber(stats.ambassadors)} icon={Crown} />
        <StatCard label="Average Score" value={stats.averageScore.toFixed(1)} icon={Target} />
        <StatCard label="Average Cost" value={formatCurrency(stats.averageCost)} icon={DollarSign} />
        <StatCard label="Average Engagement" value={formatPercent(stats.averageEngagement)} icon={Heart} />
        <StatCard label="Monthly Collaborations" value={formatCompactNumber(stats.monthlyCollaborations)} icon={CalendarRange} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreDistributionChart data={distribution} />
        <RelationshipFunnelChart data={funnel} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CampaignRoiChart data={roi} />
        <MonthlyCollaborationsChart data={monthly} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopNichesChart data={niches} />
        <AverageScoreByNicheChart data={avgScoreByNiche} />
      </div>

      <RecentActivity {...activity} />
    </div>
  );
}
