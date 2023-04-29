<template>
  <nav>
    <Menubar :model="items">
      <template #start class="">
        <Avatar image="/public/logo.png" size="large" shape="circle"></Avatar>
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
  </nav>
</template>

<script setup lang="ts">
import Avatar from "primevue/avatar";
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
    label: "Sage",
    icon: "pi pi-fw pi-sitemap",
    items: [
      {
        label: "Prizes",
        to: "sageprizes",
      },
    ],
  },
  {
    label: "About",
    icon: "pi pi-fw pi-info",
    to: "/about",
  },
]);
</script>

<style scoped>
nav {
  z-index: 10;
}

nav.scrolled {
  @apply shadow-2xl;
  border-bottom: 0px;
}
</style>
