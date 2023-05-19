<template>
  <div
    class="flex flex-row items-center p-2 rounded-lg border-2 p-card"
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
  >
    <CurrencyIcon
      style="width: 24px"
      :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
    />
    <p class="flex w-full justify-end">
      {{ pros.vwap }}
    </p>
  </div>
</template>

<script setup lang="ts">
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
