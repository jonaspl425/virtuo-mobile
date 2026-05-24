import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ExercisePreview } from "@/components/pathway/ExercisePreview";
import { Screen } from "@/components/ui/Screen";
import { Body, Title } from "@/components/ui/Text";
import { useProgressStore } from "@/store/useProgressStore";

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, progress, setFavorite } = useProgressStore();
  const exercise = exercises.find((item) => item.id === id);

  if (!exercise) {
    return (
      <Screen>
        <Title>Exercise not found</Title>
        <Body>This exercise may have been removed from the current pathway.</Body>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.previewShell}>
        <ExercisePreview exercise={exercise} progress={progress[exercise.id]} onFavorite={(next) => setFavorite(exercise.id, next)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  previewShell: {
    flex: 1,
    justifyContent: "flex-start"
  }
});
