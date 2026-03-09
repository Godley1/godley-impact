"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type Volunteer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

export default function VolunteersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      // make sure user is logged in
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        setError(sessionErr.message);
        setLoading(false);
        return;
      }

      if (!sessionData.session) {
        window.location.href = "/login";
        return;
      }

      // Pull ONLY basic info from the safe view
      const { data, error } = await supabase
        .from("volunteer_directory")
        .select("id, first_name, last_name")
        .order("first_name", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setVolunteers((data ?? []) as Volunteer[]);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading volunteers…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Volunteers</h1>

      {error && (
        <p style={{ color: "crimson", marginBottom: 12 }}>
          Error: {error}
        </p>
      )}

      {!error && volunteers.length === 0 && (
        <p>No volunteers found (either none exist yet or RLS is blocking you).</p>
      )}

      {!error && volunteers.length > 0 && (
        <ul style={{ marginTop: 12 }}>
          {volunteers.map((v) => (
            <li key={v.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              {(v.first_name ?? "").trim()} {(v.last_name ?? "").trim()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}