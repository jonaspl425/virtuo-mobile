import { StyleSheet, View } from "react-native";

import { Body, Label } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { ExerciseAttempt } from "@/types";

export function RecentFeedback({ attempts }: { attempts: ExerciseAttempt[] }) {
  const latest = attempts[0];
  return (
    <View style={styles.panel}>
      <Label>Recent feedback</Label>
      <Body>{latest ? latest.ai_feedback : "Complete your first exercise to see a session summary here."}</Body>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white
  }
});
