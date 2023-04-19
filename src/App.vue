<script lang="ts" setup>
import HeaderNavigation from "./components/naviagtion/HeaderNavigation.vue";
import FooterComponent from "./components/naviagtion/FooterComponent.vue";
</script>

<template>
  <div>
    <header>
      <HeaderNavigation />
    </header>
    <router-view class=""></router-view>
    <FooterComponent />
  </div>
</template>

<style scoped></style>
