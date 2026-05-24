import { Pressable, StyleSheet, Text, View } from "react-native";

import { Body } from "@/components/ui/Text";
import { colors } from "@/constants/theme";

export function IslandCard({
  title,
  description,
  percent,
  completed,
  total,
  accent,
  onPress
}: {
  title: string;
  description: string;
  percent: number;
  completed: number;
  total: number;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.percent, { color: accent }]}>{percent}%</Text>
      </View>
      <Body>{description}</Body>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: accent }]} />
      </View>
      <Text style={styles.count}>{completed} of {total} complete</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16,
    gap: 10
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  percent: {
    fontSize: 20,
    fontWeight: "900"
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.cloud,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 8
  },
  count: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  }
});
