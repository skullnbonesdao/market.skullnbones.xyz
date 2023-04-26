<script setup lang="ts">
import { PropType } from "vue";
import { E_CURRENCIES, I_CURRENCY } from "../../static/currencies";

const props = defineProps({
  currency: {
    type: Object as PropType<I_CURRENCY>,
  },
});
</script>

<template>
  <img
    :class="
      props.currency?.type === E_CURRENCIES.USDC ? '' : 'border-2 border-black'
    "
    class="rounded-full"
    :src="props.currency?.image_path"
    alt="asset_image"
  />
</template>
