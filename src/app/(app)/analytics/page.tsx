import { DollarSign, Eye, ShoppingCart, TrendingUp } from "lucide-react";

import { getCampaignPerformance, getTopCities, getTopLanguages, getTopPerformingCreators } from "@/lib/analytics";
import { getTopNiches } from "@/lib/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopNichesChart } from "@/components/dashboard/charts";
import { Leaderboard } from "@/components/analytics/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function AnalyticsPage() {
  const [performers, campaignPerf, topCities, topLanguages, topNiches] = await Promise.all([
    getTopPerformingCreators(),
    getCampaignPerformance(),
    getTopCities(),
    getTopLanguages(),
    getTopNiches(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Performance insights across your creator roster and campaigns.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average Campaign ROI" value={formatPercent(campaignPerf.averageRoi)} icon={TrendingUp} />
        <StatCard label="Cost Per View" value={formatCurrency(campaignPerf.costPerView)} icon={Eye} />
        <StatCard label="Cost Per Sale" value={formatCurrency(campaignPerf.costPerSale)} icon={ShoppingCart} />
        <StatCard label="Total Campaigns" value={String(campaignPerf.campaignCount)} icon={DollarSign} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Leaderboard
          title="Highest Engagement"
          items={performers.highestEngagement.map((c) => ({
            id: c.id,
            name: c.name,
            profileImage: c.profileImage,
            value: `${c.engagementRate.toFixed(1)}%`,
          }))}
        />
        <Leaderboard
          title="Lowest Cost (Reel)"
          items={performers.lowestCost.map((c) => ({
            id: c.id,
            name: c.name,
            profileImage: c.profileImage,
            value: formatCurrency(c.reelPrice),
          }))}
        />
        <Leaderboard
          title="Highest Score"
          items={performers.highestRoi.map((c) => ({
            id: c.id,
            name: c.name,
            profileImage: c.profileImage,
            value: Math.round(c.totalScore).toString(),
          }))}
        />
        <Leaderboard
          title="Best Audience Fit"
          items={performers.bestAudienceFit.map((s) => ({
            id: s.creator.id,
            name: s.creator.name,
            profileImage: s.creator.profileImage,
            value: `${s.audienceFit}/10`,
          }))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopNichesChart data={topNiches} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Cities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topCities.length === 0 && <p className="text-xs text-muted-foreground">No data yet</p>}
              {topCities.map((city) => (
                <div key={city.city} className="flex items-center justify-between text-sm">
                  <span>{city.city}</span>
                  <span className="font-medium">{city.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topLanguages.length === 0 && <p className="text-xs text-muted-foreground">No data yet</p>}
              {topLanguages.map((lang) => (
                <div key={lang.language} className="flex items-center justify-between text-sm">
                  <span>{lang.language}</span>
                  <span className="font-medium">{lang.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
