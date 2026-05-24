import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { GradeDisplay } from "@/components/exercise/GradeDisplay";
import { ExercisePrompt } from "@/components/exercise/ExercisePrompt";
import { RecordingControls } from "@/components/exercise/RecordingControls";
import { Screen } from "@/components/ui/Screen";
import { Body, Label, Title } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { generateExercisePrompt, gradeAttempt } from "@/lib/bedrock";
import { xpForGrade } from "@/lib/xp";
import { useExerciseStore } from "@/store/useExerciseStore";
import { useProgressStore } from "@/store/useProgressStore";
import { GradeResult } from "@/types";

const demoPrompts = [
  "Explain why a tiny city would ban umbrellas for one week.",
  "Define the fictional word 'brindleflux' and use it in a short example.",
  "Tell a quick story about a train arriving with no passengers."
];

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, recordMockAttempt } = useProgressStore();
  const { prompt, runState, transcript, setPrompt, setRunState, setTranscript, resetRun } = useExerciseStore();
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const exercise = exercises.find((item) => item.id === id);

  const fallbackPrompt = demoPrompts[promptIndexForId(id ?? "")];

  useEffect(() => {
    let alive = true;
    async function generate() {
      if (!exercise) return;
      setRunState("GENERATING_PROMPT");
      try {
        const generated = await generateExercisePrompt(exercise.exercise_type, exercise.title);
        if (alive) setPrompt(generated);
      } catch {
        if (alive) setPrompt(fallbackPrompt);
      } finally {
        if (alive) setRunState("READY_TO_RECORD");
      }
    }

    resetRun();
    generate();
    return () => {
      alive = false;
      resetRun();
    };
  }, [exercise, fallbackPrompt, resetRun, setPrompt, setRunState]);

  useEffect(() => {
    if (runState !== "RECORDING") return;
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [runState]);

  if (!exercise) {
    return (
      <Screen>
        <Title>Exercise not found</Title>
      </Screen>
    );
  }

  const exerciseId = exercise.id;

  async function finishAttempt() {
    if (!exercise || !prompt) return;
    setRunState("GRADING");
    const fallbackResult: GradeResult = {
      grade: Math.min(0.95, Math.max(0.52, transcript.length / 220)),
      grade_breakdown: {
        duration: Math.min(1, seconds / exercise.duration_target_seconds),
        filler_words: transcript.toLowerCase().includes(" um ") ? 0.55 : 0.9,
        accuracy: 0.78,
        clarity: 0.74,
        delivery: 0.72
      },
      ai_feedback: "Good completion. For the next rep, make the answer easier to follow by using one clear opening claim and one closing sentence.",
      filler_word_count: transcript.toLowerCase().split(" um ").length - 1,
      filler_words_found: transcript.toLowerCase().includes(" um ") ? ["um"] : []
    };

    try {
      const graded = await gradeAttempt({
        transcript,
        exerciseType: exercise.exercise_type,
        generatedPrompt: prompt,
        durationSeconds: seconds,
        exerciseInstructions: exercise.instructions
      });
      saveResult(graded);
    } catch {
      saveResult(fallbackResult);
    }
  }

  function saveResult(graded: GradeResult) {
    const xp = xpForGrade(graded.grade);
    setRunState("SAVING");
    recordMockAttempt(exerciseId, graded.grade, graded.ai_feedback, seconds, xp);
    setResult(graded);
    setRunState("RESULTS");
  }

  function exitExercise() {
    resetRun();
    router.replace(`/exercise/preview/${exerciseId}`);
  }

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Label>{runState.replaceAll("_", " ")}</Label>
          <Title style={styles.title}>{exercise.title}</Title>
        </View>
        <Pressable accessibilityLabel="Exit exercise" onPress={exitExercise} style={styles.close}>
          <Ionicons name="close" size={24} color={colors.ink} />
        </Pressable>
      </View>

      {prompt ? <ExercisePrompt prompt={prompt} /> : <Body>Generating a fresh prompt...</Body>}

      {runState === "RESULTS" && result ? (
        <GradeDisplay result={result} xp={xpForGrade(result.grade)} />
      ) : (
        <View style={styles.recordingArea}>
          <TextInput
            value={transcript}
            onChangeText={setTranscript}
            placeholder="Temporary transcript field for local testing. Real builds can replace this with on-device speech recognition or AWS Transcribe output."
            placeholderTextColor={colors.muted}
            multiline
            style={styles.transcript}
          />
          <RecordingControls
            isRecording={runState === "RECORDING"}
            seconds={seconds}
            onStart={() => {
              setSeconds(0);
              setRunState("RECORDING");
            }}
            onStop={finishAttempt}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14
  },
  titleBlock: {
    flex: 1,
    gap: 4
  },
  title: {
    fontSize: 26
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line
  },
  recordingArea: {
    flex: 1,
    justifyContent: "space-between",
    gap: 18
  },
  transcript: {
    flex: 1,
    minHeight: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 14,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    textAlignVertical: "top"
  }
});

function promptIndexForId(id: string) {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % demoPrompts.length;
}
