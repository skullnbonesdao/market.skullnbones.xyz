<template>
  <div class="flex flex-row justify-around">
    <AssetInfo class="p-card" />

    <div class="p-card"></div>

    <div class="p-card">{{ useGlobalStore().symbol }}</div>

    <div class="p-card">Some</div>
  </div>

  <div>
    <TradingViewChart />
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
