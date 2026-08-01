import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { UserMenu } from "@/components/layout/user-menu";

export function Topbar({
  role,
  name,
  email,
  image,
}: {
  role: "ADMIN" | "TEAM_MEMBER";
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav role={role} />
      <div className="flex-1">
        <CommandPalette role={role} />
      </div>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
      <ThemeToggle />
      <UserMenu name={name} email={email} image={image} role={role} />
    </header>
  );
}
