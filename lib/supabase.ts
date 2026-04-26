import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://xnyhzyvigazofjoozuub.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWh6eXZpZ2F6b2Zqb296dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDgwODEsImV4cCI6MjA5MjcyNDA4MX0.Vp-kuQu0aSnH2xUlUJwaW-KZkCVon4_VAFGq0gI3DiQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
