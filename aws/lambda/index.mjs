import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });
const modelId = process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-sonnet-4-5";

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Content-Type": "application/json"
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const { action, payload } = body;

    if (action === "generate_prompt") return await generatePrompt(payload, corsHeaders);
    if (action === "grade_attempt") return await gradeAttempt(payload, corsHeaders);

    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Unknown action" }) };
  } catch (error) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
  }
};

async function generatePrompt({ exerciseType, exerciseTitle }, headers) {
  const system = "You generate creative, unique exercise prompts for a public speaking training app. Return only JSON with one key named prompt.";
  const userMessage = `Exercise: "${exerciseTitle}" (type: ${exerciseType}). Generate a concise, interesting prompt.`;
  const parsed = await invokeJson(system, userMessage, 200);
  return { statusCode: 200, headers, body: JSON.stringify(parsed) };
}

async function gradeAttempt({ transcript, exerciseType, generatedPrompt, durationSeconds, exerciseInstructions }, headers) {
  const system = `You are a strict but fair public speaking coach. Return only valid JSON:
{
  "grade": 0.0,
  "grade_breakdown": {
    "duration": 0.0,
    "filler_words": 0.0,
    "accuracy": 0.0,
    "clarity": 0.0,
    "delivery": 0.0
  },
  "ai_feedback": "2-3 sentences of specific, actionable feedback.",
  "filler_word_count": 0,
  "filler_words_found": []
}`;
  const userMessage = `Exercise: ${exerciseType}
Instructions: ${exerciseInstructions}
Prompt: ${generatedPrompt}
Duration: ${durationSeconds} seconds
Transcript: """${transcript}"""

Grade for duration, filler words, accuracy, clarity, and delivery.`;
  const parsed = await invokeJson(system, userMessage, 600);
  return { statusCode: 200, headers, body: JSON.stringify(parsed) };
}

async function invokeJson(system, userMessage, maxTokens) {
  const response = await client.send(
    new InvokeModelCommand({
      modelId,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userMessage }]
      }),
      contentType: "application/json",
      accept: "application/json"
    })
  );

  const result = JSON.parse(new TextDecoder().decode(response.body));
  return JSON.parse(result.content[0].text);
}
