import { createClient } from "@/lib/supabase/server";
import { logVolunteerHours } from "@/app/actions/logHours";

export default async function LogHoursPage() {
  const supabase = await createClient();

  // CHANGE `role` + 'nonprofit' if your profiles use a different column/value
  const { data: nonprofits, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "nonprofit");

  if (error) {
    return (
      <pre style={{ padding: 16 }}>
        Failed to load nonprofits: {error.message}
      </pre>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Log Volunteer Hours</h1>

      <form action={logVolunteerHours} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {/* nonprofit dropdown */}
        <label style={{ display: "grid", gap: 6 }}>
          Nonprofit
          <select name="nonprofit_id" required style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}>
            <option value="">Select a nonprofit…</option>
            {(nonprofits ?? []).map((n) => {
              const label = n.full_name || n.id;

              return (
                <option key={n.id} value={n.id}>
                  {label}
                </option>
              );
            })}
          </select>
        </label>

        <input name="service_date" type="date" required />
        <input name="minutes" type="number" min={1} placeholder="Minutes" required />
        <input name="activity" type="text" placeholder="Activity (optional)" />
        <input name="location" type="text" placeholder="Location (optional)" />
        <textarea name="notes" placeholder="Notes (optional)" />

        <button type="submit">Log Hours</button>
      </form>
    </main>
  );
}