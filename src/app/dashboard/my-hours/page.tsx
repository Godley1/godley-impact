import { createClient } from "@/lib/supabase/server";

type HourRow = {
  id: string;
  created_at: string | null;
  event_name: string | null;
  hours: number | null;
  status: string | null;
  nonprofit_id: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

export default async function MyHoursPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div style={{ padding: 24 }}>Not authenticated.</div>;
  }

  const { data: hoursData, error: hoursError } = await supabase
    .from("volunteer_hours")
    .select("id, created_at, event_name, hours, status, nonprofit_id")
    .eq("volunteer_id", user.id)
    .order("created_at", { ascending: false });

  if (hoursError) {
    return (
      <div style={{ padding: 24 }}>
        Failed to load hours: {hoursError.message}
      </div>
    );
  }

  const hours = (hoursData ?? []) as HourRow[];

  const nonprofitIds = [...new Set(hours.map((h) => h.nonprofit_id).filter(Boolean))] as string[];

  let nonprofitMap: Record<string, string> = {};

  if (nonprofitIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", nonprofitIds);

    if (!profilesError && profilesData) {
      nonprofitMap = (profilesData as ProfileRow[]).reduce<Record<string, string>>((acc, profile) => {
        acc[profile.id] = profile.full_name || profile.id;
        return acc;
      }, {});
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        My Logged Hours
      </h1>

      {!hours.length ? (
        <p>No hours logged yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Date</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Event</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Hours</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Status</th>
              <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ccc" }}>Nonprofit</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((entry) => (
              <tr key={entry.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "-"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {entry.event_name || "-"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {entry.hours ?? "-"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #eee", textTransform: "capitalize" }}>
                  {entry.status || "-"}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                  {entry.nonprofit_id ? nonprofitMap[entry.nonprofit_id] || entry.nonprofit_id : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}