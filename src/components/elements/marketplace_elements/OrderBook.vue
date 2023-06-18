<template>
  <div class="flex flex-col text-sm lg:text-base" style="min-width: 450px">
    <ProgressSpinner v-if="is_loading" class="flex justify-center" />

    <div v-else>
      <div class="grid grid-cols-2">
        <order-book-header></order-book-header>
        <order-book-header :reverse_order="true"></order-book-header>
        <div>
          <div v-for="orderBlock in buy_order" :key="orderBlock">
            <order-book-row
              class=""
              :order="orderBlock"
              side="buy"
              :max_size="max_size_buy"
            />
          </div>
        </div>
        <div>
          <div v-for="orderBlock in sell_order" :key="idx">
            <order-book-row
              class=""
              :order="orderBlock"
              side="sell"
              :max_size="max_size_sell"
              :reverse_order="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center h-14"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useGlobalStore } from "../../../stores/GlobalStore";
import OrderBookHeader from "./OrderBookHeader.vue";
import OrderBookRow from "./OrderBookRow.vue";
import { useStaratlasGmStore } from "../../../stores/StaratlasGmStore";
import ProgressSpinner from "primevue/progressspinner";

const is_loading = ref(false);
const orders_grouped_buy = ref([]);
const orders_grouped_sell = ref([]);
const max_size_buy = ref(0);
const max_size_sell = ref(0);
const selectedCurrency = ref();

onMounted(async () => {
  await useStaratlasGmStore().order_book_service.initialize();

  await useStaratlasGmStore().getOpenOrdersForAsset(
    useGlobalStore().symbol.mint_asset.toString()
  );
});

const buy_order = computed(() => {
  return (buy_order.value = useStaratlasGmStore()
    .order_book_service.getBuyOrdersByCurrencyAndItem(
      useGlobalStore().symbol.mint_pair.toString(),
      useGlobalStore().symbol.mint_asset.toString()
    )
    .map((order) => {
      return {
        price: order.uiPrice,
        size: order.orderQtyRemaining,
      };
    })
    .sort((a, b) => a.price - b.price)
    .reverse());
});

const sell_order = computed(() => {
  return (buy_order.value = useStaratlasGmStore()
    .order_book_service.getSellOrdersByCurrencyAndItem(
      useGlobalStore().symbol.mint_pair.toString(),
      useGlobalStore().symbol.mint_asset.toString()
    )
    .map((order) => {
      return {
        price: order.uiPrice,
        size: order.orderQtyRemaining,
      };
    })
    .sort((a, b) => a.price - b.price));
});
</script>
