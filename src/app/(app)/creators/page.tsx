import Link from "next/link";
import { Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { getCreators } from "@/actions/creators";
import { Button } from "@/components/ui/button";
import { CreatorFilters } from "@/components/creators/creator-filters";
import { CreatorTable } from "@/components/creators/creator-table";

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const session = await auth();

  const creators = await getCreators({
    search: params.search,
    niche: params.niche,
    platform: params.platform,
    relationshipStage: params.relationshipStage,
    status: params.status,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Creators</h1>
          <p className="text-sm text-muted-foreground">{creators.length} creators in your database</p>
        </div>
        <Button asChild>
          <Link href="/creators/new">
            <Plus /> Add Creator
          </Link>
        </Button>
      </div>

      <CreatorFilters />

      <CreatorTable creators={creators} canDelete={session?.user.role === "ADMIN"} />
    </div>
  );
}
