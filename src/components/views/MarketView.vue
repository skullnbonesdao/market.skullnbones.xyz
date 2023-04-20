<template>
  <div class="space-y-2">
    <div class="flex w-full">
      <AssetInfo
        v-if="!show_search"
        class="p-card w-full p-2"
        @click="show_search = true"
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
    <div class="flex gap-2">
      <div
        :class="show_order_setter ? 'basis-5/6' : 'basis-6/6'"
        class="flex flex-col space-y-2"
      >
        <TradingViewChart class="p-card p-1" />
        <OpenOrders class="p-card" />
      </div>

      <div
        :class="show_order_setter ? 'basis-2/5' : ''"
        class="p-card p-2 flex flex-col"
      >
        <div class="flex justify-end">
          <Button @click="toggle_show_order_setter" severity="info"
            ><i v-if="show_order_setter" class="pi pi-arrow-right"></i>
            <i v-else class="pi pi-arrow-left"></i
          ></Button>
        </div>
        <div>
          <OrderSettter />
          <OrderBook />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import AssetInfo from "../elements/AssetInfo.vue";
import SearchHelperExplorer from "../elements/SearchHelperExplorer.vue";
import TradingViewChart from "../elements/TradingView/TradingViewChart.vue";
import { useGlobalStore } from "../../stores/GlobalStore";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "primevue/usetoast";
import OrderSettter from "../elements/OrderSettter.vue";
import OpenOrders from "../OpenOrders.vue";
import OrderBook from "../elements/marketplace_elements/OrderBook.vue";

const show_search = ref<boolean>();
show_search.value = false;
const toast = useToast();

const show_order_setter = ref<boolean>();
show_order_setter.value = true;

function update_from_search(symbol: any) {
  useGlobalStore().symbol.name = symbol.value;
  useGlobalStore().symbol.mint_asset = new PublicKey(symbol.mint_asset);
  useGlobalStore().symbol.mint_pair = new PublicKey(symbol.mint_pair);
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
