<template>
  <nav>
    <Menubar :model="items">
      <template #start class="">
        <Avatar
          class="flex mr-2"
          image="/logo.png"
          shape="circle"
          size="large"
        ></Avatar>
      </template>

      <template #end>
        <div class="pl-2 flex flex-row space-x-2 items-center">
          <div
            v-tooltip.bottom="'Solana: Current Transactions per second'"
            class="pr-2 grid md:grid-cols-2 items-center uppercase bg-purple-100 text-purple-800 font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300"
          >
            <p class="text-xs md:text-sm">
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

<script lang="ts" setup>
import Avatar from "primevue/avatar";
import { onMounted, ref } from "vue";
import Menubar from "primevue/menubar";
import { WalletMultiButton } from "solana-wallets-vue";
import SwitchTheme from "../components/elements/buttons/SwitchTheme.vue";
import { useTPS } from "../stores/TPS";
import { useGlobalStore } from "../stores/GlobalStore";

onMounted(async () => {
  useTPS().pollData("https://solana-mainnet.rpc.extrnode.com");
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
        to: "/market/" + useGlobalStore().symbol.name,
      },
      {
        label: "Table",
        to: "/market_table",
      },
      {
        label: "MultiChart",
        to: "/multi_chart",
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