import { prisma } from "@/lib/prisma";
import { ExportActions } from "@/components/reports/export-actions";

export default async function ReportsPage() {
  const creators = await prisma.creator.findMany({
    orderBy: { totalScore: "desc" },
    select: {
      name: true,
      instagramUsername: true,
      platform: true,
      niche: true,
      creatorType: true,
      collaborationCategory: true,
      followers: true,
      engagementRate: true,
      totalScore: true,
      grade: true,
      recommendation: true,
      relationshipStage: true,
      status: true,
      email: true,
      phone: true,
      monthlyRetainer: true,
      couponCode: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports & Data Exports</h1>
        <p className="text-sm text-muted-foreground">
          Export your complete PRD creator database, generate printable PDF summaries, and export Excel workbooks.
        </p>
      </div>

      <ExportActions creators={creators as any} />
    </div>
  );
}
