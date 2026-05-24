import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const { data: oldAttempts, error } = await supabase
    .from("exercise_attempts")
    .select("id, recording_url")
    .lt("completed_at", cutoff.toISOString())
    .not("recording_url", "is", null);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  for (const attempt of oldAttempts ?? []) {
    await supabase.storage.from("recordings").remove([attempt.recording_url]);
    await supabase.from("exercise_attempts").update({ recording_url: null }).eq("id", attempt.id);
  }

  return new Response(JSON.stringify({ deleted: oldAttempts?.length ?? 0 }), {
    headers: { "Content-Type": "application/json" }
  });
});
