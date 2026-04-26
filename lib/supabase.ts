import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://xnyhzyvigazofjoozuub.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWh6eXZpZ2F6b2Zqb296dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDgwODEsImV4cCI6MjA5MjcyNDA4MX0.Vp-kuQu0aSnH2xUlUJwaW-KZkCVon4_VAFGq0gI3DiQ";

// On web (including SSR build): use localStorage with window guard.
// On native: use AsyncStorage.
function makeStorage() {
  if (Platform.OS === "web") {
    return {
      getItem: (key: string): string | null => {
        if (typeof window === "undefined") return null;
        return window.localStorage.getItem(key);
      },
      setItem: (key: string, value: string): void => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(key, value);
      },
      removeItem: (key: string): void => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(key);
      },
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@react-native-async-storage/async-storage").default;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: makeStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});
