<template>
  <div class="p-card">
    <div
      v-if="useUserWalletStore().status.status?.is_loading"
      class="p-inputgroup"
    >
      <span class="p-inputgroup-addon text-sm uppercase basis-1/5">{{
        useUserWalletStore().status.status.message
      }}</span>
      <div class="p-inputgroup-addon w-full">
        <ProgressBar
          class="w-full"
          :value="
            parseInt(
              (
                ((useUserWalletStore().status.status.step_current ?? 0) /
                  (useUserWalletStore().status.status.step_total ?? 0)) *
                100
              ).toFixed(0)
            )
          "
        />
      </div>
    </div>

    <div v-if="useGlobalStore().status.is_loading" class="p-inputgroup">
      <span class="p-inputgroup-addon text-sm uppercase basis-1/5">{{
        useGlobalStore().status.message
      }}</span>
      <div class="p-inputgroup-addon w-full">
        <ProgressBar
          class="w-full"
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
    <div v-if="useStaratlasGmStore().status.is_loading" class="p-inputgroup">
      <span
        class="p-inputgroup-addon text-sm text-center text-lg uppercase basis-1/5"
        >{{ useStaratlasGmStore().status.message }}</span
      >
      <div class="p-inputgroup-addon w-full">
        <ProgressBar
          class="w-full"
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
    <div v-if="graphql_loading" class="p-inputgroup">
      <span
        class="p-inputgroup-addon text-sm text-center text-lg uppercase basis-1/5"
        >GraphQL loading...</span
      >
      <div class="p-inputgroup-addon w-full">
        <ProgressBar class="w-full" :value="10" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "primevue/progressbar";
import { useGlobalStore } from "../../../stores/GlobalStore";
import { useStaratlasGmStore } from "../../../stores/StaratlasGmStore";
import { useQueryLoading } from "@vue/apollo-composable";
import { ref } from "vue";
import { useUserWalletStore } from "../../../stores/UserWalletStore";

const graphql_loading = ref(useQueryLoading());
</script>

<style scoped></style>
