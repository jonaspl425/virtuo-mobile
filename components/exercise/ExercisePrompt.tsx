import { StyleSheet, Text, View } from "react-native";

import { Label } from "@/components/ui/Text";
import { colors } from "@/constants/theme";

export function ExercisePrompt({ prompt }: { prompt: string }) {
  return (
    <View style={styles.card}>
      <Label>Your prompt</Label>
      <Text style={styles.prompt}>{prompt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 10
  },
  prompt: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 31
  }
});
