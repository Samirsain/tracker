import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

export function Leaderboard({
  title,
  items,
}: {
  title: string;
  items: { id: string; name: string; profileImage: string | null; value: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">No data yet</p>}
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/creators/${item.id}`}
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
          >
            <span className="w-4 shrink-0 text-xs font-medium text-muted-foreground">{index + 1}</span>
            <Avatar className="h-7 w-7">
              {item.profileImage && <AvatarImage src={item.profileImage} alt={item.name} />}
              <AvatarFallback className="text-[10px]">{initials(item.name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium">{item.name}</span>
            <span className="text-sm font-semibold tabular-nums">{item.value}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
