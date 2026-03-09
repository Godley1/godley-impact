import { createClient } from "@/utils/supabase/server";
import PageHeader from "@/components/dashboard/page-header";
import DashboardCard from "@/components/dashboard/dashboard-card";

type HourRow = {
  id: string;
  event_name: string | null;
  service_date: string | null;
  hours: number | null;
  status: string | null;
};

function formatDate(date: string | null) {
  if (!date) return "Not set";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString();
}

function formatStatus(status: string | null) {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function MyHoursPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Hours"
          description="Track and review your logged volunteer time."
        />

        <DashboardCard>
          <p className="text-sm text-gray-600">
            Unable to load your volunteer hours right now.
          </p>
        </DashboardCard>
      </div>
    );
  }

  const { data: hours, error: hoursError } = await supabase
    .from("volunteer_hours")
    .select("id, event_name, service_date, hours, status")
    .eq("volunteer_id", user.id)
    .order("service_date", { ascending: false });

  if (hoursError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Hours"
          description="Track and review your logged volunteer time."
        />

        <DashboardCard>
          <p className="text-sm text-red-600">
            Error loading volunteer hours.
          </p>
        </DashboardCard>
      </div>
    );
  }

  const entries: HourRow[] = hours ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Hours"
        description="Track and review your logged volunteer time."
      />

      <DashboardCard title="Volunteer Hours History" className="max-w-3xl">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-base font-medium text-gray-900">
              No volunteer hours logged yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Once you submit hours, they’ll appear here with their review
              status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-4 py-2 font-medium">Event</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Hours</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="bg-gray-50">
                    <td className="rounded-l-xl px-4 py-3 text-sm font-medium text-gray-900">
                      {entry.event_name || "Untitled Event"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(entry.service_date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {entry.hours ?? 0}
                    </td>
                    <td className="rounded-r-xl px-4 py-3 text-sm">
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                          entry.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : entry.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800",
                        ].join(" ")}
                      >
                        {formatStatus(entry.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}