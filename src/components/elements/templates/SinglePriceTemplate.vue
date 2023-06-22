<template>
  <div class="flex flex-row gap-2 p-2 p-inputtext">
    <div class="flex flex-row w-full justify-end space-x-2">
      <p class="flex text-sm">
        {{ props.price }}
      </p>
      <div class="border-1"></div>
      <CurrencyIcon
        v-if="props.currency"
        :currency="props.currency"
        class="flex"
        style="width: 20px"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { CURRENCIES, I_CURRENCY } from "../../../static/currencies";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";

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