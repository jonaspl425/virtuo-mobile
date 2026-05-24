import { Exercise, Island } from "@/types";

export const seedIslands: Island[] = [
  {
    id: "foundation",
    title: "Foundation Island",
    description: "Warm up your voice, reduce filler words, and learn crisp answers.",
    order_index: 1
  },
  {
    id: "story",
    title: "Story Harbor",
    description: "Shape short stories with openings, turns, and memorable endings.",
    order_index: 2
  },
  {
    id: "pressure",
    title: "Pressure Peak",
    description: "Handle improvised prompts and checkpoint challenges under time.",
    order_index: 3
  }
];

export const seedExercises: Exercise[] = [
  {
    id: "warm-intro",
    island_id: "foundation",
    title: "Clear Introduction",
    description: "Introduce a familiar topic with one clean opening sentence.",
    instructions: "Speak for at least 20 seconds. Avoid filler words and answer the generated topic directly.",
    exercise_type: "speech",
    skill_targets: ["clarity", "confidence"],
    order_index: 0,
    is_checkpoint: false,
    checkpoint_pass_threshold: 0.7,
    duration_target_seconds: 20
  },
  {
    id: "balderdash-30",
    island_id: "foundation",
    title: "Balderdash",
    description: "Explain a fictional word as if it belongs in a real dictionary.",
    instructions: "Give a 30 second explanation of the generated fictional word. Define it, use it, and keep a straight structure.",
    exercise_type: "balderdash",
    skill_targets: ["vocabulary", "confidence"],
    order_index: 1,
    is_checkpoint: false,
    checkpoint_pass_threshold: 0.7,
    duration_target_seconds: 30
  },
  {
    id: "foundation-check",
    island_id: "foundation",
    title: "Foundation Checkpoint",
    description: "A mixed challenge combining definition, structure, and clarity.",
    instructions: "Complete the generated speaking challenge and score at least 70 percent to pass.",
    exercise_type: "checkpoint",
    skill_targets: ["clarity", "structure", "pacing"],
    order_index: 2,
    is_checkpoint: true,
    checkpoint_pass_threshold: 0.7,
    duration_target_seconds: 45
  },
  {
    id: "story-spark",
    island_id: "story",
    title: "Story Spark",
    description: "Turn a tiny scenario into a beginning, middle, and end.",
    instructions: "Tell a compact story based on the generated scenario. Include a setup, change, and ending.",
    exercise_type: "storytelling",
    skill_targets: ["storytelling", "structure"],
    order_index: 0,
    is_checkpoint: false,
    checkpoint_pass_threshold: 0.7,
    duration_target_seconds: 45
  }
];
