<template>
  <div class="flex relative">
    <Avatar
      :image="props.asset_image_url"
      class="mr-2"
      size="large"
      shape="circle"
    />
    <div class="absolute top-1 left-1">
      <CurrencyIcon class="w-6" :currency="props.currency" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { PropType } from "vue";
import { I_CURRENCY } from "../../static/currencies";
import Avatar from "primevue/avatar";

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
