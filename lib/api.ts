export const API_BASE = "https://xnyhzyvigazofjoozuub.supabase.co/functions/v1";

export const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWh6eXZpZ2F6b2Zqb296dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDgwODEsImV4cCI6MjA5MjcyNDA4MX0.Vp-kuQu0aSnH2xUlUJwaW-KZkCVon4_VAFGq0gI3DiQ";

export function apiHeaders(token?: string) {
  return {
    Authorization: `Bearer ${token ?? ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...apiHeaders(), ...options?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
