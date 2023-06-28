<script lang="ts" setup>
import { useGlobalStore } from "../../stores/GlobalStore";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import G_CurrentMarketPrice from "./G_CurrentMarketPrice.vue";
import G_Market24hChange from "./G_Market24hChange.vue";

const props = defineProps({
  symbol: {
    type: String,
    default: "FOOD",
    required: true,
  },
  decimals: {
    type: Number,
  },
});
</script>

<template>
  <div
    :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
    class="flex flex-row items-center gap-2 p-inputtext"
  >
    <div class="flex flex-col space-y-1 items-center">
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
        style="width: 20px"
      />
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
        style="width: 20px"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div class="border h-1rem"></div>
      <div class="border h-1rem"></div>
    </div>
    <div class="flex flex-col w-24 text-right">
      <G_CurrentMarketPrice :decimals="decimals" :symbol="symbol + 'USDC'" />
      <G_CurrentMarketPrice :decimals="decimals" :symbol="symbol + 'ATLAS'" />
    </div>
    <div class="flex flex-col w-24 float-right">
      <G_Market24hChange :symbol="symbol + 'USDC'" />
      <G_Market24hChange :symbol="symbol + 'ATLAS'" />
    </div>
  </div>
</template>

<style scoped></style>