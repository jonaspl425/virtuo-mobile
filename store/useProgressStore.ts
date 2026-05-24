import { create } from "zustand";

import { seedExercises, seedIslands } from "@/data/seed";
import { Exercise, ExerciseAttempt, ExerciseProgress, Island, Profile } from "@/types";

const now = new Date().toISOString();

interface ProgressState {
  profile: Profile;
  islands: Island[];
  exercises: Exercise[];
  progress: Record<string, ExerciseProgress>;
  attempts: ExerciseAttempt[];
  updateUsername: (username: string) => void;
  setFavorite: (exerciseId: string, isFavorited: boolean) => void;
  recordMockAttempt: (exerciseId: string, grade: number, feedback: string, duration: number, xp: number) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  profile: {
    id: "local-demo-user",
    username: "user4821",
    avatar_url: null,
    level: 1,
    total_xp: 140,
    lifetime_xp: 140,
    streak_current: 3,
    streak_record: 5,
    total_speaking_seconds: 540,
    last_active_date: now.split("T")[0],
    created_at: now
  },
  islands: seedIslands,
  exercises: seedExercises,
  progress: {
    "warm-intro": {
      exercise_id: "warm-intro",
      completion_count: 1,
      best_grade: 0.82,
      last_grade: 0.82,
      glow_level: 3,
      is_favorited: false
    },
    "balderdash-30": {
      exercise_id: "balderdash-30",
      completion_count: 0,
      best_grade: null,
      last_grade: null,
      glow_level: 0,
      is_favorited: true
    }
  },
  attempts: [
    {
      id: "demo-attempt",
      exercise_id: "warm-intro",
      completed_at: now,
      grade: 0.82,
      ai_feedback: "Strong opening and clear pacing. Tighten the middle by replacing pauses with a short transition.",
      duration_seconds: 34,
      xp_earned: 84
    }
  ],
  updateUsername: (username) =>
    set((state) => ({
      profile: {
        ...state.profile,
        username
      }
    })),
  setFavorite: (exerciseId, isFavorited) =>
    set((state) => ({
      progress: {
        ...state.progress,
        [exerciseId]: {
          exercise_id: exerciseId,
          completion_count: state.progress[exerciseId]?.completion_count ?? 0,
          best_grade: state.progress[exerciseId]?.best_grade ?? null,
          last_grade: state.progress[exerciseId]?.last_grade ?? null,
          glow_level: state.progress[exerciseId]?.glow_level ?? 0,
          is_favorited: isFavorited
        }
      }
    })),
  recordMockAttempt: (exerciseId, grade, feedback, duration, xp) =>
    set((state) => {
      const previous = state.progress[exerciseId];
      const glowLevel = grade >= 0.9 ? 4 : grade >= 0.75 ? 3 : grade >= 0.5 ? 2 : 1;
      const totalXP = state.profile.total_xp + xp;
      return {
        profile: {
          ...state.profile,
          total_xp: totalXP,
          lifetime_xp: state.profile.lifetime_xp + xp,
          level: Math.floor(totalXP / 500) + 1,
          total_speaking_seconds: state.profile.total_speaking_seconds + duration
        },
        progress: {
          ...state.progress,
          [exerciseId]: {
            exercise_id: exerciseId,
            completion_count: (previous?.completion_count ?? 0) + 1,
            best_grade: Math.max(previous?.best_grade ?? 0, grade),
            last_grade: grade,
            glow_level: Math.max(previous?.glow_level ?? 0, glowLevel),
            is_favorited: previous?.is_favorited ?? false
          }
        },
        attempts: [
          {
            id: `attempt-${Date.now()}`,
            exercise_id: exerciseId,
            completed_at: new Date().toISOString(),
            grade,
            ai_feedback: feedback,
            duration_seconds: duration,
            xp_earned: xp
          },
          ...state.attempts
        ]
      };
    })
}));
