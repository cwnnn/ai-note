export const tagNotePrompt = (note) => `
You are an AI that tags user notes.

TASK:
Analyze the note and return relevant tags.

RULES:
- Output ONLY valid JSON
- Do NOT add explanations
- Do NOT add markdown
- Language of tags must be English
- Tags must be short and meaningful
- maximum 5 tags

OUTPUT FORMAT:
{
  "tags": ["tag1", "tag2", "tag3"]
}

NOTE:
"${note}"
`;
