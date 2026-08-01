import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CAMPAIGN_STATUS_OPTIONS, labelFor } from "@/lib/constants";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

type Campaign = {
  id: string;
  name: string;
  brand: string;
  status: string;
  budget: number;
  views: number;
  clicks: number;
  sales: number;
  revenue: number;
  cost: number;
  startDate: Date | null;
  endDate: Date | null;
  creators: { creator: { id: string; name: string; profileImage: string | null } }[];
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const roi = campaign.cost > 0 ? ((campaign.revenue - campaign.cost) / campaign.cost) * 100 : 0;
  const conversionRate = campaign.clicks > 0 ? (campaign.sales / campaign.clicks) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{campaign.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{campaign.brand}</p>
        </div>
        <Badge variant="secondary">{labelFor(CAMPAIGN_STATUS_OPTIONS, campaign.status)}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Budget</p>
            <p className="font-medium">{formatCurrency(campaign.budget)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Revenue</p>
            <p className="font-medium">{formatCurrency(campaign.revenue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ROI</p>
            <p className={`font-medium ${roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>{roi.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Conversion</p>
            <p className="font-medium">{conversionRate.toFixed(1)}%</p>
          </div>
        </div>

        {(campaign.startDate || campaign.endDate) && (
          <p className="text-xs text-muted-foreground">
            {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
          </p>
        )}

        {campaign.creators.length > 0 && (
          <div className="flex -space-x-2">
            {campaign.creators.slice(0, 6).map(({ creator }) => (
              <Avatar key={creator.id} className="h-7 w-7 border-2 border-background">
                {creator.profileImage && <AvatarImage src={creator.profileImage} alt={creator.name} />}
                <AvatarFallback className="text-[10px]">{initials(creator.name)}</AvatarFallback>
              </Avatar>
            ))}
            {campaign.creators.length > 6 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                +{campaign.creators.length - 6}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
