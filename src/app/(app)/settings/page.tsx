import { Bell, Building2, Image as ImageIcon, Users } from "lucide-react";

import { getScoringConfig } from "@/actions/scoring";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoringSettingsForm } from "@/components/settings/scoring-settings-form";
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
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Admin controls for scoring, branding, and team access.</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" /> Team Members
          </CardTitle>
          <CardDescription>Everyone with access to Creator Score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
                  <AvatarFallback className="text-xs">{initials(user.name || user.email)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role === "ADMIN" ? "Admin" : "Team Member"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Brand Settings
            </CardTitle>
            <CardDescription>Company logo and brand name customization.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" /> Coming soon — logo upload and brand name will appear here.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
            <CardDescription>Configure reminder and alert preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming soon — notification channel preferences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
