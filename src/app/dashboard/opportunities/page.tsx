import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import JoinOpportunityButton from "../../../components/dashboard/join-opportunity-button";

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  opportunity_date: string | null;
  volunteers_needed: number | null;
};

export default async function OpportunitiesPage() {
  const supabase = await createClient();

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .order("opportunity_date", { ascending: true });

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Volunteer Opportunities
          </h1>
          <p style={{ marginTop: 8 }}>
            Find ways to serve with partner nonprofits.
          </p>
        </div>

        <Link
          href="/dashboard/create-opportunity"
          style={{
            padding: "12px 16px",
            background: "#111827",
            color: "white",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          + Create Opportunity
        </Link>
      </div>

      {!opportunities || opportunities.length === 0 ? (
        <p>No opportunities posted yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {opportunities.map((opportunity: Opportunity) => (
           <div
  key={opportunity.id}
  style={{
    border: "1px solid #ddd",
    padding: 16,
    borderRadius: 10,
  }}
>
  <h2 style={{ fontSize: 20, fontWeight: 600 }}>
    {opportunity.title}
  </h2>

  <p>{opportunity.description}</p>

  <p>
    <strong>Location:</strong>{" "}
    {opportunity.location || "Not set"}
  </p>

  <p>
    <strong>Date:</strong>{" "}
    {opportunity.opportunity_date || "Not set"}
  </p>

  <p>
    <strong>Volunteers Needed:</strong>{" "}
    {opportunity.volunteers_needed ?? 0}
  </p>

  <JoinOpportunityButton opportunityId={opportunity.id} />
</div>
          ))}
        </div>
      )}
    </div>
  );
}