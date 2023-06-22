<template>
  <div
    class="flex flex-row gap-2 p-2 rounded-lg items-center border-2 p-card"
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
  >
    <div class="flex flex-col space-y-1 items-center">
      <CurrencyIcon
        style="width: 20px"
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
      />
      <CurrencyIcon
        style="width: 20px"
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
      />
    </div>
    <div class="flex flex-col w-full text-right text-sm">
      <p>
        {{ format_price_reasonable(props.price_usdc) }}
      </p>
      <p>
        {{ format_price_reasonable(props.price_atlas) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { useGlobalStore } from "../../../stores/GlobalStore";

const props = defineProps({
  price_usdc: {
    type: Number,
    default: 0.0,
  },
  price_atlas: {
    type: Number,
    default: 0.0,
  },
});

function format_price_reasonable(price: number | undefined) {
  if (price) return price.toFixed(2);
  else return 0;
}
</script>

<style scoped></style>
