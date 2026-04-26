import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://xnyhzyvigazofjoozuub.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWh6eXZpZ2F6b2Zqb296dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDgwODEsImV4cCI6MjA5MjcyNDA4MX0.Vp-kuQu0aSnH2xUlUJwaW-KZkCVon4_VAFGq0gI3DiQ";

const webStorage = {
  getItem: (key: string) =>
    Promise.resolve(typeof localStorage !== "undefined" ? localStorage.getItem(key) : null),
  setItem: (key: string, value: string) =>
    Promise.resolve(typeof localStorage !== "undefined" ? localStorage.setItem(key, value) : undefined),
  removeItem: (key: string) =>
    Promise.resolve(typeof localStorage !== "undefined" ? localStorage.removeItem(key) : undefined),
};

const storage =
  Platform.OS === "web"
    ? webStorage
    : require("@react-native-async-storage/async-storage").default;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
