import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Calculator,
  BarChart3,
  FileText,
  Settings,
  UserCircle,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Creators", href: "/creators", icon: Users },
  { title: "Campaigns", href: "/campaigns", icon: Megaphone },
  { title: "Score Calculator", href: "/score-calculator", icon: Calculator },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings, adminOnly: true },
  { title: "Profile", href: "/profile", icon: UserCircle },
];
