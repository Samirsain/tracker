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

type CreatorWithPrd = Creator & {
  creatorType?: string | null;
  collaborationCategory?: string | null;
  monthlyRetainer?: number | null;
  productInterested?: string | null;
  couponCode?: string | null;
  deliverablesCompleted?: string | null;
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );
}

export function OverviewTab({ creator }: { creator: Creator }) {
  const c = creator as CreatorWithPrd;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information & PRD Categorization</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Platform" value={labelFor(PLATFORM_OPTIONS, c.platform)} />
          <DetailRow label="Niche" value={labelFor(NICHE_OPTIONS, c.niche)} />
          <DetailRow label="Creator Type" value={labelFor(CREATOR_TYPE_OPTIONS, c.creatorType || "LIFESTYLE")} />
          <DetailRow label="Collaboration Category" value={labelFor(COLLABORATION_CATEGORY_OPTIONS, c.collaborationCategory || "BARTER")} />
          <DetailRow label="Location" value={c.location} />
          <DetailRow label="Language" value={c.language} />
          <DetailRow label="Gender" value={c.gender} />
          <DetailRow label="Email" value={c.email} />
          <DetailRow label="Phone" value={c.phone} />
          <DetailRow label="Website" value={c.website} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audience Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Followers" value={formatCompactNumber(c.followers)} />
          <DetailRow label="Avg. Reel Views" value={formatCompactNumber(c.avgReelViews)} />
          <DetailRow label="Avg. Story Views" value={formatCompactNumber(c.avgStoryViews)} />
          <DetailRow label="Avg. Likes" value={formatCompactNumber(c.avgLikes)} />
          <DetailRow label="Avg. Comments" value={formatCompactNumber(c.avgComments)} />
          <DetailRow label="Engagement Rate" value={formatPercent(c.engagementRate)} />
          <DetailRow label="Audience Age" value={c.audienceAgeRange} />
          <DetailRow label="Audience Gender" value={c.audienceGenderSplit} />
          <DetailRow label="Audience Country" value={c.audienceCountry} />
          <DetailRow label="Audience City" value={c.audienceCity} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commercials & Campaign Tracking (PRD)</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Story Price" value={formatCurrency(c.storyPrice)} />
          <DetailRow label="Reel Price" value={formatCurrency(c.reelPrice)} />
          <DetailRow label="Post Price" value={formatCurrency(c.postPrice)} />
          <DetailRow label="YouTube Price" value={formatCurrency(c.youtubePrice)} />
          <DetailRow label="Monthly Retainer" value={formatCurrency(c.monthlyRetainer)} />
          <DetailRow label="Package Price" value={formatCurrency(c.packagePrice)} />
          <DetailRow label="Product Interested" value={c.productInterested || "-"} />
          <DetailRow label="Coupon Code" value={c.couponCode ? <Badge variant="outline" className="font-mono text-xs font-bold">{c.couponCode}</Badge> : "-"} />
          <DetailRow label="Deliverables Completed" value={c.deliverablesCompleted || "-"} />
          <div className="flex gap-2 pt-2">
            {c.affiliateAvailable && <Badge variant="secondary">Affiliate Available</Badge>}
            {c.barterAvailable && <Badge variant="secondary">Barter Available</Badge>}
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
            <p className="mt-1 whitespace-pre-wrap">{c.managerNotes || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Previous Collaborations</p>
            <p className="mt-1 whitespace-pre-wrap">{c.previousCollaborations || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Special Requirements</p>
            <p className="mt-1 whitespace-pre-wrap">{c.specialRequirements || "-"}</p>
          </div>
          <div className="flex gap-2 pt-1">
            {c.contractAttached && <Badge variant="secondary">Contract Attached</Badge>}
            {c.mediaKitAttached && <Badge variant="secondary">Media Kit Attached</Badge>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
