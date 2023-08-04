<script lang="ts" setup>
import AssetDetailsCharts from "./Charts/AssetDetailsCharts.vue";
import { useInsightsStore } from "../../../stores/InsightsStore";
import CurrencyIcon from "../../../components/icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import Divider from "primevue/divider";
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-2xl">Price</div>
    <div class="grid grid-cols-2">
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
        class="h-6"
      />
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
        class="h-6"
      />

      <AssetDetailsCharts
        :symbol="useInsightsStore().selected?.symbol + 'ATLAS'"
        class="basis-1/2"
      />
      <AssetDetailsCharts
        :symbol="useInsightsStore().selected?.symbol + 'USDC'"
        class="basis-1/2"
      />
    </div>

    <Divider type="solid" />

    <div class="text-2xl">Volume</div>
    <div class="grid grid-cols-2">
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
        class="h-6"
      />
      <CurrencyIcon
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
        class="h-6"
      />

      <AssetDetailsCharts
        :symbol="useInsightsStore().selected?.symbol + 'ATLAS'"
        :volume="true"
        class="basis-1/2"
      />
      <AssetDetailsCharts
        :symbol="useInsightsStore().selected?.symbol + 'USDC'"
        :volume="true"
        class="basis-1/2"
      />
    </div>
  </div>
</template>

<style scoped></style>