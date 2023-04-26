<template>
  <div class="flex">
    <div class="relative flex">
      <div class="absolute top-0 -left-6">
        <CurrencyIcon class="h-12" :currency="props.currency" />
      </div>
      <Avatar
        size="large"
        shape="circle"
        :image="props.asset_image_url"
      ></Avatar>
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
