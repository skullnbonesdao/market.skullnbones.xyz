<script lang="ts" setup>
import HeaderNavigation from "./components/naviagtion/HeaderNavigation.vue";
import FooterComponent from "./components/naviagtion/FooterComponent.vue";
import { useGlobalStore } from "./stores/GlobalStore";
import { useStaratlasGmStore } from "./stores/StaratlasGmStore";
import { onMounted } from "vue";

onMounted(async () => {
  await useGlobalStore().init();
  await useStaratlasGmStore().init();
});

//useStaratlasGmStore().init();
</script>

<template>
  <body
    class="flex flex-col min-h-screen"
    :class="useGlobalStore().is_dark ? '' : 'bg-gray-200'"
  >
    <header>
      <HeaderNavigation />
    </header>
    <main class="flex-grow">
      <router-view class="m-2"></router-view>
    </main>
    <footer>
      <FooterComponent class="m-2" />
    </footer>
  </body>
</template>

<style scoped></style>
