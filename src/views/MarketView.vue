<template>
  <div class="space-y-2">
    <div class="flex w-full h-18">
      <AssetInfo
        v-if="!show_search"
        class="p-card w-full p-2"
        @search_clicked="show_search = true"
      />

      <div v-else class="p-card w-full h-18">
        <SearchHelperExplorer
          class="w-full h-full p-2"
          @toSearch="
            (value) => {
              show_search = false;
              update_from_search(value.api_search);
            }
          "
        />
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-2">
      <div class="flex w-full flex-col space-y-2">
        <TradingViewChart
          :symbol="useGlobalStore().symbol.name"
          class="p-card"
        />
        <OpenOrders class="p-card" />
      </div>
      <div class="flex basis-1/3 flex-col space-y-2">
        <MarketplaceQuickLinks class="p-card p-2" />
        <OrderSettter class="p-card p-2" />
        <OrderBook class="p-card p-2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import AssetInfo from "../components/elements/AssetInfo.vue";
import SearchHelperExplorer from "../components/elements/SearchHelperExplorer.vue";
import TradingViewChart from "../components/elements/TradingView/TradingViewChart.vue";
import { useGlobalStore } from "../stores/GlobalStore";
import { useToast } from "primevue/usetoast";
import OrderSettter from "../components/elements/OrderSettter.vue";
import OpenOrders from "../components/elements/OpenOrders.vue";
import OrderBook from "../components/elements/marketplace_elements/OrderBook.vue";
import MarketplaceQuickLinks from "../components/elements/marketplace_elements/MarketplaceQuickLinks.vue";

const show_search = ref<boolean>();
show_search.value = false;
const toast = useToast();

const show_order_setter = ref<boolean>();
show_order_setter.value = true;

watch(
  () => useGlobalStore().symbol.name,
  () => {}
);

function update_from_search(symbol: any) {
  useGlobalStore().update_symbol(
    symbol.value,
    symbol.mint_asset,
    symbol.mint_currency
  );
}
</script>

<style scoped></style>