"use server";

import { createClient } from "@/lib/supabase/server";

export async function logVolunteerHours(formData: FormData) {

  const supabase = await createClient();

  const nonprofit_id = formData.get("nonprofit_id") as string;
  if (!nonprofit_id) throw new Error("Missing nonprofit_id");

  const minutes = Number(formData.get("minutes"));
  const hours = minutes / 60;

  const event_name = (formData.get("activity") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("volunteer_hours")
    .insert({
      volunteer_id: data.user.id,
      nonprofit_id,
      hours,
      event_name,
      notes,
      status: "pending"
    });

  if (error) {
    throw new Error(error.message);
  }
}