import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  labelFor,
  NICHE_OPTIONS,
  CREATOR_TYPE_OPTIONS,
  COLLABORATION_CATEGORY_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/lib/constants";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/utils";
import type { Creator } from "@prisma/client";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );
}

export function OverviewTab({ creator }: { creator: Creator }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information & PRD Categorization</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Platform" value={labelFor(PLATFORM_OPTIONS, creator.platform)} />
          <DetailRow label="Niche" value={labelFor(NICHE_OPTIONS, creator.niche)} />
          <DetailRow label="Creator Type" value={labelFor(CREATOR_TYPE_OPTIONS, (creator as any).creatorType || "LIFESTYLE")} />
          <DetailRow label="Collaboration Category" value={labelFor(COLLABORATION_CATEGORY_OPTIONS, (creator as any).collaborationCategory || "BARTER")} />
          <DetailRow label="Location" value={creator.location} />
          <DetailRow label="Language" value={creator.language} />
          <DetailRow label="Gender" value={creator.gender} />
          <DetailRow label="Email" value={creator.email} />
          <DetailRow label="Phone" value={creator.phone} />
          <DetailRow label="Website" value={creator.website} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audience Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Followers" value={formatCompactNumber(creator.followers)} />
          <DetailRow label="Avg. Reel Views" value={formatCompactNumber(creator.avgReelViews)} />
          <DetailRow label="Avg. Story Views" value={formatCompactNumber(creator.avgStoryViews)} />
          <DetailRow label="Avg. Likes" value={formatCompactNumber(creator.avgLikes)} />
          <DetailRow label="Avg. Comments" value={formatCompactNumber(creator.avgComments)} />
          <DetailRow label="Engagement Rate" value={formatPercent(creator.engagementRate)} />
          <DetailRow label="Audience Age" value={creator.audienceAgeRange} />
          <DetailRow label="Audience Gender" value={creator.audienceGenderSplit} />
          <DetailRow label="Audience Country" value={creator.audienceCountry} />
          <DetailRow label="Audience City" value={creator.audienceCity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commercials & Campaign Tracking (PRD)</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Story Price" value={formatCurrency(creator.storyPrice)} />
          <DetailRow label="Reel Price" value={formatCurrency(creator.reelPrice)} />
          <DetailRow label="Post Price" value={formatCurrency(creator.postPrice)} />
          <DetailRow label="YouTube Price" value={formatCurrency(creator.youtubePrice)} />
          <DetailRow label="Monthly Retainer" value={formatCurrency((creator as any).monthlyRetainer)} />
          <DetailRow label="Package Price" value={formatCurrency(creator.packagePrice)} />
          <DetailRow label="Product Interested" value={(creator as any).productInterested || "-"} />
          <DetailRow label="Coupon Code" value={(creator as any).couponCode ? <Badge variant="outline" className="font-mono text-xs font-bold">{ (creator as any).couponCode }</Badge> : "-"} />
          <DetailRow label="Deliverables Completed" value={(creator as any).deliverablesCompleted || "-"} />
          <div className="flex gap-2 pt-2">
            {creator.affiliateAvailable && <Badge variant="secondary">Affiliate Available</Badge>}
            {creator.barterAvailable && <Badge variant="secondary">Barter Available</Badge>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Fit & Internal Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Manager Notes</p>
            <p className="mt-1 whitespace-pre-wrap">{creator.managerNotes || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Previous Collaborations</p>
            <p className="mt-1 whitespace-pre-wrap">{creator.previousCollaborations || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Special Requirements</p>
            <p className="mt-1 whitespace-pre-wrap">{creator.specialRequirements || "-"}</p>
          </div>
          <div className="flex gap-2 pt-1">
            {creator.contractAttached && <Badge variant="secondary">Contract Attached</Badge>}
            {creator.mediaKitAttached && <Badge variant="secondary">Media Kit Attached</Badge>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
