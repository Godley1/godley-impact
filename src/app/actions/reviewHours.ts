"use server";

import { createClient } from "@/utils/supabase/server";
export async function updateHourStatus(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.email === "bsagodley@gmail.com";

  if (!isAdmin) {
    throw new Error("Admins only.");
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id) {
    throw new Error("Missing submission id.");
  }

  if (!status || !["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status.");
  }

  const { error } = await supabase
    .from("volunteer_hours")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}