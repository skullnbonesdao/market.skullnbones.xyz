<template>
  <div class="flex flex-col text-sm">
    <ProgressSpinner
      v-if="!buy_orders.length || !sell_orders.length"
      class="flex justify-center"
    />
    <div v-else>
      <div
        id="head"
        class="flex flex-row w-full border-b-2 border-black font-bold"
      >
        <div class="flex w-full justify-start">BUY</div>
        <div class="flex w-full justify-center">
          {{ spread.toFixed(5) }}
        </div>
        <div class="flex w-full justify-end">SELL</div>
      </div>
      <div class="grid 2xl:grid-cols-2">
        <div
          id="col_sell"
          class="flex flex-col 2xl:border-r-1 2xl:border-black"
          style="min-width: 220px"
        >
          <!--          <order-book-header></order-book-header>-->
          <div v-for="orderBlock in buy_orders">
            <order-book-row
              :max_size="Math.max(...buy_orders.map((o) => o.size))"
              :order="orderBlock"
              side="buy"
            />
          </div>
        </div>
        <div
          id="col_buy"
          class="flex flex-col 2xl:border-l-1 2xl:border-black"
          style="min-width: 220px"
        >
          <!--          <order-book-header :reverse_order="true"></order-book-header>-->
          <div v-for="orderBlock in sell_orders">
            <order-book-row
              :max_size="Math.max(...sell_orders.map((o) => o.size))"
              :order="orderBlock"
              :reverse_order="true"
              class=""
              side="sell"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useGlobalStore } from "../../../stores/GlobalStore";
import OrderBookRow from "./OrderBookRow.vue";
import {
  OrderBookOrderMap,
  useStaratlasGmStore,
} from "../../../stores/StaratlasGmStore";
import ProgressSpinner from "primevue/progressspinner";
import { OrderSide } from "@staratlas/factory";

const is_loading = ref(true);

const selectedCurrency = ref();

const buy_orders = ref<OrderBookOrderMap[]>([]);
const sell_orders = ref<OrderBookOrderMap[]>([]);

watch(
  () => useGlobalStore().symbol.mint_pair,
  () => {
    buy_orders.value = [];
    sell_orders.value = [];
  }
);

function update_order_book() {
  if (!useStaratlasGmStore().status.is_initialized) return;
  let orders = Array.from(
    useStaratlasGmStore()
      .order_book_service.getAllOrdersByItemMint(
        useGlobalStore().symbol.mint_asset.toString()
      )
      .values()
  );
  buy_orders.value = orders
    .filter(
      (order) =>
        order.currencyMint === useGlobalStore().symbol.mint_pair.toString()
    )
    .filter((order) => order.orderType === OrderSide.Buy)
    .map((order) => {
      return {
        price: order.uiPrice,
        size: order.orderQtyRemaining,
        owners: [order.owner],
      };
    })
    .sort((a, b) => a.price - b.price)
    .reverse() as [];

  sell_orders.value = orders
    .filter(
      (order) =>
        order.currencyMint === useGlobalStore().symbol.mint_pair.toString()
    )
    .filter((order) => order.orderType === OrderSide.Sell)
    .map((order) => {
      return {
        price: order.uiPrice,
        size: order.orderQtyRemaining,
        owners: [order.owner],
      };
    })
    .sort((a, b) => a.price - b.price) as [];
}

const update_handle = setInterval(function () {
  update_order_book();
}, 5000);

const spread = computed(() => {
  return buy_orders.value[0].price - sell_orders.value[0].price;
});
</script>