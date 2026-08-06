import { redirect } from "next/navigation";
import { Award, Layers, ShieldCheck, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/profile/profile-form";
import { initials } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [creatorCount, campaignCount] = await Promise.all([
    prisma.creator.count(),
    prisma.campaign.count(),
  ]);

  const userName = session.user.name || "Samir Sain";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Premium Profile Header Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Vibrant Gradient Cover */}
        <div className="h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800 p-6 flex justify-end items-start">
          <Badge className="bg-white/20 text-white backdrop-blur-md border-white/30">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Verified Admin
          </Badge>
        </div>

        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4 pb-4 border-b">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl rounded-full">
                {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                <AvatarFallback className="text-2xl font-bold bg-violet-600 text-white">
                  {initials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="mb-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{userName}</h1>
                  <ShieldCheck className="h-5 w-5 text-violet-500 fill-violet-500/20" />
                </div>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-violet-500/10 px-3.5 py-2 text-violet-600 dark:text-violet-400">
                <Layers className="h-4 w-4" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Managed Creators</p>
                  <p className="text-sm font-bold">{creatorCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-indigo-500/10 px-3.5 py-2 text-indigo-600 dark:text-indigo-400">
                <Award className="h-4 w-4" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Live Campaigns</p>
                  <p className="text-sm font-bold">{campaignCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <ProfileForm
              name={userName}
              email={session.user.email || ""}
              role={session.user.role || "ADMIN"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
