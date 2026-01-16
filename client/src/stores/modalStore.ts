import { defineStore } from "pinia";
import { ref } from "vue";

interface NoteForm {
  title: string;
  content: string;
  tags: string[];
  updatedAt: Date | null;
}

export const useModalStore = defineStore("modal", () => {
  const isModalOpen = ref<boolean>(false);
  const activeNoteId = ref<number | null>(null);
  const isCreate = ref<boolean>(true);

  const form = ref<NoteForm>({
    title: "",
    content: "",
    tags: [],
    updatedAt: null,
  });

  // Notu aç ve formu doldur
  function openEdit(note: {
    id: number;
    title: string;
    content: string;
    tags: string[];
    updatedAt: Date | null;
  }) {
    activeNoteId.value = note.id;
    isCreate.value = false;
    form.value.title = note.title;
    form.value.content = note.content;
    form.value.tags = [...note.tags];
    form.value.updatedAt = note.updatedAt;
    isModalOpen.value = true;
  }

  function openCreate() {
    activeNoteId.value = null;
    isCreate.value = true;
    form.value.title = "";
    form.value.content = "";
    form.value.updatedAt = null;
    form.value.tags = [];
    isModalOpen.value = true;
  }

  function close() {
    isModalOpen.value = false;
    activeNoteId.value = null;
    form.value.title = "";
    form.value.content = "";
    form.value.tags = [];
    isCreate.value = true;
  }

  return {
    isModalOpen,
    activeNoteId,
    isCreate,
    form,
    openEdit,
    openCreate,
    close,
  };
});
