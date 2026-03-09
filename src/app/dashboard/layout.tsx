import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

const {
  data: { user },
  error,
} = await supabase.auth.getUser();

if (error) {
  console.error("Auth error:", error);
}

if (!user) {
  redirect("/login");
}

const isAdmin = user?.email === "bsagodley@gmail.com";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <DashboardSidebar isAdmin={isAdmin} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader email={user.email ?? null} isAdmin={isAdmin} />

          <main className="flex-1 overflow-x-hidden px-10 py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}