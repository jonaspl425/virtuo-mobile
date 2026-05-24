import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from "react-native-svg";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

export function FlameAvatar({ level, streakDays, activityScore }: { level: number; streakDays: number; activityScore: number }) {
  const intensity = Math.min(1, level / 60 + streakDays / 50 + activityScore * 0.2);
  const wingSpread = 24 + intensity * 38;
  const glow = 22 + intensity * 24;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 260 260">
        <Defs>
          <LinearGradient id="flame" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#ffd166" />
            <Stop offset="0.56" stopColor="#f77f00" />
            <Stop offset="1" stopColor="#9d2b00" />
          </LinearGradient>
          <LinearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor={intensity > 0.45 ? "#d6f0e0" : "#ece7df"} />
            <Stop offset="1" stopColor={intensity > 0.45 ? "#ffe0a6" : "#f4efe7"} />
          </LinearGradient>
        </Defs>
        <Circle cx="130" cy="130" r="116" fill="url(#sky)" />
        <Circle cx="130" cy="148" r={glow} fill="#ff8c00" opacity={0.12 + intensity * 0.22} />
        <Ellipse cx={98 - wingSpread / 4} cy="142" rx={wingSpread} ry="34" fill="#c74712" opacity={0.18 + intensity * 0.35} />
        <Ellipse cx={162 + wingSpread / 4} cy="142" rx={wingSpread} ry="34" fill="#c74712" opacity={0.18 + intensity * 0.35} />
        <Path d="M130 60 C92 104 102 134 118 156 C92 144 82 174 104 198 C119 214 143 213 158 197 C183 171 165 139 146 126 C156 104 148 80 130 60 Z" fill="url(#flame)" />
        <Path d="M132 104 C112 132 116 158 132 180 C148 157 151 132 132 104 Z" fill="#fff1a8" opacity="0.78" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1,
    maxHeight: 310,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cloud
  }
});
