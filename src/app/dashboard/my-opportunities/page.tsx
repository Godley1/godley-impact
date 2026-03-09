import { createClient } from "@/utils/supabase/server";
import PageHeader from "@/components/dashboard/page-header";
import DashboardCard from "@/components/dashboard/dashboard-card";

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  opportunity_date: string | null;
  volunteers_needed: number | null;
};

function formatDate(date: string | null) {
  if (!date) return "Date not set";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString();
}

export default async function MyOpportunitiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Opportunities"
          description="View the opportunities you’ve joined."
        />
        <DashboardCard>
          <p className="text-sm text-gray-600">
            Unable to load your joined opportunities right now.
          </p>
        </DashboardCard>
      </div>
    );
  }

  const { data: signups, error: signupsError } = await supabase
    .from("opportunity_signups")
    .select("opportunity_id")
    .eq("user_id", user.id);

  if (signupsError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Opportunities"
          description="View the opportunities you’ve joined."
        />
        <DashboardCard>
          <p className="text-sm text-red-600">
            Error loading your joined opportunities.
          </p>
        </DashboardCard>
      </div>
    );
  }

  const opportunityIds =
    signups?.map((signup) => signup.opportunity_id).filter(Boolean) ?? [];

  if (opportunityIds.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Opportunities"
          description="View the opportunities you’ve joined."
        />
        <DashboardCard title="Joined Opportunities">
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-base font-medium text-gray-900">
              You haven’t joined any opportunities yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Once you join an opportunity, it will appear here.
            </p>
          </div>
        </DashboardCard>
      </div>
    );
  }

  const { data: opportunities, error: opportunitiesError } = await supabase
    .from("opportunities")
    .select("id, title, description, location, opportunity_date, volunteers_needed")
    .in("id", opportunityIds);

  if (opportunitiesError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Opportunities"
          description="View the opportunities you’ve joined."
        />
        <DashboardCard>
          <p className="text-sm text-red-600">
            Error loading opportunity details.
          </p>
        </DashboardCard>
      </div>
    );
  }

  const entries: Opportunity[] = opportunities ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Opportunities"
        description="View the opportunities you’ve joined."
      />

      <DashboardCard title="Joined Opportunities">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-base font-medium text-gray-900">
              You haven’t joined any opportunities yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Once you join an opportunity, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-xl border bg-gray-50 p-5"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {opportunity.title}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {opportunity.description || "No description provided yet."}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">Location:</span>{" "}
                    {opportunity.location || "Location not set"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {formatDate(opportunity.opportunity_date)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">
                      Volunteers Needed:
                    </span>{" "}
                    {opportunity.volunteers_needed ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}