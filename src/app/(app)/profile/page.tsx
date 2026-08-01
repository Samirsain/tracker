import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { initials } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account details.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            {session.user.image && <AvatarImage src={session.user.image} alt={session.user.name ?? ""} />}
            <AvatarFallback>{initials(session.user.name || session.user.email || "U")}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{session.user.name || "Unnamed"}</CardTitle>
            <CardDescription>{session.user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm
            name={session.user.name || ""}
            email={session.user.email || ""}
            role={session.user.role}
          />
        </CardContent>
      </Card>
    </div>
  );
}
