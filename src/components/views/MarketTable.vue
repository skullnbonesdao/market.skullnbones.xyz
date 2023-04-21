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
        <ColumnGroup type="header">
          <Row>
            <Column
              header="Name"
              :rowspan="3"
              :colspan="2"
              sortable
              field="api_data.name"
            />

            <Column
              header="VWAP"
              :rowspan="3"
              :colspan="1"
              sortable
              field="api_data.tradeSettings.vwap"
            />
            <Column header="BUY" :colspan="4" />
            <Column header="SELL" :colspan="4" />
          </Row>
          <Row>
            <Column
              header="USDC"
              :colspan="1"
              sortable
              field="orders_usdc.buy_max"
            />
            <Column header="%" :colspan="1" />
            <Column
              header="ATLAS"
              :colspan="1"
              sortable
              field="orders_atlas.buy_max"
            />
            <Column header="%" :colspan="1" />

            <Column
              header="USDC"
              :colspan="1"
              sortable
              field="orders_usdc.sell_min"
            />
            <Column header="%" :colspan="1" />
            <Column
              header="ATLAS"
              :colspan="1"
              sortable
              field="orders_atlas.sell_min"
            />
            <Column header="%" :colspan="1" />
          </Row>
        </ColumnGroup>

        <Column field="api_data.mint">
          <template #body="slotProps">
            <Avatar
              :image="'/webp/' + slotProps.data.api_data.mint + '.webp'"
              class="mr-2"
              size="xlarge"
              shape="circle"
            />
          </template>
        </Column>

        <Column field="api_data.name"></Column>
        <Column>
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

        <!-- BUY -->
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <CurrencyIcon
                style="width: 24px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              />
              <p>
                {{ slotProps.data.orders_usdc.buy_max.toFixed(2) }}
              </p>
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <p>
                {{
                  (
                    (slotProps.data.orders_usdc.buy_max /
                      (slotProps.data.api_data.tradeSettings?.vwap ?? 0)) *
                    100
                  ).toFixed()
                }}%
              </p>
            </div>
          </template>
        </Column>

        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <CurrencyIcon
                style="width: 24px"
                :currency="
                  CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                "
              />
              <p>
                {{ slotProps.data.orders_atlas.buy_max.toFixed(2) }}
              </p>
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <p>0.0%</p>
            </div>
          </template>
        </Column>

        <!-- SELL -->
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <CurrencyIcon
                style="width: 24px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              />
              <p>
                {{ slotProps.data.orders_usdc.sell_min.toFixed(2) }}
              </p>
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <p>
                {{
                  (
                    (slotProps.data.orders_usdc.sell_min /
                      (slotProps.data.api_data.tradeSettings?.vwap ?? 0)) *
                    100
                  ).toFixed()
                }}%
              </p>
            </div>
          </template>
        </Column>

        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <CurrencyIcon
                style="width: 24px"
                :currency="
                  CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                "
              />
              <p>
                {{ slotProps.data.orders_atlas.sell_min.toFixed(2) }}
              </p>
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <p>0.0%</p>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import SelectButton from "primevue/selectbutton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Avatar from "primevue/avatar";
import { onMounted, ref, watch } from "vue";
import { ItemType, StarAtlasAPIItem } from "../../static/StarAtlasAPIItem";
import { useGlobalStore } from "../../stores/GlobalStore";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES, I_CURRENCY } from "../../static/currencies";
import { GmClientService, Order, OrderSide } from "@staratlas/factory";
import { Connection } from "@solana/web3.js";
import { useStaratlasGmStore } from "../../stores/StaratlasGmStore";

const is_loading = ref(true);

interface MarketValues {
  itemType: E_CURRENCIES;
  sell_min: number;
  sell_max: number;
  buy_min: number;
  buy_max: number;
}

interface TableType {
  api_data: StarAtlasAPIItem;
  orders_atlas: MarketValues;
  orders_usdc: MarketValues;
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

  //await filter_api_data_by_itemType();
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

    let orders_usdc: MarketValues = {
      itemType: E_CURRENCIES.USDC,
      buy_max: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Buy,
        1
      ),
      buy_min: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Buy,
        -1
      ),
      sell_max: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Sell,
        1
      ),
      sell_min: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Sell,
        -1
      ),
    };

    let orders_atlas: MarketValues = {
      itemType: E_CURRENCIES.ATLAS,
      buy_max: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Buy,
        1
      ),
      buy_min: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Buy,
        -1
      ),
      sell_max: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Sell,
        1
      ),
      sell_min: get_order(
        orders,
        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ?? CURRENCIES[0],
        filtered.mint.toString(),
        OrderSide.Sell,
        -1
      ),
    };

    table_data.value.push({
      api_data: filtered,
      orders_usdc: orders_usdc,
      orders_atlas: orders_atlas,
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
