import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getNotes,
  addNote,
  updateNote,
  trashNote,
  restoreNote,
  archiveNote,
  unarchiveNote,
  permanentlyDeleteNote,
} from "../services/note";

/* =======================
   TYPES
======================= */

export type NoteStatus = "active" | "archived" | "trashed";

export interface Note {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  status: NoteStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/* =======================
   STORE
======================= */

export const useNotesStore = defineStore("notes", () => {
  /* ---------- STATE ---------- */
  const notes = ref<Note[]>([]);
  const searchQuery = ref("");

  /* ---------- HELPERS ---------- */
  function replaceNote(updated: Note) {
    const index = notes.value.findIndex((n) => n.id === updated.id);
    if (index !== -1) notes.value[index] = updated;
  }

  /* ---------- ACTIONS ---------- */

  async function fetchNotes() {
    notes.value = await getNotes();
  }

  async function createNote(note: Partial<Note>) {
    const newNote = await addNote(note);
    if (newNote) notes.value.push(newNote);
    return newNote.id;
  }

  async function editNote(id: number, fields: Partial<Note>) {
    const updated = await updateNote(id, fields);
    if (updated) replaceNote(updated);
  }

  async function trash(id: number) {
    const updated = await trashNote(id);
    if (updated) replaceNote(updated);
  }

  async function restore(id: number) {
    const updated = await restoreNote(id);
    if (updated) replaceNote(updated);
  }

  async function archive(id: number) {
    const updated = await archiveNote(id);
    if (updated) replaceNote(updated);
  }

  async function unarchive(id: number) {
    const updated = await unarchiveNote(id);
    if (updated) replaceNote(updated);
  }

  async function deleteForever(id: number) {
    const res = await permanentlyDeleteNote(id);
    if (!res) return;
    notes.value = notes.value.filter((n) => n.id !== id);
  }

  /* ---------- GETTERS ---------- */

  const notesByStatus = computed(() => ({
    active: filterAndSortNotes("active", searchQuery.value),
    archived: filterAndSortNotes("archived", searchQuery.value),
    trashed: filterAndSortNotes("trashed", searchQuery.value),
  }));

  function filterAndSortNotes(status: NoteStatus, query: string) {
    return notes.value
      .filter((n) => n.status === status)
      .filter(
        (note) =>
          !query ||
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.tags?.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      )
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  /* ---------- EXPORT ---------- */
  return {
    // state
    notes,
    searchQuery,

    // getters
    notesByStatus,
    // actions
    fetchNotes,
    createNote,
    editNote,
    trash,
    restore,
    archive,
    unarchive,
    deleteForever,
  };
});
