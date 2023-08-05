<script lang="ts" setup>
import AssetsTreeView from "./Inisghts/AssetsTreeView.vue";
import AssetDetails from "./Inisghts/AssetDetails.vue";
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <AssetsTreeView class="basis-1/6" />
    <AssetDetails class="basis-5/6" />
  </div>
</template>