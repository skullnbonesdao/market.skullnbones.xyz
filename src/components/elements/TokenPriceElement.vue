<template>
  <div class="p-card flex flex-row space-x-2">
    <div class="w-9 pt-3">
      <CurrencyIcon :currency="props.currency" />
    </div>

    <div>
      <div class="flex items-center">
        <div class="text-right uppercase">{{ props.imageName }}</div>
      </div>
      <div class="flex items-center">
        <div class="text-right">
          {{ props.price }}
        </div>
        <div class="i-carbon-currency-dollar"></div>
      </div>

      <div class="flex items-center" v-if="props.change24h">
        <div
          class="text-sm"
          :class="
            props.change24h > 0 && true
              ? 'i-carbon-arrow-up-right text-green'
              : 'i-carbon-arrow-down-right text-red'
          "
        ></div>
        <div
          class="text-right"
          :class="props.change24h > 0 ? 'text-green' : 'text-red'"
        >
          {{ props.change24h?.toFixed(2) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType } from "vue";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import type { I_CURRENCY } from "../../static/currencies";

const props = defineProps({
  imageName: String,
  price: String,
  change24h: Number,
  currency: Object as PropType<I_CURRENCY>,
});
</script>
