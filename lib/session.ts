import { supabase } from "@/lib/supabase";

const SESSION_GAP_MINUTES = 30;

export async function getOrCreateActiveSession(userId: string): Promise<string> {
  const { data: latest } = await supabase
    .from("sessions")
    .select("id, ended_at, started_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date();
  const cutoff = new Date(now.getTime() - SESSION_GAP_MINUTES * 60 * 1000);

  if (latest && !latest.ended_at && new Date(latest.started_at) > cutoff) {
    return latest.id;
  }

  if (latest && !latest.ended_at) {
    await supabase.from("sessions").update({ ended_at: now.toISOString() }).eq("id", latest.id);
  }

  const { data: session, error } = await supabase.from("sessions").insert({ user_id: userId }).select("id").single();
  if (error) throw error;
  return session.id;
}
