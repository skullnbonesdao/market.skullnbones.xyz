<template>
  <div class="space-y-2">
    <div class="flex w-full">
      <AssetInfo
        v-if="!show_search"
        class="p-card w-full p-2"
        @search_clicked="show_search = true"
      />

      <div class="p-card w-full" v-else>
        <SearchHelperExplorer
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
        <TradingViewChart class="p-card" />
        <OpenOrders class="p-card" />
      </div>
      <div class="flex flex-col space-y-2">
        <OrderSettter class="p-card p-2" />
        <OrderBook class="p-card p-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AssetInfo from "../elements/AssetInfo.vue";
import SearchHelperExplorer from "../elements/SearchHelperExplorer.vue";
import TradingViewChart from "../elements/TradingView/TradingViewChart.vue";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useToast } from "primevue/usetoast";
import OrderSettter from "../elements/OrderSettter.vue";
import OpenOrders from "../elements/OpenOrders.vue";
import OrderBook from "../elements/marketplace_elements/OrderBook.vue";

const show_search = ref<boolean>();
show_search.value = false;
const toast = useToast();

const show_order_setter = ref<boolean>();
show_order_setter.value = true;

function update_from_search(symbol: any) {
  useGlobalStore().update_symbol(
    symbol.value,
    symbol.mint_asset,
    symbol.mint_currency
  );
}

function toggle_show_order_setter() {
  if (show_order_setter.value) {
    show_order_setter.value = false;
  } else {
    show_order_setter.value = true;
  }
}

const selectedCities = ref();
const cities = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);
</script>

<style scoped></style>
