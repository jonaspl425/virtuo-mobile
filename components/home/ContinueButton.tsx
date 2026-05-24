import { router } from "expo-router";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Exercise, ExerciseProgress } from "@/types";

export function ContinueButton({ exercises, progress }: { exercises: Exercise[]; progress: Record<string, ExerciseProgress> }) {
  const next = exercises.find((exercise) => (progress[exercise.id]?.completion_count ?? 0) === 0) ?? exercises[0];

  return <PrimaryButton onPress={() => router.push(`/exercise/preview/${next.id}`)}>Continue training</PrimaryButton>;
}
