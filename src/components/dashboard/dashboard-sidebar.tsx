"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Clock3,
  Briefcase,
  FolderOpen,
  User,
  ClipboardCheck,
  Users,
  Building2,
  BarChart3,
  Settings,
} from "lucide-react";

type DashboardSidebarProps = {
  isAdmin: boolean;
};

const navItems = [
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
  label: "My Opportunities",
  href: "/dashboard/my-opportunities",
  icon: Briefcase,
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

export default function DashboardSidebar({
  isAdmin,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const visibleNav = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-white">
      <div className="border-b px-6 py-6">
        <Link href="/dashboard" className="block">
          <h1 className="text-xl font-bold text-gray-900">Godley Impact</h1>
          <p className="mt-1 text-xs text-gray-500">
            Volunteer & nonprofit platform
          </p>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}