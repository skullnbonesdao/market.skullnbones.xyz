<template>
  <div class="flex w-full">
    <p class="text-center text-3xl p-3">{{ pros.text }}</p>
  </div>
</template>

<script setup lang="ts">
const pros = defineProps({
  text: {
    type: String,
    default: "No Data found!",
  },
});
</script>

<style scoped></style>
