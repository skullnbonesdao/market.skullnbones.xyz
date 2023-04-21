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

    <div class="card">
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
                {{ slotProps.data.api_data.tradeSettings.vwap.toFixed(2) }}
              </p>
            </div>
          </template>
        </Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";
import { ref, watch } from "vue";
import { ItemType, StarAtlasAPIItem } from "../../static/StarAtlasAPIItem";
import { useGlobalStore } from "../../stores/GlobalStore";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";

interface TableType {
  api_data: StarAtlasAPIItem;
}

interface OptionType {
  value: string;
}
const table_data = ref<TableType[]>([]);

const option_selected = ref({
  value: "Ship",
});
const options_values = ref<OptionType[]>([]);

for (let itemTypeKey in ItemType) {
  options_values.value.push({
    value: itemTypeKey,
  });
}

filter_api_data_by_itemType();

watch(
  () => option_selected.value,
  () => {
    filter_api_data_by_itemType();
  }
);

function filter_api_data_by_itemType() {
  table_data.value = [];
  useGlobalStore()
    .sa_api_data.filter(
      (api) =>
        api.attributes.itemType.toLowerCase() ===
        option_selected.value.value.toLowerCase()
    )
    .forEach((filtered) => table_data.value.push({ api_data: filtered }));
}
</script>
