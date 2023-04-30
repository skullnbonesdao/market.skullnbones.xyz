<template>
  <div class="flex flex-col w-full">
    <PortfolioHistoryChart
      :user_wallet="useGlobalStore().wallet.address"
      :limit="1000"
    ></PortfolioHistoryChart>

    <Divider />

    <PortfolioHistoryTable
      :user_wallet="useGlobalStore().wallet.address"
      :limit="10"
    ></PortfolioHistoryTable>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "../../../stores/GlobalStore";
import PortfolioHistoryTable from "../portfolio_elements/PortfolioHistoryTable.vue";
import PortfolioHistoryChart from "../portfolio_elements/PortfolioHistoryChart.vue";
import Divider from "primevue/divider";
</script>
