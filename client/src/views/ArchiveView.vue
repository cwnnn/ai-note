<template>
  <div class="relative min-h-screen">
    <div
      class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4"
    >
      <div
        v-for="note in notesStore.notesByStatus.archived"
        :key="note.id"
        @click="handleClick(note.id)"
        class="mb-4 break-inside-avoid rounded-2xl border border-white/30 p-4 shadow-md duration-200 hover:scale-105"
      >
        <h3 class="mb-2 text-lg font-semibold">{{ note.title }}</h3>

        <p class="mb-3 text-sm text-white/60">
          {{ note.content }}
        </p>

        <div class="mb-3 flex flex-wrap gap-2">
          <TagButton v-for="tag in note.tags" :key="tag" :label="tag" />
        </div>
      </div>
    </div>
  </div>
  <BaseModal v-model="modalStore.isModalOpen">
    <NoteForm
      v-model:title="modalStore.form.title"
      v-model:content="modalStore.form.content"
      :date="formattedDate"
      :loading="loading"
      class="p-4"
    >
      <template #header
        ><button
          @click="handleArchive"
          class="duration-300 hover:scale-110 cursor-pointer"
        >
          <img
            class="w-10 h-10 invert"
            src="../../public/unarchive.png"
            alt="archive"
          /></button
      ></template>
      <template #tags>
        <div class="flex flex-wrap gap-2">
          <TagButton
            v-for="tag in modalStore.form.tags"
            :key="tag"
            :label="tag"
            removable
            @click="onTagClick(tag)"
            @remove="onTagRemove(tag)"
          />

          <TagButton>
            <input
              type="text"
              placeholder="Add Tag"
              v-model="newTag"
              @keyup.enter="addTag"
              :size="Math.max(newTag.length, 6)"
              class="outline-none"
            />
          </TagButton>
        </div>

        <BaseButton
          color="secondary"
          :loading="loading"
          :disabled="loading || !modalStore.form.content.trim()"
          @click="getTagAi"
          class="w-40 ml-auto"
        >
          <span>{{ loading ? "Etiketleniyor..." : "Ai Tag" }}</span>
        </BaseButton>
      </template>

      <template #footer>
        <div class="flex flex-row justify-between">
          <BaseButton
            variant="outline"
            color="danger"
            class="w-70"
            @click="deleteForeverForm"
          >
            Delete Forever
          </BaseButton>

          <BaseButton variant="outline" :class="'w-70'" @click="EditNoteForm()">
            "Edit"
          </BaseButton>

          <p v-if="error" style="color: red" class="pt-5">
            Bir sorun oldu, daha sonra tekrar dene :(
            {{ error }}
          </p>
        </div>
      </template>
    </NoteForm>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import { tagNote } from "../services/api";
import { useNotesStore } from "../stores/useNotesStore";
import { useModalStore } from "../stores/modalStore";
import TagButton from "../components/TagButton.vue";
import BaseModal from "../components/Modal/BaseModal.vue";
import NoteForm from "../components/NoteForm.vue";
import BaseButton from "../components/BaseButton/BaseButton.vue";

const notesStore = useNotesStore();
const modalStore = useModalStore();

const loading = ref(false);
const error = ref(null);

onMounted(() => {
  notesStore.fetchNotes();
});

function handleClick(noteId) {
  const note = notesStore.notes.find((n) => n.id === noteId);
  if (!note) return;

  modalStore.openEdit(note);
}

/* Notu düzenleme */
function EditNoteForm() {
  if (!modalStore.activeNoteId) return;
  const note = {
    title: modalStore.form.title,
    content: modalStore.form.content,
    tags: [...modalStore.form.tags],
  };
  notesStore.editNote(modalStore.activeNoteId, note);
  modalStore.close();
}

function deleteForeverForm() {
  if (!modalStore.activeNoteId) return;
  notesStore.trash(modalStore.activeNoteId);
  notesStore.deleteForever(modalStore.activeNoteId);
  modalStore.close();
}

function restoreNoteForm() {
  if (!modalStore.activeNoteId) return;
  notesStore.restore(modalStore.activeNoteId);
  modalStore.close();
}

async function getTagAi() {
  const payload =
    "Title : " +
    modalStore.form.title +
    ", Content : " +
    modalStore.form.content;
  loading.value = true;
  error.value = null;
  try {
    const result = await tagNote(payload);
    // backend dönen şekle göre ayarla; örnek: result.data.tags
    modalStore.form.tags = result.data?.tags ?? [];
  } catch (err) {
    error.value = err.response?.data?.error || "Bir hata oluştu";
  } finally {
    loading.value = false;
  }
}

const newTag = ref("");

function addTag() {
  if (!newTag.value.trim()) return;

  modalStore.form.tags.push(newTag.value.trim());
  newTag.value = ""; // input temizlensin
}

function onTagRemove(tag) {
  modalStore.form.tags = modalStore.form.tags.filter((t) => t !== tag);
}

const formattedDate = computed(() => {
  const raw = modalStore.form.updatedAt;
  if (!raw) return "";
  const d = new Date(raw);
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

async function handleArchive() {
  const note = {
    title: modalStore.form.title,
    content: modalStore.form.content,
    tags: [...modalStore.form.tags],
  };
  notesStore.editNote(modalStore.activeNoteId, note);

  restoreNoteForm();
}
</script>
