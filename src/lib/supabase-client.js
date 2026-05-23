import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail early with explicit warnings if variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "![CRITICAL] Supabase environmental variables are missing.\n" +
    "Check your root .env file and verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);