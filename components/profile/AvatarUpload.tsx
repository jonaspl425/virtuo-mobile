import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export function AvatarUpload({ uri, onChange }: { uri: string | null; onChange: (uri: string) => void }) {
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  }

  return (
    <Pressable onPress={pickImage} style={styles.wrap}>
      {uri ? <Image source={{ uri }} style={styles.image} /> : <Ionicons name="person-outline" size={42} color={colors.muted} />}
      <View style={styles.caption}>
        <Text style={styles.captionText}>Edit</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.cloud,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  caption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(21, 18, 15, 0.7)",
    paddingVertical: 5,
    alignItems: "center"
  },
  captionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800"
  }
});
