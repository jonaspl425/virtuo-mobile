import { Exercise, ExerciseProgress } from "@/types";

export function isNodeUnlocked(
  exerciseOrderIndex: number,
  progressMap: Record<string, Pick<ExerciseProgress, "completion_count">>,
  exercises: Exercise[]
): boolean {
  if (exerciseOrderIndex === 0) return true;
  const previous = exercises.find((exercise) => exercise.order_index === exerciseOrderIndex - 1);
  if (!previous) return false;
  return (progressMap[previous.id]?.completion_count ?? 0) >= 1;
}

export function islandCompletion(
  islandId: string,
  exercises: Exercise[],
  progressMap: Record<string, Pick<ExerciseProgress, "completion_count">>
): { completed: number; total: number; percent: number } {
  const islandExercises = exercises.filter((exercise) => exercise.island_id === islandId);
  const completed = islandExercises.filter((exercise) => (progressMap[exercise.id]?.completion_count ?? 0) > 0).length;
  const total = islandExercises.length;
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}
