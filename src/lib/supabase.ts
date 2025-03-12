import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://tnspqanvwsddavkwdfye.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc3BxYW52d3NkZGF2a3dkZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MDMxODcsImV4cCI6MjA1Njk3OTE4N30.4-32_dCu5E6qMkCI0ETiLH2CQFZfl4NCq7YZTa7WQek";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
