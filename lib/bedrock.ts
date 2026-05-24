import { GradeResult } from "@/types";

const endpoint = process.env.EXPO_PUBLIC_LAMBDA_ENDPOINT;

async function invokeBedrock<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  if (!endpoint) {
    throw new Error("Missing EXPO_PUBLIC_LAMBDA_ENDPOINT");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload })
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error ?? "Bedrock request failed");
  }

  return body as T;
}

export async function generateExercisePrompt(exerciseType: string, exerciseTitle: string): Promise<string> {
  const result = await invokeBedrock<{ prompt: string }>("generate_prompt", {
    exerciseType,
    exerciseTitle
  });
  return result.prompt;
}

export async function gradeAttempt(payload: {
  transcript: string;
  exerciseType: string;
  generatedPrompt: string;
  durationSeconds: number;
  exerciseInstructions: string;
}): Promise<GradeResult> {
  return invokeBedrock<GradeResult>("grade_attempt", payload);
}
