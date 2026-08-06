import { Crown, DollarSign, Eye, Percent, Repeat, ShoppingCart, Target, TrendingUp } from "lucide-react";

import { getPrdSuccessMetrics, getTopCities, getTopLanguages, getTopPerformingCreators } from "@/lib/analytics";
import { getTopNiches } from "@/lib/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopNichesChart } from "@/components/dashboard/charts";
import { Leaderboard } from "@/components/analytics/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function AnalyticsPage() {
  const [performers, metrics, topCities, topLanguages, topNiches] = await Promise.all([
    getTopPerformingCreators(),
    getPrdSuccessMetrics(),
    getTopCities(),
    getTopLanguages(),
    getTopNiches(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics & PRD Performance KPIs</h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive performance metrics, ROI tracking, and creator collaboration success indicators.
        </p>
      </div>

      {/* PRD Section 9 Success Metrics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Return on Ad Spend (ROAS)" value={`${metrics.roas.toFixed(2)}x`} icon={TrendingUp} />
        <StatCard label="Cost Per Acquisition (CPA)" value={formatCurrency(metrics.cpa)} icon={ShoppingCart} />
        <StatCard label="Response Rate" value={formatPercent(metrics.creatorResponseRate)} icon={Target} />
        <StatCard label="Conversion Rate" value={formatPercent(metrics.collaborationConversionRate)} icon={Percent} />
        <StatCard label="Active Ambassadors" value={String(metrics.activeAmbassadors)} icon={Crown} />
        <StatCard label="Repeat Collaboration Rate" value={formatPercent(metrics.repeatCollaborationRate)} icon={Repeat} />
        <StatCard label="Campaign Completion" value={formatPercent(metrics.campaignCompletionRate)} icon={DollarSign} />
        <StatCard label="Cost Per View (CPV)" value={formatCurrency(metrics.costPerView)} icon={Eye} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Leaderboard
          title="Highest Engagement"
          items={performers?.highestEngagement?.map((c) => ({
            id: c.id,
            name: c.name,
            profileImage: c.profileImage,
            value: `${(c.engagementRate ?? 0).toFixed(1)}%`,
          })) ?? []}
        />
        <Leaderboard
          title="Lowest Cost (Reel)"
          items={performers?.lowestCost?.map((c) => ({
            id: c.id,
            name: c.name,
            profileImage: c.profileImage,
            value: formatCurrency(c.reelPrice),
          })) ?? []}
        />
        <Leaderboard
          title="Highest Score"
          items={performers?.highestRoi?.map((c) => ({
            id: c.id,
            name: c.name,
            profileImage: c.profileImage,
            value: Math.round(c.totalScore ?? 0).toString(),
          })) ?? []}
        />
        <Leaderboard
          title="Best Audience Fit"
          items={performers?.bestAudienceFit?.map((s) => ({
            id: s.creator?.id || "unknown",
            name: s.creator?.name || "Unknown",
            profileImage: s.creator?.profileImage || null,
            value: `${s.audienceFit ?? 0}/10`,
          })) ?? []}
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
