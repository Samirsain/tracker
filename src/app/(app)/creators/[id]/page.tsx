import { notFound } from "next/navigation";
import { FileText, History, LineChart } from "lucide-react";

import { auth } from "@/lib/auth";
import { getCreator } from "@/actions/creators";
import { getScoringConfig } from "@/actions/scoring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatorHeader } from "@/components/creators/creator-header";
import { OverviewTab } from "@/components/creators/overview-tab";
import { ScoringTab } from "@/components/creators/scoring-tab";
import { CampaignsTab } from "@/components/creators/campaigns-tab";
import { CommunicationTab } from "@/components/creators/communication-tab";
import { NotesTab } from "@/components/creators/notes-tab";
import { ComingSoon } from "@/components/coming-soon";

export default async function CreatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [creator, session, config] = await Promise.all([getCreator(id), auth(), getScoringConfig()]);

  if (!creator) notFound();

  const weights = {
    audienceWeight: config.audienceWeight,
    trustWeight: config.trustWeight,
    contentWeight: config.contentWeight,
    costWeight: config.costWeight,
    reachWeight: config.reachWeight,
  };
  const thresholds = {
    thresholdAmbassador: config.thresholdAmbassador,
    thresholdPaidReel: config.thresholdPaidReel,
    thresholdAffiliate: config.thresholdAffiliate,
    thresholdBarter: config.thresholdBarter,
  };

  return (
    <div className="space-y-6">
      <CreatorHeader creator={creator} isAdmin={session?.user.role === "ADMIN"} weights={weights} thresholds={thresholds} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab creator={creator} />
        </TabsContent>
        <TabsContent value="scoring">
          <ScoringTab creatorId={creator.id} scores={creator.scores} weights={weights} thresholds={thresholds} />
        </TabsContent>
        <TabsContent value="campaigns">
          <CampaignsTab campaigns={creator.campaigns} />
        </TabsContent>
        <TabsContent value="communication">
          <CommunicationTab creatorId={creator.id} communications={creator.communications} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab creatorId={creator.id} notes={creator.notes} />
        </TabsContent>
        <TabsContent value="files">
          <ComingSoon
            icon={FileText}
            title="File uploads coming soon"
            description="Contract and media kit uploads via Cloudinary will appear here."
          />
        </TabsContent>
        <TabsContent value="history">
          <ComingSoon
            icon={History}
            title="Activity history coming soon"
            description="A full audit trail of changes made to this creator's profile will appear here."
          />
        </TabsContent>
        <TabsContent value="analytics">
          <ComingSoon
            icon={LineChart}
            title="Creator analytics coming soon"
            description="Campaign performance and ROI trends for this creator will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
