import { StyleSheet, Text, View } from "react-native";

import { ContinueButton } from "@/components/home/ContinueButton";
import { FlameAvatar } from "@/components/home/FlameAvatar";
import { RecentFeedback } from "@/components/home/RecentFeedback";
import { SessionSummary } from "@/components/home/SessionSummary";
import { StreakBadge } from "@/components/home/StreakBadge";
import { Screen } from "@/components/ui/Screen";
import { Body, Label, Title } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { xpToNextLevel } from "@/lib/xp";
import { useProgressStore } from "@/store/useProgressStore";

export default function HomeScreen() {
  const { profile, exercises, progress, attempts } = useProgressStore();
  const greeting = greetingForNow();

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Label>{greeting}</Label>
          <Title>{profile.username}</Title>
        </View>
        <StreakBadge streak={profile.streak_current} />
      </View>

      <View style={styles.levelRow}>
        <View style={styles.levelCopy}>
          <Text style={styles.level}>Level {profile.level}</Text>
          <Body>{xpToNextLevel(profile.total_xp)} XP to next level</Body>
        </View>
        <Text style={styles.xp}>{profile.total_xp} XP</Text>
      </View>

      <FlameAvatar level={profile.level} streakDays={profile.streak_current} activityScore={attempts.length ? 0.8 : 0.15} />
      <ContinueButton exercises={exercises} progress={progress} />
      <SessionSummary attempts={attempts} />
      <RecentFeedback attempts={attempts} />
    </Screen>
  );
}

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16
  },
  greeting: {
    flex: 1,
    gap: 4
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 14
  },
  levelCopy: {
    gap: 2
  },
  level: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  xp: {
    color: colors.ember,
    fontWeight: "900",
    fontSize: 18
  }
});
