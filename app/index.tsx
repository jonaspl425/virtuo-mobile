import { Redirect } from "expo-router";

import { hasSupabaseConfig } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function IndexRoute() {
  const { session } = useAuthStore();

  if (hasSupabaseConfig && session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
