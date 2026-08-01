import { Megaphone } from "lucide-react";

import { getCampaigns } from "@/actions/campaigns";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { CreateCampaignDialog } from "@/components/campaigns/create-campaign-dialog";
import { CampaignCard } from "@/components/campaigns/campaign-card";

export default async function CampaignsPage() {
  const [campaigns, creators] = await Promise.all([
    getCampaigns(),
    prisma.creator.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Track budgets, assigned creators, and ROI.</p>
        </div>
        <CreateCampaignDialog creators={creators} />
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Megaphone className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No campaigns yet</p>
            <p className="text-sm text-muted-foreground">Create your first campaign to start tracking ROI.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
