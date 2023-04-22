<template>
  <div class="card relative z-2">
    <Menubar :model="items">
      <template #start class="">
        <img alt="logo" src="/public/logo.png" class="mr-2 h-12" />
      </template>

      <template #end>
        <div class="flex flex-row space-x-2 items-center">
          <WalletMultiButton dark />
          <SwitchTheme />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import { WalletMultiButton } from "solana-wallets-vue";
import SwitchTheme from "@/src/components/elements/buttons/SwitchTheme.vue";
import { useGlobalStore } from "@/src/stores/GlobalStore";
import { useStaratlasGmStore } from "../../stores/StaratlasGmStore";
const globalStore = useGlobalStore();

onMounted(async () => {
  await globalStore.init();
  await globalStore.load_sa_api();
  await globalStore.load_currency_prices();
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
