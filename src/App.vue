<script lang="ts" setup>
import HeaderNavigation from "./naviagtion/HeaderNavigation.vue";
import { useGlobalStore } from "./stores/GlobalStore";
import { onMounted } from "vue";
import StatusStoreTemplate from "./components/elements/templates/StatusStoreTemplate.vue";
import FooterComponent from "./naviagtion/FooterComponent.vue";
import { useUserWalletStore } from "./stores/UserWalletStore";

onMounted(async () => {
  useUserWalletStore().address = undefined;
  await useGlobalStore().init();

  //works better ignoring the start of the GN
  //useStaratlasGmStore().init();
});

//useStaratlasGmStore().init();
</script>

<template>
  <body
    class="flex flex-col min-h-screen"
    :class="useGlobalStore().is_dark ? '' : 'bg-gray-200'"
  >
    <header class="sticky top-0 z-50">
      <HeaderNavigation />
    </header>

    <main class="relative items-stretch flex-grow">
      <router-view class="flex-1 m-2"></router-view>
    </main>

    <div>
      <FooterComponent class="sticky bottom-0 flex-1 m-2" />
    </div>
    <footer class="sticky bottom-0 z-50">
      <StatusStoreTemplate />
    </footer>
  </body>
</template>

<style scoped></style>
