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
      props.currency?.type === E_CURRENCIES.ATLAS
        ? ' border-black'
        : 'border-transparent'
    "
    class="border-2 rounded-full"
    :src="props.currency?.image_path"
    alt="asset_image"
  />
</template>
