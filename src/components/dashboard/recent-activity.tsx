import Link from "next/link";
import { CalendarClock, MessageCircle, Plus, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, initials } from "@/lib/utils";
import { labelFor, COMMUNICATION_TYPE_OPTIONS, NICHE_OPTIONS } from "@/lib/constants";

type CreatorRef = { id: string; name: string; profileImage: string | null };

function EmptyRow({ label }: { label: string }) {
  return <p className="py-4 text-center text-xs text-muted-foreground">{label}</p>;
}

function CreatorRow({ creator, meta, right }: { creator: CreatorRef; meta: string; right?: React.ReactNode }) {
  return (
    <Link
      href={`/creators/${creator.id}`}
      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
    >
      <Avatar className="h-8 w-8">
        {creator.profileImage && <AvatarImage src={creator.profileImage} alt={creator.name} />}
        <AvatarFallback className="text-xs">{initials(creator.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{creator.name}</p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
      {right}
    </Link>
  );
}

export function RecentActivity({
  recentCreators,
  recentScores,
  recentCommunications,
  upcomingFollowUps,
}: {
  recentCreators: { id: string; name: string; profileImage: string | null; niche: string; createdAt: Date }[];
  recentScores: {
    id: string;
    totalScore: number;
    createdAt: Date;
    creator: CreatorRef;
  }[];
  recentCommunications: {
    id: string;
    type: string;
    createdAt: Date;
    creator: CreatorRef;
  }[];
  upcomingFollowUps: {
    id: string;
    nextFollowUpDate: Date | null;
    creator: CreatorRef;
  }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Recently Added Creators</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          {recentCreators.length === 0 && <EmptyRow label="No creators yet" />}
          {recentCreators.map((creator) => (
            <CreatorRow
              key={creator.id}
              creator={creator}
              meta={`${labelFor(NICHE_OPTIONS, creator.niche)} · ${formatDate(creator.createdAt)}`}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Recently Updated Scores</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          {recentScores.length === 0 && <EmptyRow label="No scores yet" />}
          {recentScores.map((score) => (
            <CreatorRow
              key={score.id}
              creator={score.creator}
              meta={formatDate(score.createdAt)}
              right={<Badge variant="secondary">{Math.round(score.totalScore)}</Badge>}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Latest Conversations</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          {recentCommunications.length === 0 && <EmptyRow label="No conversations yet" />}
          {recentCommunications.map((comm) => (
            <CreatorRow
              key={comm.id}
              creator={comm.creator}
              meta={`${labelFor(COMMUNICATION_TYPE_OPTIONS, comm.type)} · ${formatDate(comm.createdAt)}`}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Upcoming Follow Ups</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          {upcomingFollowUps.length === 0 && <EmptyRow label="Nothing scheduled" />}
          {upcomingFollowUps.map((followUp) => (
            <CreatorRow
              key={followUp.id}
              creator={followUp.creator}
              meta={`Due ${formatDate(followUp.nextFollowUpDate)}`}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
