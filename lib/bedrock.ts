import { Exercise, GradeResult } from "@/types";

const lambdaEndpoint = process.env.EXPO_PUBLIC_LAMBDA_ENDPOINT;
const websiteApiBaseUrl = process.env.EXPO_PUBLIC_WEBSITE_API_BASE_URL?.replace(/\/$/, "");

async function invokeBedrock<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  if (!lambdaEndpoint) {
    throw new Error("Missing EXPO_PUBLIC_LAMBDA_ENDPOINT");
  }

  const response = await fetch(lambdaEndpoint, {
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

async function invokeWebsiteApi<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  if (!websiteApiBaseUrl) {
    throw new Error("Missing EXPO_PUBLIC_WEBSITE_API_BASE_URL");
  }

  const response = await fetch(`${websiteApiBaseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error ?? "Website AI request failed");
  }

  return body as T;
}

function difficultyForExercise(exercise: Exercise): "Easy" | "Medium" | "Difficult" {
  if (exercise.is_checkpoint || exercise.duration_target_seconds >= 45) return "Difficult";
  if (exercise.duration_target_seconds >= 30) return "Medium";
  return "Easy";
}

function websiteNodeId(exercise: Exercise): string {
  if (exercise.exercise_type === "balderdash") return "balderdash";
  if (exercise.is_checkpoint) return `${exercise.island_id}-checkpoint`;
  return exercise.id;
}

function websitePromptToText(prompt: WebsiteExercisePrompt): string {
  const parts = [
    prompt.topic,
    prompt.task,
    prompt.prep ? `Prep: ${prompt.prep}` : "",
    prompt.cues?.length ? `Cues: ${prompt.cues.join("; ")}` : "",
    prompt.constraints?.length ? `Constraints: ${prompt.constraints.join("; ")}` : ""
  ].filter(Boolean);

  return parts.join("\n\n");
}

export async function generateExercisePrompt(exercise: Exercise): Promise<string> {
  if (websiteApiBaseUrl) {
    const result = await invokeWebsiteApi<WebsiteExercisePrompt>("/api/ai/exercise-prompt", {
      nodeId: websiteNodeId(exercise),
      title: exercise.title,
      difficulty: difficultyForExercise(exercise),
      description: exercise.instructions || exercise.description,
      regeneration: 0,
      nonce: `${Date.now()}`
    });
    return websitePromptToText(result);
  }

  const result = await invokeBedrock<{ prompt: string }>("generate_prompt", {
    exerciseType: exercise.exercise_type,
    exerciseTitle: exercise.title
  });
  return result.prompt;
}

export async function gradeAttempt(payload: {
  exercise: Exercise;
  transcript: string;
  generatedPrompt: string;
  durationSeconds: number;
}): Promise<GradeResult> {
  if (websiteApiBaseUrl) {
    const result = await invokeWebsiteApi<WebsiteFeedbackResult>("/api/ai/exercise-feedback", {
      nodeId: websiteNodeId(payload.exercise),
      title: payload.exercise.title,
      difficulty: difficultyForExercise(payload.exercise),
      prompt: {
        topic: payload.generatedPrompt.split("\n")[0] || payload.exercise.title,
        task: payload.generatedPrompt,
        successCriteria: payload.exercise.skill_targets,
        requiredWords: payload.exercise.exercise_type === "balderdash" ? [payload.generatedPrompt.split(/\s+/)[0]] : []
      },
      transcript: payload.transcript
    });

    return {
      grade: result.score / 100,
      grade_breakdown: {
        duration: Math.min(1, payload.durationSeconds / payload.exercise.duration_target_seconds),
        filler_words: 0.8,
        accuracy: result.score / 100,
        clarity: result.score / 100,
        delivery: result.score / 100
      },
      ai_feedback: [result.summary, ...result.strengths, ...result.weaknesses].filter(Boolean).join(" "),
      filler_word_count: 0,
      filler_words_found: []
    };
  }

  return invokeBedrock<GradeResult>("grade_attempt", payload);
}

interface WebsiteExercisePrompt {
  topic: string;
  task: string;
  prep?: string;
  cues?: string[];
  constraints?: string[];
  successCriteria?: string[];
  requiredWords?: string[];
}

interface WebsiteFeedbackResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}
