<script setup lang="ts">
import { useNotesStore } from "../stores/useNotesStore";

const notesStore = useNotesStore();
</script>

<template>
  <input
    v-model="notesStore.searchQuery"
    placeholder="Search for a title or tag..."
    class="px-4 py-2 h-14 max-w-100 w-full rounded-full backdrop-blur-xs text-white outline-none border duration-200 hover:scale-105 focus:border-3 focus:scale-105 focus:border-(--btn-primary)"
  />
</template>
