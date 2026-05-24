import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.value}>{streak}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white
  },
  value: {
    color: colors.ember,
    fontSize: 20,
    fontWeight: "900"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  }
});
