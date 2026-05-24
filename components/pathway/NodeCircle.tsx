import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";
import { SkillTarget } from "@/types";

const glowColors = ["#98918a", "#8B2500", "#C43A00", "#E85D00", "#FF8C00"];

const skillIcons: Record<SkillTarget, keyof typeof Ionicons.glyphMap> = {
  clarity: "chatbubble-ellipses-outline",
  confidence: "flash-outline",
  structure: "git-branch-outline",
  vocabulary: "library-outline",
  pacing: "timer-outline",
  storytelling: "sparkles-outline"
};

export function NodeCircle({
  title,
  skill,
  glowLevel,
  locked,
  checkpoint,
  onPress
}: {
  title: string;
  skill: SkillTarget;
  glowLevel: number;
  locked: boolean;
  checkpoint: boolean;
  onPress: () => void;
}) {
  const size = checkpoint ? 86 : 72;
  const color = locked ? glowColors[0] : glowColors[Math.max(1, glowLevel)];

  return (
    <Pressable disabled={locked} onPress={onPress} style={styles.wrap}>
      <View style={[styles.node, { width: size, height: size, borderRadius: size / 2, backgroundColor: color, shadowColor: color }, !locked && styles.glow]}>
        <Ionicons name={locked ? "lock-closed-outline" : checkpoint ? "shield-checkmark-outline" : skillIcons[skill]} size={checkpoint ? 30 : 26} color={colors.white} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    width: 130,
    gap: 8
  },
  node: {
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  glow: {
    borderWidth: 3,
    borderColor: "rgba(255, 216, 168, 0.7)"
  },
  title: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center"
  }
});
