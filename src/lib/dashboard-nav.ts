import {
  LayoutDashboard,
  Clock3,
  ClipboardCheck,
  Users,
  Building2,
  Briefcase,
  FolderOpen,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
};

export const dashboardNav: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Hours",
    href: "/dashboard/my-hours",
    icon: Clock3,
  },
  {
    label: "Opportunities",
    href: "/dashboard/opportunities",
    icon: Briefcase,
  },
  {
    label: "Resources",
    href: "/dashboard/resources",
    icon: FolderOpen,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Review Hours",
    href: "/dashboard/review-hours",
    icon: ClipboardCheck,
    adminOnly: true,
  },
  {
    label: "Volunteers",
    href: "/dashboard/volunteers",
    icon: Users,
    adminOnly: true,
  },
  {
    label: "Nonprofits",
    href: "/dashboard/nonprofits",
    icon: Building2,
    adminOnly: true,
  },
  {
    label: "Impact Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    adminOnly: true,
  },
];