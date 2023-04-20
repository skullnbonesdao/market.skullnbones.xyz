<script lang="ts" setup>
import HeaderNavigation from "./components/naviagtion/HeaderNavigation.vue";
import FooterComponent from "./components/naviagtion/FooterComponent.vue";
</script>

<template>
  <body class="flex flex-col min-h-screen">
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
