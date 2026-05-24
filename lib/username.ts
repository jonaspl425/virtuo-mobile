import { hasSupabaseConfig, supabase } from "@/lib/supabase";

const demoTakenUsernames = ["admin", "support", "moderator", "user0000", "user1234"];

export async function isUsernameValid(username: string, currentUserId?: string): Promise<{ valid: boolean; reason?: string }> {
  const trimmed = username.trim();

  if (trimmed.length < 3 || trimmed.length > 20) return { valid: false, reason: "Must be 3-20 characters" };
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return { valid: false, reason: "Letters, numbers, and underscores only" };

  if (!hasSupabaseConfig) {
    const lower = trimmed.toLowerCase();
    if (demoTakenUsernames.includes(lower)) return { valid: false, reason: "Username already taken" };
    return { valid: true };
  }

  const { data: banned } = await supabase.from("banned_words").select("word");
  const lower = username.toLowerCase();
  if (banned?.some((entry) => lower.includes(entry.word.toLowerCase()))) {
    return { valid: false, reason: "Username not allowed" };
  }

  const { data: existing } = await supabase.from("profiles").select("id").eq("username", trimmed).maybeSingle();
  if (existing && existing.id !== currentUserId) return { valid: false, reason: "Username already taken" };
  return { valid: true };
}

export function generateDefaultUsername(): string {
  return `user${Math.floor(1000 + Math.random() * 9000)}`;
}
