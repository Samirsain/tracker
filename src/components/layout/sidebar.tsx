"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function Sidebar({ role }: { role: "ADMIN" | "TEAM_MEMBER" }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <BarChart3 className="h-4 w-4" />
        </div>
        <span className="text-base font-semibold text-sidebar-foreground">Creator Score</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.filter((item) => !item.adminOnly || role === "ADMIN").map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                // A tint alone was easy to miss; the rail and the accented icon
                // make the current page unmistakable.
                isActive &&
                  "bg-sidebar-accent font-semibold text-sidebar-accent-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-primary"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/50">
        Creator Score v0.1
      </div>
    </aside>
  );
}
