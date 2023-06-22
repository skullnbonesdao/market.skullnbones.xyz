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
  <div class="parent">
    <img
      class="rounded-full border-1"
      :class="
        props.currency?.type === E_CURRENCIES.ATLAS
          ? ' border-black'
          : ' border-none'
      "
      :src="props.currency?.image_path"
      alt="asset_image"
    />
  </div>
</template>

<style scoped>
.parent {
  width: 100px;
}
img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}
</style>
