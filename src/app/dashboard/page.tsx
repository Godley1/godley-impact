import type { CSSProperties } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ImpactChart from "@/components/dashboard/impact-chart";

type ReviewRow = {
  id: string;
  event_name: string | null;
  hours: number | null;
  status: string | null;
  nonprofit_id: string | null;
  volunteer_id: string | null;
  service_date: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

type MyHourRow = {
  hours: number | null;
  status: string | null;
};

type ImpactHourRow = {
  service_date: string | null;
  hours: number | null;
  status: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div style={{ padding: 24 }}>Not authenticated.</div>;
  }

  const isAdmin = user.email?.toLowerCase() === "bsagodley@gmail.com";

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const displayName = profileData?.full_name || user.email || "User";

  const { data: myHoursData, error: myHoursError } = await supabase
    .from("volunteer_hours")
    .select("hours, status")
    .eq("volunteer_id", user.id);

  if (myHoursError) {
    return <div style={{ padding: 24 }}>Error loading dashboard.</div>;
  }

  const myEntries: MyHourRow[] = myHoursData ?? [];

  const totalHours = myEntries.reduce((sum, row) => sum + (row.hours ?? 0), 0);

  const pendingSubmissions = myEntries.filter(
    (row) => row.status?.toLowerCase() === "pending"
  ).length;

  const approvedHours = myEntries
    .filter((row) => row.status?.toLowerCase() === "approved")
    .reduce((sum, row) => sum + (row.hours ?? 0), 0);

  const { count: opportunitiesCount } = await supabase
    .from("opportunities")
    .select("*", { count: "exact", head: true });

  const { count: joinedCount } = await supabase
    .from("opportunity_signups")
    .select("*", { count: "exact", head: true });

  const { data: hoursData } = await supabase
    .from("volunteer_hours")
    .select("hours");

  const totalHoursLogged =
    hoursData?.reduce((sum, entry) => sum + (entry.hours || 0), 0) ?? 0;

  const { count: pendingHours } = await supabase
    .from("volunteer_hours")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { data: impactHoursData } = await supabase
    .from("volunteer_hours")
    .select("service_date, hours, status");

  const approvedImpactRows: ImpactHourRow[] =
    (impactHoursData ?? []).filter(
      (row) => row.status?.toLowerCase() === "approved" && row.service_date
    ) ?? [];

  const monthlyHoursMap = approvedImpactRows.reduce((acc, row) => {
    if (!row.service_date) return acc;

    const date = new Date(row.service_date);
    if (Number.isNaN(date.getTime())) return acc;

    const monthLabel = date.toLocaleString("default", { month: "short" });
    acc[monthLabel] = (acc[monthLabel] || 0) + (row.hours || 0);

    return acc;
  }, {} as Record<string, number>);

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const impactChartData = monthOrder
    .filter((month) => monthlyHoursMap[month] !== undefined)
    .map((month) => ({
      month,
      hours: monthlyHoursMap[month],
    }));

  let totalPendingForApproval = 0;
  let totalApprovedSystemHours = 0;
  let recentPendingRequests: ReviewRow[] = [];
  let nonprofitMap: Record<string, string> = {};
  let volunteerMap: Record<string, string> = {};

  if (isAdmin) {
    const { data: pendingRowsForCount } = await supabase
      .from("volunteer_hours")
      .select("id")
      .eq("status", "pending");

    totalPendingForApproval = pendingRowsForCount?.length ?? 0;

    const { data: approvedData } = await supabase
      .from("volunteer_hours")
      .select("hours")
      .eq("status", "approved");

    totalApprovedSystemHours =
      approvedData?.reduce((sum, row) => sum + (row.hours ?? 0), 0) ?? 0;

    const { data: pendingRows } = await supabase
      .from("volunteer_hours")
      .select(
        "id, event_name, hours, status, nonprofit_id, volunteer_id, service_date"
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    recentPendingRequests = (pendingRows ?? []) as ReviewRow[];

    const nonprofitIds = [
      ...new Set(recentPendingRequests.map((r) => r.nonprofit_id).filter(Boolean)),
    ] as string[];

    const volunteerIds = [
      ...new Set(recentPendingRequests.map((r) => r.volunteer_id).filter(Boolean)),
    ] as string[];

    if (nonprofitIds.length > 0) {
      const { data: nonprofitProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", nonprofitIds);

      nonprofitMap = (nonprofitProfiles ?? []).reduce<Record<string, string>>(
        (acc, profile) => {
          const p = profile as ProfileRow;
          acc[p.id] = p.full_name || p.id;
          return acc;
        },
        {}
      );
    }

    if (volunteerIds.length > 0) {
      const { data: volunteerProfiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", volunteerIds);

      volunteerMap = (volunteerProfiles ?? []).reduce<Record<string, string>>(
        (acc, profile) => {
          const p = profile as ProfileRow;
          acc[p.id] = p.full_name || p.id;
          return acc;
        },
        {}
      );
    }
  }

  const cardStyle: CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  };

  const linkButtonStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 14px",
    border: "1px solid #111",
    borderRadius: 10,
    textDecoration: "none",
    color: "#111",
    fontWeight: 600,
    background: "#fff",
  };

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <section style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          Godley Impact Platform
        </p>
        <h1 style={{ margin: "8px 0 6px", fontSize: 34, lineHeight: 1.1 }}>
          Welcome back, {displayName}
        </h1>
        <p style={{ margin: 0, color: "#555" }}>
          {isAdmin
            ? "Manage volunteer activity, review approvals, and track community impact."
            : "Track your service hours, monitor approvals, and stay connected to impact."}
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: isAdmin
            ? "repeat(4, minmax(200px, 1fr))"
            : "repeat(3, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Total Hours</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {totalHours}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Pending Submissions</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {pendingSubmissions}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Approved Hours</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {approvedHours}
          </div>
        </div>

        {isAdmin && (
          <div style={cardStyle}>
            <div style={{ fontSize: 14, color: "#666" }}>
              Hours Requested for Approval
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
              {totalPendingForApproval}
            </div>
          </div>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Opportunities Created</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {opportunitiesCount ?? 0}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Opportunities Joined</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {joinedCount ?? 0}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Volunteer Hours Logged</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {totalHoursLogged}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: "#666" }}>Pending Approvals</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
            {pendingHours ?? 0}
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: isAdmin ? "1.2fr 1fr" : "1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 22 }}>
            Quick Actions
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/dashboard/log-hours" style={linkButtonStyle}>
              Log Hours
            </Link>

            <Link href="/dashboard/my-hours" style={linkButtonStyle}>
              View My Logged Hours
            </Link>

            <Link href="/dashboard/opportunities" style={linkButtonStyle}>
              View Opportunities
            </Link>

            <Link href="/dashboard/my-opportunities" style={linkButtonStyle}>
              My Opportunities
            </Link>

            {isAdmin && (
              <>
                <Link href="/dashboard/create-opportunity" style={linkButtonStyle}>
                  Create Opportunity
                </Link>

                <Link href="/dashboard/review-hours" style={linkButtonStyle}>
                  Review Hours
                </Link>
              </>
            )}
          </div>

          <div style={{ marginTop: 20, color: "#666", fontSize: 14 }}>
            {isAdmin
              ? "Use this dashboard to review incoming submissions, manage opportunities, and monitor platform impact."
              : "Use this dashboard to join opportunities, submit service hours, and track approval progress."}
          </div>
        </div>

        {isAdmin && (
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 22 }}>
              Admin Snapshot
            </h2>

            <div style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "#f7f7f7",
                }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>Pending Requests</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  {totalPendingForApproval}
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "#f7f7f7",
                }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>
                  Approved Hours Across System
                </div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  {totalApprovedSystemHours}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 22 }}>
            Community Impact
          </h2>

          {impactChartData.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>
              No approved volunteer hour data is available yet.
            </p>
          ) : (
            <ImpactChart data={impactChartData} />
          )}
        </div>
      </section>

      {isAdmin && (
        <section style={{ marginTop: 28 }}>
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22 }}>Recent Pending Requests</h2>
              <Link
                href="/dashboard/review-hours"
                style={{ textDecoration: "none", fontWeight: 600 }}
              >
                View all
              </Link>
            </div>

            {!recentPendingRequests.length ? (
              <p style={{ color: "#666", margin: 0 }}>No pending requests right now.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Volunteer
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Event
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Hours
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 10,
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Nonprofit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPendingRequests.map((row) => (
                    <tr key={row.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                        {row.volunteer_id
                          ? volunteerMap[row.volunteer_id] || row.volunteer_id
                          : "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                        {row.service_date || "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                        {row.event_name || "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                        {row.hours ?? "-"}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                        {row.nonprofit_id
                          ? nonprofitMap[row.nonprofit_id] || row.nonprofit_id
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </main>
  );
}