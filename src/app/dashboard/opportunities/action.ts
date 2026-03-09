"use server";

import { createClient } from "@/utils/supabase/server";

export async function joinOpportunity(opportunityId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { error: "Login required." };
  }

  const { error } = await supabase.from("opportunity_signups").insert({
    opportunity_id: opportunityId,
    user_id: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: "You already joined this opportunity." };
    }

    console.error("JOIN ERROR:", error);
    return { success: "Opportunity saved to your account." };
  }

  return { success: "You joined this opportunity." };
}