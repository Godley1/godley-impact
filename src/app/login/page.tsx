"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient(); // ✅ cookie-aware client

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) setMsg(error.message);
    else setMsg("Signup successful. Now try logging in.");

    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setMsg(error.message);
    else window.location.href = "/dashboard";

    setLoading(false);
  };

  return (
    <main style={{ padding: 24, maxWidth: 420 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Login</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />

        <button onClick={signIn} disabled={loading} style={{ padding: 10, borderRadius: 8, border: "1px solid #000" }}>
          Login
        </button>

        <button onClick={signUp} disabled={loading} style={{ padding: 10, borderRadius: 8, border: "1px solid #000" }}>
          Sign Up
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </main>
  );
}