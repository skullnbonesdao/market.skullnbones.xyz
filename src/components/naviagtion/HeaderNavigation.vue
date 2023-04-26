<template>
  <div class="card relative z-2">
    <Menubar :model="items">
      <template #start class="">
        <img alt="logo" src="/public/logo.png" class="mr-2 h-12" />
      </template>

      <template #end>
        <div class="flex flex-row space-x-2 items-center">
          <div
            class="pr-2 flex space-x-1"
            v-tooltip.bottom="'Current Transactions per second'"
          >
            <p>
              {{ useTPS().tps.toFixed(0) }}
            </p>
            <p class="text-xs">
              {{ " TPS" }}
            </p>
          </div>

          <WalletMultiButton dark />
          <SwitchTheme />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Menubar from "primevue/menubar";
import { WalletMultiButton } from "solana-wallets-vue";
import SwitchTheme from "../../components/elements/buttons/SwitchTheme.vue";
import { useTPS } from "../../stores/TPS";
import { endpoints_list, useGlobalStore } from "../../stores/GlobalStore";

onMounted(async () => {
  useTPS().pollData(useGlobalStore().rpc.url ?? endpoints_list[2].url);
});

const items = ref([
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    to: "/",
  },
  {
    label: "Market",
    icon: "pi pi-fw pi-shopping-cart",
    items: [
      {
        label: "TradingUI",
        to: "market",
      },
      {
        label: "Table",
        to: "market_table",
      },
    ],
  },
  {
    label: "Explorer",
    icon: "pi pi-fw pi-compass",
    to: "/explorer",
  },
  {
    label: "Portfolio",
    icon: "pi pi-fw pi-book",
    to: "/portfolio",
  },
  {
    label: "About",
    icon: "pi pi-fw pi-info",
    to: "/about",
  },
]);
</script>
