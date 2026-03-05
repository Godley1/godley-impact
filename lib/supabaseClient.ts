console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY starts:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20));
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);