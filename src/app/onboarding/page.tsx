"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "donor" | "volunteer" | "nonprofit" | "community";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("volunteer");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // basic auth guard
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) window.location.href = "/login";
    };
    run();
  }, []);

  const saveProfile = async () => {
    setLoading(true);
    setMsg(null);

    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      setMsg(sessionErr.message);
      setLoading(false);
      return;
    }
    const user = sessionData.session?.user;
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const trimmed = name.trim() || null;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, name: trimmed, role }, { onConflict: "id" });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div style={{ padding: 24, display: "grid", placeItems: "center" }}>
      <div style={{ width: 420, border: "1px solid #ddd", borderRadius: 14, padding: 24 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Choose your role</h1>
        <p style={{ marginTop: 0, color: "#555" }}>This decides which dashboard you see.</p>

        <input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ccc",
            marginTop: 14,
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          {(
            [
              { key: "donor", title: "Donor", desc: "Track giving and impact updates." },
              { key: "volunteer", title: "Volunteer", desc: "Sign up and log volunteer hours." },
              { key: "nonprofit", title: "Nonprofit", desc: "Post needs, manage volunteers, report impact." },
              { key: "community", title: "Community", desc: "Find resources and support programs." },
            ] as const
          ).map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              style={{
                textAlign: "left",
                padding: 14,
                borderRadius: 12,
                border: role === r.key ? "2px solid #000" : "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{r.desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={saveProfile}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #000",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>

        {msg && <p style={{ color: "crimson", marginTop: 10 }}>{msg}</p>}
      </div>
    </div>
  );
}