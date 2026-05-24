import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export function StatsGrid({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <View style={styles.grid}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.card}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 14
  },
  value: {
    color: colors.ink,
    fontWeight: "900",
    fontSize: 22
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  }
});
