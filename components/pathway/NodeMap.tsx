import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { NodeCircle } from "@/components/pathway/NodeCircle";
import { isNodeUnlocked } from "@/lib/progress";
import { Exercise, ExerciseProgress } from "@/types";

export function NodeMap({ exercises, progress }: { exercises: Exercise[]; progress: Record<string, ExerciseProgress> }) {
  const sorted = [...exercises].sort((a, b) => a.order_index - b.order_index);

  return (
    <View style={styles.map}>
      {sorted.map((exercise, index) => {
        const unlocked = isNodeUnlocked(exercise.order_index, progress, sorted);
        return (
          <View key={exercise.id} style={[styles.row, index % 2 ? styles.right : styles.left]}>
            <NodeCircle
              title={exercise.title}
              skill={exercise.skill_targets[0]}
              glowLevel={progress[exercise.id]?.glow_level ?? 0}
              locked={!unlocked}
              checkpoint={exercise.is_checkpoint}
              onPress={() => router.push(`/exercise/preview/${exercise.id}`)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    gap: 28,
    paddingVertical: 12
  },
  row: {
    width: "100%"
  },
  left: {
    alignItems: "flex-start"
  },
  right: {
    alignItems: "flex-end"
  }
});
