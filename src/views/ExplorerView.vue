<script lang="ts" setup>
import ExplorerTable from "../components/elements/tables/ExplorerTable.vue";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import Dropdown from "primevue/dropdown";

const limits = ref([
  { name: "10", value: 10 },
  { name: "100", value: 100 },
  { name: "1k", value: 1000 },
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
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <i-ic-outline-format-list-numbered />
        </span>
        <Dropdown
          v-model="selected_limit"
          :options="limits"
          class="md:w-14rem"
          optionLabel="name"
          placeholder="100"
        />
      </div>
    </div>

    <ExplorerTable
      :limit="selected_limit.value"
      :search_string="search_input"
      @search_string="
        (value) => {
          search_input = value;
        }
      "
    ></ExplorerTable>
  </div>
</template>