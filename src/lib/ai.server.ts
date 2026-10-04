import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const DEFAULT_BASE_URL = "https://api.vsegpt.ru/v1";
const DEFAULT_MODEL = "anthropic/claude-sonnet-4.6";

export function getAiConfig() {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    baseURL: process.env.AI_BASE_URL || DEFAULT_BASE_URL,
    model: process.env.AI_MODEL || DEFAULT_MODEL,
  };
}

export function createAiProvider() {
  const cfg = getAiConfig();
  if (!cfg) return null;
  return createOpenAICompatible({
    name: "vsegpt",
    baseURL: cfg.baseURL,
    apiKey: cfg.apiKey,
  });
}

export function getAiChatCompletionsUrl() {
  const base = process.env.AI_BASE_URL || DEFAULT_BASE_URL;
  return `${base.replace(/\/$/, "")}/chat/completions`;
}
