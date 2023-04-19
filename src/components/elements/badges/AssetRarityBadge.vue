<template>
  <div class="">
    <span
      v-if="props.asset_class === Rarity.Uncommon"
      class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      >Uncommon</span
    >
    <span
      v-if="props.asset_class === Rarity.Common"
      class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      >Common</span
    >
    <span
      v-if="props.asset_class === Rarity.Rare"
      class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      >Rare</span
    >
    <span
      v-if="props.asset_class === Rarity.Epic"
      class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      >Epic</span
    >
    <span
      v-if="props.asset_class === Rarity.Legendary"
      class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      >Legendary</span
    >
    <span
      v-if="props.asset_class === Rarity.Anomaly"
      class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      >Anomaly</span
    >
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { Rarity } from "../../../static/StarAtlasAPIItem";

const props = defineProps({
  asset_class: Object as PropType<Rarity>,
});
</script>

<style scoped>
/*.rarity {*/
/*  @apply text-xs font-medium mr-2 px-2.5 py-0.5 rounded d uppercase;*/
/*}*/
</style>
