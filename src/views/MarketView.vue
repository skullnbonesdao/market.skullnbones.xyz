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
        <div class="gird grid-cols-1 p-card p-1">
          <div class="flex w-full" @click="show_tv_chart = !show_tv_chart">
            <div class="w-full"></div>
            <i-fluent-table-switch-16-filled
              v-if="show_tv_chart"
              class="mr-2"
            />
            <i-fluent-table-switch-16-regular v-else class="mr-2" />
          </div>
          <TradingViewChart
            v-if="show_tv_chart"
            :symbol="useGlobalStore().symbol.name"
          />
          <ChartJSAssetHistory v-else />
        </div>

        <!--        <TradingViewChart-->
        <!--          :symbol="useGlobalStore().symbol.name"-->
        <!--          class="p-card"-->
        <!--        />-->
        <OpenOrders class="p-card" />
      </div>
      <div class="flex basis-1/3 flex-col space-y-2">
        <MarketplaceQuickLinks class="p-card p-2" />
        <!--        <MarketStatsElement class="p-card p-2"></MarketStatsElement>-->
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
import { useGlobalStore } from "../stores/GlobalStore";
import { useToast } from "primevue/usetoast";
import OrderSettter from "../components/elements/OrderSettter.vue";
import OpenOrders from "../components/elements/OpenOrders.vue";
import OrderBook from "../components/elements/marketplace_elements/OrderBook.vue";
import MarketplaceQuickLinks from "../components/elements/marketplace_elements/MarketplaceQuickLinks.vue";
import ChartJSAssetHistory from "./Market/ChartJSAssetHistory.vue";
import TradingViewChart from "../components/elements/TradingView/TradingViewChart.vue";
import { useRoute, useRouter } from "vue-router";

const show_search = ref<boolean>();
show_search.value = false;
const toast = useToast();

const show_order_setter = ref<boolean>();
show_order_setter.value = true;

const show_tv_chart = ref(false);

const route = useRoute();
const router = useRouter();

watch(
  () => useGlobalStore().status.is_initialized,
  () => {
    if (useGlobalStore().status.is_initialized)
      useGlobalStore().update_symbol(route.params.symbol[0]);
  }
);

watch(
  () => route.params.symbol,
  () => {
    console.log("params changed");
    if (useGlobalStore().status.is_initialized)
      useGlobalStore().update_symbol(route.params.symbol[0]);
  }
);

async function update_from_search(symbol: any) {
  useGlobalStore().update_symbol(
    symbol.value,
    symbol.mint_asset,
    symbol.mint_currency
  );

  route.params.asset = useGlobalStore().symbol.mint_asset.toString();
  await router.push("/market/" + useGlobalStore().symbol.name);
}
</script>

<style scoped></style>