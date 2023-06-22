<template>
  <div class="flex flex-col gap-2 p-2 p-inputtext">
    <div>
      <div class="flex flex-row w-full gap-2 items-center">
        <div>
          <CurrencyIcon
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            style="width: 20px"
          />
        </div>
        <div class="border h-1rem"></div>
        <p class="flex w-full justify-end">
          {{ format_price_reasonable(props.price_usdc) }}
        </p>
      </div>
      <div class="flex flex-row w-full gap-2 items-center">
        <div>
          <CurrencyIcon
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            style="width: 20px"
          />
        </div>
        <div class="border h-1rem"></div>
        <p class="flex w-full justify-end">
          {{ format_price_reasonable(props.price_atlas) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";

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