<template>
  <div class="relative ...">
    <div class="avatar bg-gray-200 dark:bg-gray-600 rounded-md p1">
      <div class="w-12">
        <img
          class="object-fill rounded-full h-12 w-12"
          :src="props.asset_image_url"
          alt="asset_image"
        />
      </div>
    </div>

    <div class="absolute top-1 left-1">
      <CurrencyIcon class="w-7" :currency="props.currency" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { PropType } from "vue";
import { E_CURRENCIES, I_CURRENCY } from "../../static/currencies";

const props = defineProps({
  asset_image_url: {
    type: String,
  },
  currency: {
    type: Object as PropType<I_CURRENCY>,
  },
});
</script>

<style scoped></style>
