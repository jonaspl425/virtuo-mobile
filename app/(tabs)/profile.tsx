import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { SkillHexagon } from "@/components/profile/SkillHexagon";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { Screen } from "@/components/ui/Screen";
import { Body, Label, Title } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { isUsernameValid } from "@/lib/username";
import { useProgressStore } from "@/store/useProgressStore";

export default function ProfileScreen() {
  const { profile, attempts, updateUsername } = useProgressStore();
  const [avatarUri, setAvatarUri] = useState(profile.avatar_url);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState(profile.username);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);
  const accountDate = new Date(profile.created_at).toLocaleDateString();
  const averageGrade = attempts.length ? Math.round((attempts.reduce((sum, attempt) => sum + attempt.grade, 0) / attempts.length) * 100) : 0;

  async function saveUsername() {
    const nextUsername = usernameDraft.trim();
    setUsernameError(null);

    const validation = await isUsernameValid(nextUsername, profile.id);
    if (!validation.valid) {
      setUsernameError(validation.reason ?? "Username not available");
      return;
    }

    setSavingUsername(true);
    if (hasSupabaseConfig) {
      const { error } = await supabase.from("profiles").update({ username: nextUsername }).eq("id", profile.id);
      if (error) {
        setUsernameError(error.message);
        setSavingUsername(false);
        return;
      }
    }

    updateUsername(nextUsername);
    setEditingUsername(false);
    setSavingUsername(false);
  }

  function cancelUsernameEdit() {
    setUsernameDraft(profile.username);
    setUsernameError(null);
    setEditingUsername(false);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AvatarUpload uri={avatarUri} onChange={setAvatarUri} />
        <View style={styles.identity}>
          <Label>Profile</Label>
          {editingUsername ? (
            <View style={styles.usernameEditor}>
              <TextInput
                accessibilityLabel="Username"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                onChangeText={setUsernameDraft}
                placeholder="Username"
                placeholderTextColor={colors.muted}
                style={styles.usernameInput}
                value={usernameDraft}
              />
              {usernameError ? <Text style={styles.error}>{usernameError}</Text> : <Text style={styles.hint}>3-20 letters, numbers, or underscores.</Text>}
              <View style={styles.editorActions}>
                <Pressable onPress={cancelUsernameEdit} style={[styles.smallButton, styles.cancelButton]}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable disabled={savingUsername} onPress={saveUsername} style={[styles.smallButton, styles.saveButton, savingUsername && styles.disabled]}>
                  {savingUsername ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveText}>Save</Text>}
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.usernameRow}>
              <Title style={styles.username}>{profile.username}</Title>
              <Pressable
                accessibilityLabel="Edit username"
                onPress={() => {
                  setUsernameDraft(profile.username);
                  setEditingUsername(true);
                }}
                style={styles.editButton}
              >
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
          )}
          <Body>Level {profile.level} with {profile.total_xp} current XP</Body>
        </View>
      </View>
      <StatsGrid
        stats={[
          { label: "Lifetime XP", value: `${profile.lifetime_xp}` },
          { label: "Speaking time", value: `${Math.round(profile.total_speaking_seconds / 60)}m` },
          { label: "Streak record", value: `${profile.streak_record}` },
          { label: "Created", value: accountDate }
        ]}
      />
      <View style={styles.panel}>
        <View>
          <Text style={styles.panelTitle}>Skill chart</Text>
          <Body>Average grade: {averageGrade}%</Body>
        </View>
        <SkillHexagon values={[0.78, 0.64, 0.72, 0.58, 0.69, 0.61]} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center"
  },
  identity: {
    flex: 1,
    gap: 4
  },
  username: {
    fontSize: 28
  },
  usernameRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  editButton: {
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  editText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900"
  },
  usernameEditor: {
    gap: 8
  },
  usernameInput: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: "800",
    minHeight: 46,
    paddingHorizontal: 12
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  error: {
    color: colors.ember,
    fontSize: 12,
    fontWeight: "800"
  },
  editorActions: {
    flexDirection: "row",
    gap: 8
  },
  smallButton: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 14
  },
  cancelButton: {
    backgroundColor: colors.cloud
  },
  saveButton: {
    backgroundColor: colors.ink
  },
  disabled: {
    opacity: 0.55
  },
  cancelText: {
    color: colors.ink,
    fontWeight: "900"
  },
  saveText: {
    color: colors.white,
    fontWeight: "900"
  },
  panel: {
    gap: 14
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  }
});
