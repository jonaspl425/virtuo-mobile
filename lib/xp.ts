import { supabase } from "@/lib/supabase";

const XP_PER_LEVEL = 500;
const DAILY_XP_CAP = 300;
const DAILY_BONUS_XP = 50;

export function xpForGrade(grade: number): number {
  return Math.round(10 + grade * 90);
}

export function levelFromXP(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(totalXP: number): number {
  return XP_PER_LEVEL - (totalXP % XP_PER_LEVEL || XP_PER_LEVEL);
}

export function glowLevelFromGrade(currentLevel: number, newGrade: number): number {
  if (newGrade >= 0.9) return 4;
  if (newGrade >= 0.75) return Math.max(currentLevel, 3);
  if (newGrade >= 0.5) return Math.max(currentLevel, 2);
  return Math.max(currentLevel, 1);
}

export async function awardXP(userId: string, baseXP: number): Promise<number> {
  const today = new Date().toISOString().split("T")[0];
  const { data: log } = await supabase
    .from("daily_xp_log")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const alreadyEarned = log?.xp_earned ?? 0;
  const isFirstToday = !log || alreadyEarned === 0;
  const awarded = Math.min(baseXP + (isFirstToday ? DAILY_BONUS_XP : 0), Math.max(0, DAILY_XP_CAP - alreadyEarned));

  if (awarded <= 0) return 0;

  await supabase.from("daily_xp_log").upsert({
    user_id: userId,
    date: today,
    xp_earned: alreadyEarned + awarded,
    daily_bonus_claimed: isFirstToday
  });

  await supabase.rpc("increment_xp", { user_id: userId, amount: awarded });
  return awarded;
}
