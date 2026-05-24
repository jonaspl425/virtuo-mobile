import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { ExerciseAttempt } from "@/types";

export function SessionSummary({ attempts }: { attempts: ExerciseAttempt[] }) {
  const latest = attempts.slice(0, 3);
  const avgGrade = latest.length ? Math.round((latest.reduce((sum, attempt) => sum + attempt.grade, 0) / latest.length) * 100) : 0;
  const xp = latest.reduce((sum, attempt) => sum + attempt.xp_earned, 0);

  return (
    <View style={styles.row}>
      <Metric value={`${avgGrade}%`} label="session avg" />
      <Metric value={`${xp}`} label="xp earned" />
      <Metric value={`${latest.length}`} label="attempts" />
    </View>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10
  },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white
  },
  value: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.ink
  },
  label: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "700"
  }
});
