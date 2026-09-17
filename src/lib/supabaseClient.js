import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

/**
 * Validates whether Supabase environment variables have been properly supplied
 * and are not dummy placeholder strings.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseAnonKey.includes("your-anon-public-key")
);

// Fallback to safe placeholder values to ensure createClient() does not throw
// an uncaught error at build/boot time if environment variables are not yet populated.
const safeUrl = isSupabaseConfigured
  ? supabaseUrl
  : "https://placeholder-project.supabase.co";
const safeAnonKey = isSupabaseConfigured
  ? supabaseAnonKey
  : "placeholder-anon-key";

/**
 * Singleton Supabase client instance.
 * Safe to import anywhere in public or admin components.
 */
export const supabase = createClient(safeUrl, safeAnonKey);

export default supabase;
