<script lang="ts" setup>
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
import PercentageVwapTemplate from "../components/elements/templates/PercentageTemplate.vue";
import PriceTemplate from "../components/elements/templates/PriceTemplate.vue";
import VwapTemplate from "../components/elements/templates/VwapTemplate.vue";

import { E_EXPLORER, EXPLORER } from "../static/explorer";
import ExplorerIcon from "../components/icon-helper/ExplorerIcon.vue";

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
  () => useStaratlasGmStore().status.is_initialized,
  async () => {
    if (useStaratlasGmStore().status.is_initialized)
      await useStaratlasGmStore().update_filtered_market_table_data(
        option_selected.value.value.toString()
      );
  }
);

watch(
  () => option_selected.value,
  async () => {
    await useStaratlasGmStore().update_filtered_market_table_data(
      option_selected.value.value.toString()
    );
  }
);

onMounted(async () => {
  if (useStaratlasGmStore().status.is_initialized) {
    await useStaratlasGmStore().update_filtered_market_table_data(
      option_selected.value.value.toString()
    );
  }
});
</script>

<template>
  <div
    v-if="useStaratlasGmStore().status.is_initialized"
    class="flex flex-col space-y-2"
  >
    <div class="flex flex-col w-full justify-center">
      <div
        v-if="useGlobalStore().currencyPrice.success"
        class="grid grid-cols-1 md:grid-cols-1 gap-2 w-full"
      >
        <div class="p-card p-2 flex justify-center col-span-2 md:col-span-1">
          <Dropdown
            v-model="option_selected"
            :options="options_values"
            class="md:w-14rem"
            optionLabel="value"
            placeholder="Select a item type"
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
        :filters="table_filters"
        :globalFilterFields="['api_data.name']"
        :sortOrder="1"
        :value="useStaratlasGmStore().market_table_data"
        scrollable
        sortField="api_data.tradeSettings.vwap"
        tableStyle="min-width: 50rem"
      >
        <template #header>
          <div class="flex">
            <div class="flex w-full"></div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="table_filters['global'].value"
                placeholder="Search (name)"
                v
              />
            </span>
          </div>
        </template>

        <ColumnGroup type="header">
          <Row>
            <Column
              :colspan="2"
              :rowspan="3"
              field="api_data.name"
              header="Name"
              sortable
            />

            <Column
              :colspan="1"
              :rowspan="3"
              field="api_data.tradeSettings.vwap"
              header="VWAP"
              sortable
            />
            <Column :colspan="4" header="BUY" />
            <Column :colspan="4" header="SELL" />

            <Column :colspan="1" :rowspan="3" header="" />
          </Row>
          <Row>
            <Column
              :colspan="1"
              field="orders_usdc.buy_max"
              header="USDC"
              sortable
            />
            <Column :colspan="1" header="%" />
            <Column
              :colspan="1"
              field="orders_atlas.buy_max"
              header="ATLAS"
              sortable
            />
            <Column :colspan="1" header="%" />

            <Column
              :colspan="1"
              field="orders_usdc.sell_min"
              header="USDC"
              sortable
            />
            <Column :colspan="1" header="%" />
            <Column
              :colspan="1"
              field="orders_atlas.sell_min"
              header="ATLAS"
              sortable
            />
            <Column :colspan="1" header="%" />
          </Row>
        </ColumnGroup>

        <Column field="api_data.mint">
          <template #body="slotProps">
            <Avatar
              :image="'/webp/' + slotProps.data.api_data.mint + '.webp'"
              class="mr-2"
              shape="circle"
              size="xlarge"
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
                :price="slotProps.data.orders_usdc.buy_max"
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
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
                :price="
                  slotProps.data.orders_atlas.buy_max *
                  useGlobalStore().currencyPrice.data[
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      ?.mint ?? ''
                  ].value
                "
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
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
                :price="slotProps.data.orders_usdc.sell_min"
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
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
                :price="
                  slotProps.data.orders_atlas.sell_min *
                  useGlobalStore().currencyPrice.data[
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                      ?.mint ?? ''
                  ].value
                "
                :vwap="slotProps.data.api_data.tradeSettings?.vwap ?? 0"
              />
            </div>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <div class="flex flex-row justify-center items-center space-x-2">
              <ExplorerIcon
                :address="slotProps.data.api_data.mint.toString()"
                :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
                class="w-6"
              />
              <ExplorerIcon
                :address="slotProps.data.api_data.mint.toString()"
                :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
                class="w-6"
              />
              <ExplorerIcon
                :address="slotProps.data.api_data.mint.toString()"
                :explorer="
                  EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)
                "
                class="w-6"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <div v-else class="flex w-full justify-items-center">
    <ProgressSpinner />
  </div>
</template>