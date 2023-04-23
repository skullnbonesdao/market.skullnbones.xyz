<template>
  <div>
    <div class="card flex justify-content-center">
      <MultiSelect
        v-model="selectedToggleable"
        :options="toggleable"
        optionLabel="name"
        placeholder="Select Options"
        :maxSelectedLabels="3"
        class="w-full md:w-20rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MultiSelect from "primevue/multiselect";
import { useGlobalStore } from "../../../stores/GlobalStore";
import { ref, watch } from "vue";
import * as wasi from "wasi";

const selectedToggleable = ref([]);
const toggleable = ref([
  { name: "Tokens" },
  { name: "NFTs" },
  { name: "Score" },
  { name: "History" },
]);

//Setup values
useGlobalStore().toggleables.load_tokens
  ? selectedToggleable.value.push({ name: "Tokens" } as never)
  : null;

useGlobalStore().toggleables.load_nfts
  ? selectedToggleable.value.push({ name: "NFTs" } as never)
  : null;

useGlobalStore().toggleables.load_score
  ? selectedToggleable.value.push({ name: "Score" } as never)
  : null;

useGlobalStore().toggleables.load_history
  ? selectedToggleable.value.push({ name: "History" } as never)
  : null;

watch(
  () => selectedToggleable.value,
  () => {
    //useGlobalStore().update_toggables(false, false, false);
    const is_active_tokens = !!selectedToggleable.value.find(
      (s: any) => s.name === "Tokens"
    );
    const is_active_nfts = !!selectedToggleable.value.find(
      (s: any) => s.name === "NFTs"
    );
    const is_active_score = !!selectedToggleable.value.find(
      (s: any) => s.name === "Score"
    );
    const is_active_history = !!selectedToggleable.value.find(
      (s: any) => s.name === "History"
    );

    useGlobalStore().update_toggables(
      is_active_tokens,
      is_active_nfts,
      is_active_score,
      is_active_history
    );

    console.log("trigger");
  }
);
</script>

<style scoped></style>
