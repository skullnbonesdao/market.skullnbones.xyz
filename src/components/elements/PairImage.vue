<template>
  <div class="">
    <div class="relative h-13 w-20">
      <div class="absolute left-7">
        <Avatar
          size="large"
          shape="circle"
          :image="props.asset_image_url"
        ></Avatar>
      </div>

      <CurrencyIcon class="relative w-12" :currency="props.currency" />
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
