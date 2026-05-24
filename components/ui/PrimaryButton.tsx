import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, spacing } from "@/constants/theme";

export function PrimaryButton({
  children,
  onPress,
  disabled = false,
  style
}: {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && styles.pressed, style]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: spacing.radius,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18
  },
  disabled: {
    opacity: 0.45
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  text: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 16
  }
});
