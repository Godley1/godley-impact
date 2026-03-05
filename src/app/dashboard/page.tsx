"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        window.location.href = "/login";
        return;
      }
      // optional: show email as fallback
      setName(data.user.email ?? "");
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {name}</p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <a href="/dashboard/volunteers">View Volunteers</a>
        <a href="/onboarding">Change Role</a>
      </div>
    </main>
  );
}