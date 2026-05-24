import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

import { supabase } from "@/lib/supabase";

export async function startRecording(): Promise<Audio.Recording> {
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) throw new Error("Microphone permission is required.");

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true
  });

  const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  return recording;
}

export async function stopAndUpload(recording: Audio.Recording, userId: string, attemptId: string): Promise<string> {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  if (!uri) throw new Error("Recording did not produce a file.");

  const storagePath = `${userId}/${attemptId}.m4a`;
  const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

  const { error } = await supabase.storage.from("recordings").upload(storagePath, decodeBase64(fileContent), {
    contentType: "audio/m4a",
    upsert: false
  });

  if (error) throw error;
  return storagePath;
}

function decodeBase64(base64: string): Uint8Array {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
