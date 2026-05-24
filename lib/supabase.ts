import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const configuredSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const configuredSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabaseUrl = configuredSupabaseUrl || "https://demo.supabase.co";
const supabaseAnonKey = configuredSupabaseAnonKey || "demo-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

export const hasSupabaseConfig = Boolean(configuredSupabaseUrl && configuredSupabaseAnonKey);
