import fs from "fs";
import path from "path";

const dataPath = path.join("data/notes.json");

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}

export function getNotes() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

export function saveNotes(notes) {
  fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
}

export function addNote(note) {
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
  return note;
}

export function deleteNote(id) {
  let notes = getNotes();
  notes = notes.filter((note) => note.id !== id);
  saveNotes(notes);
}

export function updateNote(id, updatedFields) {
  const notes = getNotes();

  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    ...updatedFields,
  };

  saveNotes(notes);
  return notes[index];
}
