<template>
  <div class="space-y-2">
    <div class="p-card flex flex-row p-2 space-x-2">
      <div class="p-inputgroup flex-1">
        <span class="w-15 p-inputgroup-addon uppercase">RPC</span>
        <Dropdown
          v-model="selected_option"
          :options="drop_downOptions"
          :placeholder="useGlobalStore().rpc.name"
          class="w-full md:w-14rem"
          optionLabel="name"
        />
      </div>
    </div>
    <div class="p-card p-2">
      <div class="flex w-full justify-center text-center">
        Help cover costs:
      </div>
      <div class="flex w-full text-xs justify-center text-center">
        FULRbdyHJ7AzRCNVjA6NZoUD19EQ5a9swWdyaN4d9d7P
      </div>
    </div>
    <div class="flex flex-row gap-2">
      <Button
        aria-label="Filter"
        icon="pi pi-github"
        @click="open_url('https://github.com/skullnbonesdao')"
      >
      </Button>

      <div class="p-card flex flex-col w-full p-2">
        <div class="flex w-full justify-center text-center">
          © [2023 S&B] All Rights Reserved.
        </div>
        <div class="flex w-full justify-center">{{ version }}</div>
      </div>

      <Button
        aria-label="Filter"
        icon="pi pi-discord"
        @click="open_url('https://discord.gg/eQZQaF5Qk6')"
      >
      </Button>
    </div>

    <div class="flex flex-row gap-2">
      <div class="flex w-full justify-center">
        <img alt="Italian Trulli" src="/images/streamingfast-p-500.png" />
      </div>
    </div>

    <div class="">
      <G_SyncStatusBar class="w-full"></G_SyncStatusBar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { endpoints_list, useGlobalStore } from "../stores/GlobalStore";
import Dropdown from "primevue/dropdown";
import { ref, watch } from "vue";
import { open_url } from "../static/url_tools";
import G_SyncStatusBar from "../components/graphql/G_SyncStatusBar.vue";

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
    useGlobalStore().update_connection(selected_option.value.name);
  }
);
</script>

<style scoped></style>