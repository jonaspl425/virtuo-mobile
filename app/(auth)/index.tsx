import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { Body, Label, Title } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!hasSupabaseConfig) {
      router.replace("/(tabs)");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert("Sign in failed", error.message);
    else router.replace("/(tabs)");
  }

  async function signUp() {
    if (!hasSupabaseConfig) {
      router.replace("/(tabs)");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) Alert.alert("Sign up failed", error.message);
    else Alert.alert("Check your email", "Confirm your account, then sign in.");
  }

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrap}>
        <View style={styles.copy}>
          <Label>Virtuo</Label>
          <Title>Train your voice, one focused rep at a time.</Title>
          <Body>Sign in or create an account to track XP, streaks, saved recordings, and speaking progress across devices.</Body>
        </View>
        <View style={styles.form}>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor={colors.muted} style={styles.input} />
          <PrimaryButton disabled={loading} onPress={signIn}>Sign in</PrimaryButton>
          <PrimaryButton disabled={loading} onPress={signUp} style={styles.secondary}>Create account</PrimaryButton>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    gap: 28
  },
  copy: {
    gap: 12
  },
  form: {
    gap: 12
  },
  input: {
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16
  },
  secondary: {
    backgroundColor: colors.ember
  }
});
