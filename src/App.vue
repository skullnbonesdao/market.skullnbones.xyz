<script lang="ts" setup>
import HeaderNavigation from "./components/naviagtion/HeaderNavigation.vue";
import FooterComponent from "./components/naviagtion/FooterComponent.vue";
import { useGlobalStore } from "./stores/GlobalStore";
import { onMounted } from "vue";
import StatusStoreTemplate from "./components/elements/templates/StatusStoreTemplate.vue";

onMounted(async () => {
  await useGlobalStore().init();
  //await useStaratlasGmStore().init();
});

//useStaratlasGmStore().init();
</script>

<template>
  <body
    class="flex flex-col"
    :class="useGlobalStore().is_dark ? '' : 'bg-gray-200'"
  >
    <header class="sticky top-0 z-50">
      <HeaderNavigation />
    </header>
    <main class="relative flex flex-col flex-grow">
      <div class="mx-2">
        <StatusStoreTemplate class="m-2" />
      </div>
      <router-view class="m-2"></router-view>
    </main>
    <footer>
      <FooterComponent class="m-2" />
    </footer>
  </body>
</template>

<style scoped></style>
