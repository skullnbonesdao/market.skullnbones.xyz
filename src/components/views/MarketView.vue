<template>
  <div class="m-2 space-y-2">
    <div class="flex w-full">
      <AssetInfo class="p-card w-full p-2" />
    </div>

    <div class="p-card p-2">
      <TradingViewChart />
    </div>
  </div>
</template>

<script>
import TradingViewChart from "../elements/TradingView/TradingViewChart.vue";
import { useGlobalStore } from "../../stores/GlobalStore";
import AssetInfo from "@/src/components/elements/AssetInfo.vue";

export default {
  name: "MarketView",
  methods: { useGlobalStore },
  components: { AssetInfo, TradingViewChart },
};
</script>

<style scoped></style>
