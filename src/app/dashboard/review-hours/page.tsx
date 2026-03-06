import { createClient } from "@/lib/supabase/server";
import { updateHourStatus } from "@/app/actions/reviewHours";

type SubmissionRow = {
  id: string;
  service_date: string | null;
  event_name: string | null;
  hours: number | null;
  status: string | null;
  nonprofit_id: string | null;
  volunteer_id: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

export default async function ReviewHoursPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email?.toLowerCase() === "bsagodley@gmail.com";

  if (!isAdmin) {
    return <div style={{ padding: 24 }}>Admins only.</div>;
  }

  const { data: submissionsData, error } = await supabase
    .from("volunteer_hours")
.select("id, service_date, event_name, hours, status, nonprofit_id, volunteer_id")
.eq("status", "pending")
.order("created_at", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        Failed to load submissions: {error.message}
      </div>
    );
  }

  const submissions = (submissionsData ?? []) as SubmissionRow[];

  const nonprofitIds = [
    ...new Set(submissions.map((s) => s.nonprofit_id).filter(Boolean)),
  ] as string[];

  const volunteerIds = [
    ...new Set(submissions.map((s) => s.volunteer_id).filter(Boolean)),
  ] as string[];

  let nonprofitMap: Record<string, string> = {};
  let volunteerMap: Record<string, string> = {};

  if (nonprofitIds.length > 0) {
    const { data: nonprofitProfilesData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", nonprofitIds);

    nonprofitMap = (nonprofitProfilesData ?? []).reduce<Record<string, string>>(
      (acc, profile) => {
        const p = profile as ProfileRow;
        acc[p.id] = p.full_name || p.id;
        return acc;
      },
      {}
    );
  }

  if (volunteerIds.length > 0) {
    const { data: volunteerProfilesData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", volunteerIds);

    volunteerMap = (volunteerProfilesData ?? []).reduce<Record<string, string>>(
      (acc, profile) => {
        const p = profile as ProfileRow;
        acc[p.id] = p.full_name || p.id;
        return acc;
      },
      {}
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        Review Volunteer Hours
      </h1>

      {!submissions.length ? (
        <p>No submissions found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Volunteer
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Date
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Event
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Hours
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Status
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Nonprofit
              </th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {row.volunteer_id
                    ? volunteerMap[row.volunteer_id] || row.volunteer_id
                    : "-"}
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {row.service_date || "-"}
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {row.event_name || "-"}
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {row.hours ?? "-"}
                </td>

                <td
  style={{
    padding: 8,
    borderBottom: "1px solid #eee",
    fontWeight: 600,
    color:
      row.status === "approved"
        ? "green"
        : row.status === "rejected"
        ? "red"
        : "orange",
  }}
>
  {row.status || "-"}
</td>

                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {row.nonprofit_id
                    ? nonprofitMap[row.nonprofit_id] || row.nonprofit_id
                    : "-"}
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {row.status?.toLowerCase() === "pending" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <form action={updateHourStatus}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button type="submit">Approve</button>
                      </form>

                      <form action={updateHourStatus}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button type="submit">Reject</button>
                      </form>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}