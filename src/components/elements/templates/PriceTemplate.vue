<template>
  <div
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
    class="flex flex-row gap-2 p-2 rounded-lg items-center border-2 p-card"
  >
    <div class="flex flex-col space-y-1 items-center">
      <CurrencyIcon
        v-if="props.currency"
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
        style="width: 20px"
      />
      <CurrencyIcon
        v-if="props.currency"
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
        style="width: 20px"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div class="border h-1rem"></div>
      <div class="border h-1rem"></div>
    </div>
    <div class="flex flex-col w-24">
      <p
        v-if="props.currency?.type === E_CURRENCIES.USDC"
        :class="props.currency.type === E_CURRENCIES.USDC ? 'underline' : ''"
        class="flex justify-end"
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
        v-if="props.currency?.type === E_CURRENCIES.ATLAS"
        :class="props.currency?.type === E_CURRENCIES.ATLAS ? 'underline' : ''"
        class="flex justify-end text-sm"
      >
        {{ format_price_reasonable(props.price) }}
      </p>
      <p v-else class="flex justify-end text-sm">-</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
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