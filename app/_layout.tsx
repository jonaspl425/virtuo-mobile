import { useEffect } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootLayout() {
  const { setSession, setBootstrapped } = useAuthStore();

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setBootstrapped(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setBootstrapped(true);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setBootstrapped, setSession]);

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}
