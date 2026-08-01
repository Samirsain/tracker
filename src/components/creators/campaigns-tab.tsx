import Link from "next/link";
import { Megaphone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAMPAIGN_STATUS_OPTIONS, labelFor } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

type CampaignAssignment = {
  campaign: {
    id: string;
    name: string;
    brand: string;
    status: string;
    budget: number;
    startDate: Date | null;
    endDate: Date | null;
  };
};

export function CampaignsTab({ campaigns }: { campaigns: CampaignAssignment[] }) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No campaigns yet</p>
          <p className="text-sm text-muted-foreground">
            Assign this creator to a campaign from the{" "}
            <Link href="/campaigns" className="underline">
              Campaigns
            </Link>{" "}
            page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {campaigns.map(({ campaign }) => (
        <Card key={campaign.id}>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{campaign.name}</p>
                <p className="text-sm text-muted-foreground">{campaign.brand}</p>
              </div>
              <Badge variant="secondary">{labelFor(CAMPAIGN_STATUS_OPTIONS, campaign.status)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Budget: {formatCurrency(campaign.budget)}</p>
            {(campaign.startDate || campaign.endDate) && (
              <p className="text-xs text-muted-foreground">
                {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
