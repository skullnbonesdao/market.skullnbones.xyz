<template>
  <div class="flex flex-col space-y-2">
    <div class="flex flex-col w-full justify-center">
      <div
        class="grid grid-cols-2 md:grid-cols-5 gap-2 w-full"
        v-if="useGlobalStore().currencyPrice.success"
      >
        <TokenPriceElement
          class="p-card justify-center px-5 py-2"
          image-name="BTC/USDC"
          :price="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.BTC)?.mint ?? ''
            ].value.toFixed(2)
          "
          :change24h="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.BTC)?.mint ?? ''
            ].priceChange24h ?? 0.0
          "
          :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.BTC)"
        />
        <TokenPriceElement
          class="p-card justify-center px-5 py-2"
          image-name="SOL/USDC"
          :price="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)?.mint ?? ''
            ].value.toFixed(2)
          "
          :change24h="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)?.mint ?? ''
            ].priceChange24h ?? 0.0
          "
          :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        />
        <TokenPriceElement
          class="p-card justify-center px-5 py-2"
          image-name="POLIS/USDC"
          :price="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.POLIS)?.mint ?? ''
            ].value.toFixed(2)
          "
          :change24h="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.POLIS)?.mint ?? ''
            ].priceChange24h ?? 0.0
          "
          :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.POLIS)"
        />
        <TokenPriceElement
          class="p-card justify-center px-5 py-2"
          image-name="ATLAS/USDC"
          :price="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? ''
            ].value.toFixed(4)
          "
          :change24h="
            useGlobalStore().currencyPrice.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? ''
            ].priceChange24h ?? 0.0
          "
          :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
        />

        <div class="p-card p-2 flex justify-center col-span-2 md:col-span-1">
          <Dropdown
            v-model="option_selected"
            :options="options_values"
            optionLabel="value"
            placeholder="Select a item type"
            class="md:w-14rem"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <div
        v-if="useStaratlasGmStore().status.is_loading"
        class="flex w-full justify-center"
      >
        <ProgressSpinner class="p-card" />
      </div>

      <DataTable
        v-else
        :globalFilterFields="['api_data.name']"
        :value="useStaratlasGmStore().market_table_data"
        tableStyle="min-width: 50rem"
        :filters="table_filters"
        sortField="api_data.tradeSettings.vwap"
        :sortOrder="1"
        scrollable
      >
        <template #header>
          <div class="flex">
            <div class="flex w-full"></div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v
                v-model="table_filters['global'].value"
                placeholder="Search (name)"
              />
            </span>
          </div>
        </template>

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

            <Column header="" :colspan="1" :rowspan="3" />
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
            <VwapTemplate
              :vwap="slotProps.data.api_data.tradeSettings?.vwap?.toFixed(2)"
            />
          </template>
        </Column>

        <!-- BUY -->
        <Column
          :class="useGlobalStore().is_dark ? 'bg-green-800' : 'bg-green-400'"
        >
          <template #body="slotProps">
            <PriceTemplate
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              :price="slotProps.data.orders_usdc.buy_max"
            />
          </template>
        </Column>
        <Column
          :class="useGlobalStore().is_dark ? 'bg-green-800' : 'bg-green-400'"
        >
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <PercentageVwapTemplate
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
                :price="slotProps.data.orders_usdc.buy_max"
              />
            </div>
          </template>
        </Column>

        <Column
          :class="useGlobalStore().is_dark ? 'bg-green-800' : 'bg-green-400'"
        >
          <template #body="slotProps">
            <PriceTemplate
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
              :price="slotProps.data.orders_atlas.buy_max"
            />
          </template>
        </Column>
        <Column
          :class="useGlobalStore().is_dark ? 'bg-green-800' : 'bg-green-400'"
        >
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <PercentageVwapTemplate
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
                :price="
                  slotProps.data.orders_atlas.buy_max *
                  useGlobalStore().currencyPrice.data[
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      ?.mint ?? ''
                  ].value
                "
              />
            </div>
          </template>
        </Column>

        <!-- SELL -->
        <Column :class="useGlobalStore().is_dark ? 'bg-red-800' : 'bg-red-400'">
          <template #body="slotProps">
            <PriceTemplate
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              :price="slotProps.data.orders_usdc.sell_min"
            />
          </template>
        </Column>
        <Column :class="useGlobalStore().is_dark ? 'bg-red-800' : 'bg-red-400'">
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <PercentageVwapTemplate
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
                :price="slotProps.data.orders_usdc.sell_min"
              />
            </div>
          </template>
        </Column>

        <Column :class="useGlobalStore().is_dark ? 'bg-red-800' : 'bg-red-400'">
          <template #body="slotProps">
            <PriceTemplate
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
              :price="slotProps.data.orders_atlas.sell_min"
            />
          </template>
        </Column>
        <Column :class="useGlobalStore().is_dark ? 'bg-red-800' : 'bg-red-400'">
          <template #body="slotProps">
            <div class="flex flex-row space-x-1">
              <PercentageVwapTemplate
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
                :price="
                  slotProps.data.orders_atlas.sell_min *
                  useGlobalStore().currencyPrice.data[
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      ?.mint ?? ''
                  ].value
                "
              />
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row justify-center items-center space-x-2">
              <ExplorerIcon
                :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
                :address="slotProps.data.api_data.mint.toString()"
              />
              <ExplorerIcon
                :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
                :address="slotProps.data.api_data.mint.toString()"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Avatar from "primevue/avatar";
import { onMounted, ref, watch } from "vue";
import { ItemType } from "../static/StarAtlasAPIItem";
import { useGlobalStore } from "../stores/GlobalStore";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";

import { useStaratlasGmStore } from "../stores/StaratlasGmStore";
import { FilterMatchMode } from "primevue/api";
import InputText from "primevue/inputtext";
import TokenPriceElement from "../components/elements/TokenPriceElement.vue";
import PercentageVwapTemplate from "../components/elements/templates/PercentageTemplate.vue";
import PriceTemplate from "../components/elements/templates/PriceTemplate.vue";
import VwapTemplate from "../components/elements/templates/VwapTemplate.vue";
import ExplorerIcon from "../components/elements/icons_images/ExplorerIcon.vue";
import { E_EXPLORER, EXPLORER } from "../static/explorer";

const is_loading = ref(true);

interface OptionType {
  value: string;
}
const table_filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  "api_data.name": { value: null, matchMode: FilterMatchMode.IN },
});

const option_selected = ref({
  value: "Ship",
});
const options_values = ref<OptionType[]>([]);
for (let itemTypeKey in ItemType) {
  options_values.value.push({
    value: itemTypeKey,
  });
}

watch(
  () => option_selected.value,
  async () => {
    await useStaratlasGmStore().update_filtered_market_table_data(
      option_selected.value.value.toString()
    );
  }
);
watch(
  () => useStaratlasGmStore().status.is_initialized,
  async () => {
    // if (useStaratlasGmStore().status.is_initalized) {
    //   console.log("initalized");
    //   await useStaratlasGmStore().update_filtered_market_table_data("Ship");
    // }
  }
);
onMounted(async () => {
  if (useStaratlasGmStore().status.is_initialized) {
    await useStaratlasGmStore().update_filtered_market_table_data("Ship");
  }
});
</script>
