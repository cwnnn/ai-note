import { generateContent } from "../openrouter.js";
import { tagNotePrompt } from "../prompts/tagNote.prompt.js";
import { safeJsonParse } from "../utils/safeJsonParse.js";
import { validateSchema } from "../utils/validateSchema.js";
import { tagNoteSchema } from "../schemas/tagNote.schema.js";

const MAX_TAGS = 5;

export async function tagNote(note) {
  const prompt = tagNotePrompt(note);

  const aiResponse = await generateContent(prompt);

  const parsed = safeJsonParse(aiResponse);

  validateSchema(tagNoteSchema, parsed);

  if (!parsed.tags || !Array.isArray(parsed.tags)) {
    throw new Error("AI response format invalid");
  }

  return parsed.tags
    .map((tag) => tag.toLowerCase())
    .map((tag) => tag.trim())
    .filter((tag, i, arr) => arr.indexOf(tag) === i)
    .slice(0, MAX_TAGS);
}
