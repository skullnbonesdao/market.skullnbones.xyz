<script setup lang="ts">
import ExplorerTable from "../components/elements/tables/ExplorerTable.vue";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import Dropdown from "primevue/dropdown";

const limits = ref([
  { name: "limit: 10", value: 10 },
  { name: "limit: 100", value: 100 },
  { name: "limit: 1k", value: 1000 },
]);

const search_input = ref("");
const selected_limit = ref(limits.value[1]);
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-row space-x-2">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search" />
        <InputText
          v-model="search_input"
          class="w-full"
          placeholder="Type: Symbol (ex. PX4USDC)"
        ></InputText>
      </span>

      <Dropdown
        v-model="selected_limit"
        :options="limits"
        optionLabel="name"
        placeholder="limit:100"
        class="md:w-14rem"
      />
    </div>

    <ExplorerTable
      :search_string="search_input"
      :limit="selected_limit.value"
    ></ExplorerTable>
  </div>
</template>
