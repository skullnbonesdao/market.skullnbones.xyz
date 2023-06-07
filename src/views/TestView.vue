<script setup lang="ts">
import { ref } from "vue";

const nodes = ref([
  {
    key: "0",
    label: "Documents",
    data: "Documents Folder",
    icon: "pi pi-fw pi-inbox",
  },
]);
</script>

<template>
  <div class="flex flex-row">
    <div class="basis-1/3 p-card rounded-none">
      <div class="grid">
        <div>1</div>
        <div>1</div>
        <div>1</div>
      </div>
    </div>
    <div class="w-full p-card rounded-none">card</div>
  </div>
</template>
