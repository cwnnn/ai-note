import { defineStore } from "pinia";
import { ref, computed } from "vue";
import notesData from "../../data/notes.json";

export const useNotesStore = defineStore("notes", () => {
  const notes = ref(notesData);

  const searchQuery = ref("");

  const filteredNotes = computed(() => {
    if (!searchQuery.value) return notes.value;

    return notes.value.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    );
  });

  return {
    notes,
    searchQuery,
    filteredNotes,
  };
});
