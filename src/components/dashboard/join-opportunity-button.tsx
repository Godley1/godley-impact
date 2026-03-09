"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinOpportunity } from "@/app/dashboard/opportunities/action";

type Props = {
  opportunityId: string;
};

export default function JoinOpportunityButton({ opportunityId }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleJoin() {
    setMessage("");

    startTransition(async () => {
      const result = await joinOpportunity(opportunityId);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      if (result?.success) {
        setMessage(result.success);
        router.refresh();
      }
    });
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={handleJoin}
        disabled={isPending}
        style={{
          padding: "8px 14px",
          background: "#111827",
          color: "white",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
        }}
      >
        {isPending ? "Joining..." : "Join Opportunity"}
      </button>

      {message && <p style={{ fontSize: 12, marginTop: 6 }}>{message}</p>}
    </div>
  );
}