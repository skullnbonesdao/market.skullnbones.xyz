<template>
  <div class="flex flex-col space-y-2">
    <div class="flex w-full justify-center">
      <SelectButton
        v-model="option_selected"
        :options="options_values"
        optionLabel="value"
        dataKey="value"
        aria-labelledby="custom"
      >
      </SelectButton>
    </div>

    <div class="p-card flex flex-col">
      <ProgressSpinner v-if="is_loading" />

      <DataTable :value="table_data" tableStyle="min-width: 50rem">
        <Column>
          <template #body="slotProps">
            <Avatar
              :image="'/webp/' + slotProps.data.api_data.mint + '.webp'"
              class="mr-2"
              size="xlarge"
              shape="circle"
            />
          </template>
        </Column>

        <Column field="api_data.name" header="Name" sortable></Column>
        <Column field="api_data.tradeSettings.vwap" header="VWAP" sortable>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <CurrencyIcon
                style="width: 24px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              />
              <p>
                {{ slotProps.data.api_data.tradeSettings?.vwap?.toFixed(2) }}
              </p>
            </div>
          </template>
        </Column>

        <Column field="orders.atlas.ask_max" header="ATLAS"></Column>

        <Column field="orders.usdc.ask_max" header="USDC"></Column>

        <Column field="category" header="ASK2"></Column>

        <Column field="category" header="ASK2"></Column>
        <Column field="orders" header="ASK">
          <template #body="slotProps">
            <p>{{ slotProps.data.orders.atlas.ask_max }}</p>

            <p>{{ slotProps.data.orders.atlas.ask_min }}</p>

            <p>{{ slotProps.data.orders.atlas.bid_max }}</p>
            <p>{{ slotProps.data.orders.atlas.bid_min }}</p>
          </template>
        </Column>

        <Column field="category" header="ASK1"></Column>

        <Column field="category" header="ASK2"></Column>
        <Column field="quantity" header="BID"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import SelectButton from "primevue/selectbutton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";
import { onMounted, ref, watch } from "vue";
import { ItemType, StarAtlasAPIItem } from "../../static/StarAtlasAPIItem";
import { useGlobalStore } from "../../stores/GlobalStore";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES, I_CURRENCY } from "../../static/currencies";
import { GmClientService, Order, OrderSide } from "@staratlas/factory";
import { Connection, PublicKey } from "@solana/web3.js";
import { GM_PROGRAM_ID } from "../../static/constants/StarAtlasConstants";
import { useStaratlasGmStore } from "../../stores/StaratlasGmStore";

const is_loading = ref(true);

export interface TableType {
  api_data: StarAtlasAPIItem;
  orders: {
    atlas: {
      ask_min: number;
      ask_max: number;
      bid_min: number;
      bid_max: number;
    };
    usdc: {
      ask_min: number;
      ask_max: number;
      bid_min: number;
      bid_max: number;
    };
  };
}

interface OptionType {
  value: string;
}
const table_data = ref<TableType[]>([]);

const option_selected = ref();
const options_values = ref<OptionType[]>([]);

const orders_gm = ref<Order[]>([]);

for (let itemTypeKey in ItemType) {
  options_values.value.push({
    value: itemTypeKey,
  });
}

watch(
  () => option_selected.value,
  () => {
    filter_api_data_by_itemType();
  }
);

onMounted(async () => {
  await useStaratlasGmStore().order_book_service.initialize();

  option_selected.value = {
    value: "Ship",
  };

  await filter_api_data_by_itemType();
});

async function filter_api_data_by_itemType() {
  let connection = new Connection(useGlobalStore().rpc.url);
  let gm_client = new GmClientService();

  if (!option_selected.value) return;
  table_data.value = [];
  for (const filtered of useGlobalStore().sa_api_data.filter(
    (api) =>
      api.attributes.itemType.toLowerCase() ===
      option_selected.value.value?.toLowerCase()
  )) {
    let orders = Array.from(
      await useStaratlasGmStore()
        .order_book_service.getAllOrdersByItemMint(filtered.mint)
        .values()
    );

    console.log(orders);

    table_data.value.push({
      api_data: filtered,
      orders: {
        atlas: {
          ask_min: get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Sell,
            1
          ),
          ask_max: get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Sell,
            1
          ),
          bid_min: get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Buy,
            -1
          ),
          bid_max: get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Buy,
            -1
          ),
        },

        usdc: {
          ask_min: 0.0,
          ask_max: 0.0,
          bid_min: 0.0,
          bid_max: 0.0,
        },
      },
    });
  }

  is_loading.value = false;
}

function get_order(
  orders: Order[],
  currency: I_CURRENCY,
  mint: string,
  side: OrderSide,
  direction: number
): number {
  let orders_filtered = orders
    ?.filter((o) => o.orderMint.toString() === mint)
    ?.filter((o) => o.currencyMint?.toString() === currency.mint)
    ?.filter((o) => o.orderType === side);

  let order;

  if (orders_filtered.length) {
    if (direction === -1) {
      order = orders_filtered?.reduce((a, b) =>
        a.uiPrice < b.uiPrice ? a : b
      )?.uiPrice;
    } else {
      order = orders_filtered?.reduce((a, b) =>
        a?.uiPrice > b.uiPrice ? a : b
      )?.uiPrice;
    }
  }

  if (order) {
    return order;
  } else return 0.0;
}
</script>
