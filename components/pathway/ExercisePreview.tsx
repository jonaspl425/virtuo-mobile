import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Body, Label, Title } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { Exercise, ExerciseProgress } from "@/types";

export function ExercisePreview({
  exercise,
  progress,
  onFavorite
}: {
  exercise: Exercise;
  progress?: ExerciseProgress;
  onFavorite: (next: boolean) => void;
}) {
  const favorite = progress?.is_favorited ?? false;

  return (
    <View style={styles.panel}>
      <View style={styles.top}>
        <View style={styles.titleWrap}>
          <Label>{exercise.is_checkpoint ? "Checkpoint" : exercise.exercise_type}</Label>
          <Title style={styles.title}>{exercise.title}</Title>
        </View>
        <Pressable onPress={() => onFavorite(!favorite)} style={styles.favorite}>
          <Ionicons name={favorite ? "heart" : "heart-outline"} size={24} color={favorite ? colors.ember : colors.ink} />
        </Pressable>
      </View>
      <Body>{exercise.description}</Body>
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Instructions</Text>
        <Text style={styles.instructionsText}>{exercise.instructions}</Text>
      </View>
      <PrimaryButton onPress={() => router.push(`/exercise/${exercise.id}`)}>Start exercise</PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  titleWrap: {
    flex: 1,
    gap: 6
  },
  title: {
    fontSize: 24,
    lineHeight: 30
  },
  favorite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line
  },
  instructions: {
    borderRadius: 8,
    backgroundColor: colors.cloud,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 6
  },
  instructionsTitle: {
    fontWeight: "900",
    color: colors.ink
  },
  instructionsText: {
    color: colors.muted,
    lineHeight: 21
  }
});
