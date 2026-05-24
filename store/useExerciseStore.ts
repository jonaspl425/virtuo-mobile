import { create } from "zustand";

type ExerciseRunState = "IDLE" | "GENERATING_PROMPT" | "READY_TO_RECORD" | "RECORDING" | "UPLOADING" | "GRADING" | "SAVING" | "RESULTS";

interface ExerciseState {
  runState: ExerciseRunState;
  prompt: string | null;
  transcript: string;
  setRunState: (runState: ExerciseRunState) => void;
  setPrompt: (prompt: string | null) => void;
  setTranscript: (transcript: string) => void;
  resetRun: () => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  runState: "IDLE",
  prompt: null,
  transcript: "",
  setRunState: (runState) => set({ runState }),
  setPrompt: (prompt) => set({ prompt }),
  setTranscript: (transcript) => set({ transcript }),
  resetRun: () => set({ runState: "IDLE", prompt: null, transcript: "" })
}));
