<script lang="ts" setup>
import HeaderNavigation from "./components/naviagtion/HeaderNavigation.vue";
</script>

<template>
  <div>
    <header>
      <HeaderNavigation />
    </header>

    <router-view class=""></router-view>
  </div>
</template>

<style scoped></style>
