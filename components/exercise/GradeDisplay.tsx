import { StyleSheet, Text, View } from "react-native";

import { Body, Label } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { GradeResult } from "@/types";

export function GradeDisplay({ result, xp }: { result: GradeResult; xp: number }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.grade}>{Math.round(result.grade * 100)}%</Text>
      <Label>{xp} XP earned</Label>
      <Body>{result.ai_feedback}</Body>
      <View style={styles.grid}>
        {Object.entries(result.grade_breakdown).map(([key, value]) => (
          <View key={key} style={styles.metric}>
            <Text style={styles.metricValue}>{Math.round(value * 100)}</Text>
            <Text style={styles.metricLabel}>{key.replace("_", " ")}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 14
  },
  grade: {
    color: colors.ember,
    fontSize: 54,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  metric: {
    width: "31%",
    minWidth: 92,
    borderRadius: 8,
    backgroundColor: colors.cloud,
    padding: 10
  },
  metricValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  }
});
