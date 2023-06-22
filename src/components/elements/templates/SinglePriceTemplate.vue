<template>
  <div
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
    class="flex flex-row gap-2 p-2 rounded-lg items-center border-2 p-card"
  >
    <div class="flex flex-col space-y-1 items-center">
      <CurrencyIcon
        v-if="props.currency"
        :currency="props.currency"
        style="width: 20px"
      />
    </div>
    <div class="flex w-full">
      <p class="flex w-full justify-end text-sm">
        {{ props.price }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { CURRENCIES, I_CURRENCY } from "../../../static/currencies";
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