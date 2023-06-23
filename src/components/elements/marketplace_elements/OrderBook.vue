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
        <div id="col_sell" class="flex flex-col" style="min-width: 220px">
          <!--          <order-book-header></order-book-header>-->
          <div v-for="orderBlock in buy_orders">
            <order-book-row
              :max_size="Math.max(...buy_orders.map((o) => o.size))"
              :order="orderBlock"
              class=""
              side="buy"
            />
          </div>
        </div>
        <div id="col_buy" class="flex flex-col" style="min-width: 220px">
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
import { computed, ref, watchEffect } from "vue";
import { useGlobalStore } from "../../../stores/GlobalStore";
import OrderBookRow from "./OrderBookRow.vue";
import {
  OrderBookOrderMap,
  useStaratlasGmStore,
} from "../../../stores/StaratlasGmStore";
import ProgressSpinner from "primevue/progressspinner";
import { GM_PROGRAM_ID } from "../../../static/constants/StarAtlasConstants";
import { Connection, PublicKey } from "@solana/web3.js";
import { OrderSide } from "@staratlas/factory";

const is_loading = ref(true);

const selectedCurrency = ref();

const buy_orders = ref<OrderBookOrderMap[]>([]);
const sell_orders = ref<OrderBookOrderMap[]>([]);
watchEffect(async () => {
  let orders =
    await useStaratlasGmStore().gmClientService.getOpenOrdersForAsset(
      useGlobalStore().connection as Connection,
      useGlobalStore().symbol.mint_asset,
      new PublicKey(GM_PROGRAM_ID)
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
});

const spread = computed(() => {
  return buy_orders.value[0].price - sell_orders.value[0].price;
});

// const buy_order = computed(() => {
//   let orderbook_map: OrderBookOrderMap[] = [];
//
//   useStaratlasGmStore()
//     .gmClientService.getOpenOrdersForAsset(
//       useGlobalStore().symbol.mint_pair.toString(),
//       useGlobalStore().symbol.mint_asset.toString()
//     )
//     .forEach((order) => {
//       orderbook_map.push({
//         price: order.uiPrice,
//         size: order.orderQtyRemaining,
//         owners: [order.owner],
//       });
//     });
//
//   orderbook_map.sort((a, b) => a.price - b.price).reverse();
//
//   return orderbook_map;
// });

// const sell_order = computed(() => {
//   let orderbook_map: OrderBookOrderMap[] = [];
//
//   useStaratlasGmStore()
//     .gmClientService.getSellOrdersByCurrencyAndItem(
//       useGlobalStore().symbol.mint_pair.toString(),
//       useGlobalStore().symbol.mint_asset.toString()
//     )
//     .forEach((order) => {
//       orderbook_map.push({
//         price: order.uiPrice,
//         size: order.orderQtyRemaining,
//         owners: [order.owner],
//       });
//     });
//
//   orderbook_map.sort((a, b) => a.price - b.price);
//
//   return orderbook_map;
// });
</script>