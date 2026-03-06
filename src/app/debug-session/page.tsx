

import { createClient } from "@/lib/supabase/server";

export default async function DebugSessionPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <pre style={{ padding: 20 }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}