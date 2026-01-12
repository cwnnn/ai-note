<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click", "remove"]);
</script>

<template>
  <button
    type="button"
    class="rounded-full border text-center border-white bg-gray-200/10 py-1 px-3 text-xs duration-300 hover:scale-105"
    @click="emit('click')"
  >
    <slot>
      <span>#{{ label }}</span>

      <span
        v-if="removable"
        class="ml-1 cursor-pointer rounded-full px-1 text-xs duration-300 hover:text-red-300"
        @click.stop="emit('remove')"
      >
        ✕
      </span>
    </slot>
  </button>
</template>
