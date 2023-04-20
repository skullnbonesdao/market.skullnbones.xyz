<template>
  <div class="space-y-2">
    <div class="p-card flex flex-row p-2 space-x-2">
      <div class="p-inputgroup flex-1">
        <span class="w-15 p-inputgroup-addon uppercase">RPC</span>
        <Dropdown
          v-model="selected_option"
          :options="drop_downOptions"
          optionLabel="name"
          :placeholder="useGlobalStore().rpc.name"
          class="w-full md:w-14rem"
        />
      </div>
    </div>
    <div class="p-card p-2">
      <div class="flex w-full justify-center text-center">Support us:</div>
      <div class="flex w-full text-sm justify-center text-center">
        FULRbdyHJ7AzRCNVjA6NZoUD19EQ5a9swWdyaN4d9d7P
      </div>
    </div>
    <div class="p-card p-2">
      <div class="flex w-full justify-center text-center">
        © [2022 S&B + HEIM] All Rights Reserved.
      </div>
      <div class="flex w-full justify-center">{{ version }}</div>
    </div>
    <div class="p-card p-2">
      <ProgressBar
        :value="fetched_percentage > 99.9 ? 100 : fetched_percentage"
      ></ProgressBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from "primevue/progressbar";

import { endpoints_list, useGlobalStore } from "../../stores/GlobalStore";
import Dropdown from "primevue/dropdown";
import { onMounted, ref, watch } from "vue";
import {
  Api,
  Cursor,
} from "../../static/swagger/skullnbones_api/skullnbones_api";
import InputNumber from "primevue/inputnumber";
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

const fetched_percentage = ref(0.1);

onMounted(async () => {
  const api = new Api({ baseUrl: "https://api2.skullnbones.xyz" });
  await api.stats.getRanges().then((resp) => {
    let cursors: Cursor[] = resp.data;

    let total_range =
      (cursors[0].start_block ?? 0) - (cursors.at(-1)?.start_block ?? 0);
    let fetched_range = 0;
    cursors.forEach((cursor) => {
      if (cursor.end_block !== 0) {
        if (cursor.block) {
          fetched_range += (cursor?.block ?? 0) - (cursor?.start_block ?? 0);
        }
      }
    });
    fetched_percentage.value = (fetched_range / total_range) * 100;
    console.log("t:" + total_range.toString());
    console.log("f:" + fetched_range.toString());
  });
});
</script>

<style scoped></style>
