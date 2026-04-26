import { supabase } from "./supabase";

export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://xnyhzyvigazofjoozuub.supabase.co/functions/v1";

export const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWh6eXZpZ2F6b2Zqb296dXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDgwODEsImV4cCI6MjA5MjcyNDA4MX0.Vp-kuQu0aSnH2xUlUJwaW-KZkCVon4_VAFGq0gI3DiQ";

export function apiHeaders(token?: string): HeadersInit {
  return {
    Authorization: `Bearer ${token ?? ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function apiFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...apiHeaders(token), ...options?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

// ── Typed helpers ────────────────────────────────────────────────────────────

function get<T>(path: string): Promise<T> {
  return apiFetch(path);
}

function post<T>(path: string, body: unknown): Promise<T> {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}

function patch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
}

// ── Types ────────────────────────────────────────────────────────────────────

export type Profile = {
  id: string;
  nickname: string | null;
  birth_date: string | null;
  married: boolean | null;
  has_home: boolean | null;
  region: string | null;
  savings_months: number | null;
  dependents: number | null;
  onboarding_completed_at: string | null;
  score?: number | null;
};

export type Announcement = {
  id: string;
  title: string;
  region: string | null;
  housing_type: string | null;
  total_units: number | null;
  apply_start: string | null;
  apply_end: string | null;
  winner_date: string | null;
  source: string | null;
  source_url: string | null;
  competition_rate: number | null;
  status: string | null;
};

export type RecommendedAnnouncement = Announcement & {
  match_score: number;
  match_reason: string | null;
};

export type ScoreBreakdown = {
  total: number;
  homeless_score: number;
  dependents_score: number;
  savings_score: number;
  homeless_years: number | null;
  savings_months: number | null;
};

export type ScoreResult = {
  score: ScoreBreakdown;
  updated_at: string | null;
  recalculated: boolean;
  upcoming_alert: { message: string } | null;
};

export type Favorite = {
  id: string;
  announcement_id: string;
  announcement: Announcement;
  created_at: string;
};

export type PreparationChecklist = {
  id: string;
  announcement_id: string | null;
  items: ChecklistItem[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  due_date: string | null;
  doc_type: string | null;
};

// ── API calls ────────────────────────────────────────────────────────────────

export const api = {
  profile: {
    get: () => get<Profile>("/profile"),
    patch: (body: Partial<Profile>) => patch<Profile>("/profile", body),
  },

  announcements: {
    list: (params?: { q?: string; region?: string; status?: string }) => {
      const qs = new URLSearchParams(
        (params ?? {}) as Record<string, string>
      ).toString();
      return get<Announcement[]>(`/announcements${qs ? `?${qs}` : ""}`);
    },
    get: (id: string) => get<Announcement>(`/announcements/${id}`),
    changes: (id: string) =>
      get<unknown[]>(`/announcement-changes?announcement_id=${id}`),
  },

  recommendations: {
    list: () => get<RecommendedAnnouncement[]>("/recommendations"),
  },

  score: {
    get: () => get<ScoreResult>("/my-score"),
    recalculate: (profile: Partial<Profile>) =>
      post<ScoreResult>("/my-score", profile),
  },

  favorites: {
    list: () => get<Favorite[]>("/favorites"),
    add: (announcementId: string) =>
      post<Favorite>("/favorites", { announcement_id: announcementId }),
    remove: (id: string) =>
      apiFetch(`/favorites/${id}`, { method: "DELETE" }),
  },

  preparation: {
    get: (announcementId?: string) => {
      const qs = announcementId
        ? `?announcement_id=${announcementId}`
        : "";
      return get<PreparationChecklist>(`/preparation${qs}`);
    },
    patch: (items: ChecklistItem[], announcementId?: string) =>
      patch<PreparationChecklist>("/preparation", {
        items,
        announcement_id: announcementId,
      }),
  },
};
