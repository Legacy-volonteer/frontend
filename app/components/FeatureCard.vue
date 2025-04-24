<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-md flex flex-col items-start hover:shadow-lg transition-shadow"
  >
    <div
      class="h-12 w-12 mb-4 flex items-center justify-center rounded-xl bg-indigo-100"
    >
      <Icon :name="icon" class="text-2xl" />
    </div>
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
}
const props = defineProps<Props>();
</script>
