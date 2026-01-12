<template>
  <div class="relative min-h-screen">
    <div
      class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4"
    >
      <div
        v-for="note in notesStore.filteredNotes"
        :key="note.id"
        class="mb-4 break-inside-avoid rounded-2xl border border-white/30 p-4 shadow-md duration-200 hover:scale-105"
      >
        <h3 class="mb-2 text-lg font-semibold">{{ note.title }}</h3>
        <p class="mb-3 text-sm text-white/60">
          {{ note.content }}
        </p>
        <div class="flex flex-wrap gap-2">
          <TagButton
            v-for="tag in note.tags"
            :key="tag"
            :label="tag"
            @click="onTagClick(tag)"
            @remove="onTagRemove(tag)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

import { useNotesStore } from "../stores/useNotesStore";
import TagButton from "../components/TagButton.vue";

const notesStore = useNotesStore();

// Yeni eklenen json en üste gelsin diye ters çeviriyoruz
const notes = computed(() => [...notesData].reverse());
</script>
