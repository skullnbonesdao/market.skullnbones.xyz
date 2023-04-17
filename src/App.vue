<script lang="ts" setup>
import HelloWorld from "./components/HelloWorld.vue";
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
