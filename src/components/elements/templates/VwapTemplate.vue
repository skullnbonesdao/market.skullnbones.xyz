<template>
  <div
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
    class="flex flex-row items-center gap-2 p-inputtext"
  >
    <CurrencyIcon
      :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
      style="width: 24px"
    />
    <div class="border h-1rem"></div>
    <p class="flex w-full justify-end">
      {{ pros.vwap }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import { useGlobalStore } from "../../../stores/GlobalStore";

const pros = defineProps({
  vwap: {
    type: String,
    default: "0",
  },
});
</script>

<style scoped></style>