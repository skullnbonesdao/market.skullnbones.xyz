<template>
  <div v-if="useGlobalStore().status.is_loading">
    <div class="p-card p-2 flex flex-row items-center">
      <span
        class="border-2 text-center text-lg rounded-xl p-2 uppercase basis-1/3"
        >{{ useGlobalStore().status.message }}</span
      >
      <ProgressBar
        class="flex w-full mx-2"
        :value="
          parseInt(
            (
              ((useGlobalStore().status.step ?? 0) /
                (useGlobalStore().status.step_total ?? 0)) *
              100
            ).toFixed(0)
          )
        "
      />
    </div>
  </div>
  <div v-if="useStaratlasGmStore().status.is_loading">
    <div class="p-card p-2 flex flex-row items-center">
      <span
        class="border-2 text-center text-lg rounded-xl p-2 uppercase basis-1/3"
        >{{ useStaratlasGmStore().status.message }}</span
      >
      <ProgressBar
        class="flex w-full mx-2"
        :value="
          parseInt(
            (
              ((useStaratlasGmStore().status.step ?? 0) /
                (useStaratlasGmStore().status.step_total ?? 0)) *
              100
            ).toFixed(0)
          )
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "primevue/progressbar";
import { useGlobalStore } from "../../../stores/GlobalStore";
import Dropdown from "primevue/dropdown";
import { useStaratlasGmStore } from "../../../stores/StaratlasGmStore";
</script>

<style scoped></style>
