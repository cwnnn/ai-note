import { generateContent } from "../openrouter.js";
import { tagNotePrompt } from "../prompts/tagNote.prompt.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";
import { validateSchema } from "../utils/validateSchema.js";
import { tagNoteResponseSchema } from "../schemas/tagNote.schema.js";
import AppError from "../utils/AppError.js";
import { saveAiResponse } from "../utils/saveAiResponse.js";

const MAX_TAGS = 5;

export async function tagNote(note) {
  if (!note || typeof note !== "string") {
    throw new AppError("Note must be a non-empty string", 400);
  }

  const prompt = tagNotePrompt(note);

  const aiResponse = await generateContent(prompt);
  saveAiResponse(note, aiResponse, "success");
  console.log("backand ai data :", aiResponse);

  if (!aiResponse) {
    throw new AppError("AI did not return a response", 502);
  }

  const parsed = safeJsonParse(aiResponse);

  if (!parsed) {
    throw new AppError("AI response is invalid JSON", 502);
  }

  validateSchema(tagNoteResponseSchema, parsed);

  if (!parsed.tags || !Array.isArray(parsed.tags)) {
    throw new AppError("AI response format invalid", 502);
  }

  return parsed.tags
    .map((tag) => tag.toLowerCase())
    .map((tag) => tag.trim())
    .filter((tag, i, arr) => arr.indexOf(tag) === i)
    .slice(0, MAX_TAGS);
}
