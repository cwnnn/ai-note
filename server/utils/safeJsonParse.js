import AppError from "./AppError.js";

export function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError("AI returned invalid JSON", 502);
  }
}
