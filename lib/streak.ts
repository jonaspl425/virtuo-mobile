import { supabase } from "@/lib/supabase";

export async function updateStreak(userId: string): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_current, streak_record, last_active_date")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const today = new Date().toISOString().split("T")[0];
  if (profile.last_active_date === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split("T")[0];

  const nextStreak = profile.last_active_date === yesterdayString ? profile.streak_current + 1 : 1;

  await supabase
    .from("profiles")
    .update({
      streak_current: nextStreak,
      streak_record: Math.max(nextStreak, profile.streak_record),
      last_active_date: today
    })
    .eq("id", userId);
}
