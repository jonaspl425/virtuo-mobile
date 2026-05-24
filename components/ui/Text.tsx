import { ReactNode } from "react";
import { StyleSheet, Text as RNText, TextProps } from "react-native";

import { colors } from "@/constants/theme";

export function Title({ children, style, ...props }: TextProps & { children: ReactNode }) {
  return (
    <RNText {...props} style={[styles.title, style]}>
      {children}
    </RNText>
  );
}

export function Body({ children, style, ...props }: TextProps & { children: ReactNode }) {
  return (
    <RNText {...props} style={[styles.body, style]}>
      {children}
    </RNText>
  );
}

export function Label({ children, style, ...props }: TextProps & { children: ReactNode }) {
  return (
    <RNText {...props} style={[styles.label, style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  label: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0
  }
});
