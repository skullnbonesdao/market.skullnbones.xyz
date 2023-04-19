<template>
  <div>Market</div>
  <div>
    <TradingViewChart />
  </div>
</template>

<script>
import TradingViewChart from "../elements/TradingView/TradingViewChart.vue";

export default {
  name: "MarketView",
  components: { TradingViewChart },
};
</script>

<style scoped></style>
