import { Building2, Users } from "lucide-react";

import { getScoringConfig } from "@/actions/scoring";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoringSettingsForm } from "@/components/settings/scoring-settings-form";
import { BrandAndNotificationSettings } from "@/components/settings/brand-notifications-form";
import { initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SettingsPage() {
  const [config, users] = await Promise.all([
    getScoringConfig(),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Settings</h1>
        <p className="text-sm text-muted-foreground">Admin controls for creator scoring weights, brand profile, and team access.</p>
      </div>

      <ScoringSettingsForm
        defaultValues={{
          audienceWeight: config.audienceWeight,
          trustWeight: config.trustWeight,
          contentWeight: config.contentWeight,
          costWeight: config.costWeight,
          reachWeight: config.reachWeight,
          thresholdAmbassador: config.thresholdAmbassador,
          thresholdPaidReel: config.thresholdPaidReel,
          thresholdAffiliate: config.thresholdAffiliate,
          thresholdBarter: config.thresholdBarter,
        }}
      />

      <BrandAndNotificationSettings />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" /> Team Members & Access
          </CardTitle>
          <CardDescription>Active team members with access to Sacred Habit Creator CRM.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-lg border px-3 py-2.5 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
                  <AvatarFallback className="text-xs">{initials(user.name || user.email)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role === "ADMIN" ? "Admin" : "Team Member"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
