<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
    aria-label="Закрыть"
  >
    <Icon name="material-symbols-light:close-small" size="48" />
  </NuxtLink>

  <button
    v-else
    type="button"
    @click="emitClick"
    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
    aria-label="Закрыть"
  >
    <Icon name="material-symbols-light:close-small" size="48" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  href?: string;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

function emitClick(event: MouseEvent) {
  emit("click", event);
}
</script>
