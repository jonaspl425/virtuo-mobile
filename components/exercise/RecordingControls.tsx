import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/constants/theme";

export function RecordingControls({
  isRecording,
  seconds,
  onStart,
  onStop
}: {
  isRecording: boolean;
  seconds: number;
  onStart: () => void;
  onStop: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.timer}>{seconds}s</Text>
      <PrimaryButton onPress={isRecording ? onStop : onStart}>{isRecording ? "Stop recording" : "Start recording"}</PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14
  },
  timer: {
    textAlign: "center",
    color: colors.ink,
    fontSize: 44,
    fontWeight: "900"
  }
});
