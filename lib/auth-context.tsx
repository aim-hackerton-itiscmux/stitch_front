import { Session } from "@supabase/supabase-js";
import { router, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "./supabase";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use INITIAL_SESSION event to gate loading — this fires after Supabase
    // has processed both stored sessions AND URL hash tokens (access_token in hash).
    // Relying on getSession() alone causes a race: it resolves before the URL
    // hash is parsed, so the redirect fires before the token is consumed.
    const { data: listener } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "INITIAL_SESSION") {
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "login" || segments[0] === "onboarding";
    if (!session && !inAuth) {
      router.replace("/login");
    } else if (session && inAuth) {
      router.replace("/");
    }
  }, [session, loading, segments]);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signOut: async () => { await supabase.auth.signOut(); },
      }}>
      {children}
    </AuthContext.Provider>
  );
}
