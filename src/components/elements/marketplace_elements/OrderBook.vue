<template>
  <div class="flex flex-col text-sm lg:text-base" style="min-width: 450px">
    <ProgressSpinner v-if="is_loading" class="flex justify-center" />

    <div v-else>
      <div class="grid grid-cols-2">
        <order-book-header></order-book-header>
        <order-book-header :reverse_order="true"></order-book-header>
        <div>
          <div v-for="orderBlock in buy_order">
            <order-book-row
              class=""
              :order="orderBlock"
              side="buy"
              :max_size="Math.max(...buy_order.map((o) => o.size))"
            />
          </div>
        </div>
        <div>
          <div v-for="orderBlock in sell_order">
            <order-book-row
              class=""
              :order="orderBlock"
              side="sell"
              :max_size="Math.max(...sell_order.map((o) => o.size))"
              :reverse_order="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center h-14"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useGlobalStore } from "../../../stores/GlobalStore";
import OrderBookHeader from "./OrderBookHeader.vue";
import OrderBookRow from "./OrderBookRow.vue";
import {
  OrderBookOrderMap,
  useStaratlasGmStore,
} from "../../../stores/StaratlasGmStore";
import ProgressSpinner from "primevue/progressspinner";

const is_loading = ref(true);

const selectedCurrency = ref();

onMounted(async () => {
  await useStaratlasGmStore().order_book_service.initialize();
  is_loading.value = false;
});

const buy_order = computed(() => {
  let orderbook_map: OrderBookOrderMap[] = [];

  useStaratlasGmStore()
    .order_book_service.getSellOrdersByCurrencyAndItem(
      useGlobalStore().symbol.mint_pair.toString(),
      useGlobalStore().symbol.mint_asset.toString()
    )
    .forEach((order) => {
      orderbook_map.push({
        price: order.uiPrice,
        size: order.orderQtyRemaining,
        owners: [order.owner],
      });
    });

  orderbook_map.sort((a, b) => a.price - b.price).reverse();

  return orderbook_map;
});

const sell_order = computed(() => {
  let orderbook_map: OrderBookOrderMap[] = [];

  useStaratlasGmStore()
    .order_book_service.getSellOrdersByCurrencyAndItem(
      useGlobalStore().symbol.mint_pair.toString(),
      useGlobalStore().symbol.mint_asset.toString()
    )
    .forEach((order) => {
      orderbook_map.push({
        price: order.uiPrice,
        size: order.orderQtyRemaining,
        owners: [order.owner],
      });
    });

  orderbook_map.sort((a, b) => a.price - b.price);

  return orderbook_map;
});
</script>
