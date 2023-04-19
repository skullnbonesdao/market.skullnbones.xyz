<template>
  <div>
    <div class="flex flex-row">
      <div class="flex items-center px-2">RPC:</div>
      <Dropdown
        v-model="selected_option"
        :options="drop_downOptions"
        optionLabel="name"
        :placeholder="useGlobalStore().rpc.name"
        class="w-full md:w-14rem"
      />
    </div>
    <div class="flex w-full justify-center text-center">Support us:</div>
    <div class="flex w-full text-sm justify-center text-center">
      FULRbdyHJ7AzRCNVjA6NZoUD19EQ5a9swWdyaN4d9d7P
    </div>

    <div class="flex w-full justify-center text-center">
      © [2022 S&B + HEIM] All Rights Reserved.
    </div>
    <div class="flex w-full justify-center">{{ version }}</div>
  </div>
</template>

<script setup lang="ts">
import { endpoints_list, useGlobalStore } from "../../stores/GlobalStore";
import Dropdown from "primevue/dropdown";
import { ref, watch } from "vue";
const version = __APP_VERSION__;

const selected_option = ref();
const drop_downOptions = ref();

drop_downOptions.value = endpoints_list.flatMap((e) => {
  return {
    name: e.name,
  };
});
selected_option.value = useGlobalStore().rpc.name;

watch(
  () => selected_option.value,
  () => {
    console.log("dsdd");
    useGlobalStore().update_connection(selected_option.value.name);
  }
);
</script>

<style scoped></style>
