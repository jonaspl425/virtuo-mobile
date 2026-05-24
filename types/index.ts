export type SkillTarget = "clarity" | "confidence" | "structure" | "vocabulary" | "pacing" | "storytelling";

export type ExerciseType = "speech" | "balderdash" | "storytelling" | "checkpoint";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  lifetime_xp: number;
  streak_current: number;
  streak_record: number;
  total_speaking_seconds: number;
  last_active_date: string | null;
  created_at: string;
}

export interface Island {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

export interface Exercise {
  id: string;
  island_id: string;
  title: string;
  description: string;
  instructions: string;
  exercise_type: ExerciseType;
  skill_targets: SkillTarget[];
  order_index: number;
  is_checkpoint: boolean;
  checkpoint_pass_threshold: number;
  duration_target_seconds: number;
}

export interface ExerciseProgress {
  exercise_id: string;
  completion_count: number;
  best_grade: number | null;
  last_grade: number | null;
  glow_level: number;
  is_favorited: boolean;
}

export interface ExerciseAttempt {
  id: string;
  exercise_id: string;
  completed_at: string;
  grade: number;
  ai_feedback: string;
  duration_seconds: number;
  xp_earned: number;
}

export interface GradeResult {
  grade: number;
  grade_breakdown: {
    duration: number;
    filler_words: number;
    accuracy: number;
    clarity: number;
    delivery: number;
  };
  ai_feedback: string;
  filler_word_count: number;
  filler_words_found: string[];
}
