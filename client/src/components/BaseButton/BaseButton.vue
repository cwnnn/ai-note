<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${color}`,
      `btn--${size}`,
      (disabled || loading) && 'is-disabled',
      $attrs.class,
    ]"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>

    <slot />
  </button>
</template>

<script setup lang="ts">
import type { BaseButtonProps } from "./BaseButton.interface";

withDefaults(defineProps<BaseButtonProps>(), {
  variant: "solid",
  size: "md",
  color: "primary",
  disabled: false,
  loading: false,
  type: "button",
});
</script>

<style scoped src="./BaseButton.css"></style>
