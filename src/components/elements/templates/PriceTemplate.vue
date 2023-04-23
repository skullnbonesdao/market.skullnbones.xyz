<template>
  <div class="flex flex-row gap-2 p-2 rounded-lg items-center border-2 p-card">
    <div class="flex flex-col space-y-1 items-center">
      <CurrencyIcon
        v-if="props.currency"
        style="width: 20px"
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
      />
      <CurrencyIcon
        v-if="props.currency"
        style="width: 20px"
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
      />
    </div>
    <div class="flex flex-col w-24">
      <p
        v-if="props.currency?.type === E_CURRENCIES.USDC"
        class="flex justify-end"
        :class="props.currency.type === E_CURRENCIES.USDC ? 'underline' : ''"
      >
        {{ format_price_reasonable(props.price) }}
      </p>
      <p v-else class="flex justify-end">
        {{
          format_price_reasonable(
            props.price *
              useGlobalStore().currencyPrice?.data[props.currency?.mint ?? ""]
                ?.value ?? 0
          )
        }}
      </p>

      <p
        class="flex justify-end text-sm"
        v-if="props.currency?.type === E_CURRENCIES.ATLAS"
        :class="props.currency?.type === E_CURRENCIES.ATLAS ? 'underline' : ''"
      >
        {{ format_price_reasonable(props.price) }}
      </p>
      <p class="flex justify-end text-sm" v-else>-</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import {
  CURRENCIES,
  E_CURRENCIES,
  I_CURRENCY,
} from "../../../static/currencies";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { useGlobalStore } from "../../../stores/GlobalStore";

const props = defineProps({
  price: {
    type: Number,
    default: 0.0,
  },
  currency: {
    type: Object as PropType<I_CURRENCY>,
    default: CURRENCIES[0],
  },
});

function format_price_reasonable(price: number | undefined) {
  if (price) return price.toFixed(2);
  else return 0;
}
</script>

<style scoped></style>
