<script lang="ts" setup>
import { ref } from "vue";
import TradingViewChart from "../components/elements/TradingView/TradingViewChart.vue";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import { useGlobalStore } from "../stores/GlobalStore";

interface SymbolsSearch {
  name: string;
  symbol: string;
}

let cols = ref(2);

let selectedSymbols = ref<SymbolsSearch[]>([
  {
    name: "Food [FOODATLAS]",
    symbol: "FOODATLAS",
  },
  {
    name: "Fuel [FUELATLAS]",
    symbol: "FUELATLAS",
  },
  {
    name: "Ammunition [AMMOATLAS]",
    symbol: "AMMOATLAS",
  },
  {
    name: "Toolkit [TOOLATLAS]",
    symbol: "TOOLATLAS",
  },
]);
</script>

<template>
  <div class="flex flex-row p-card p-2 m-1 gap-2">
    <div class="p-inputgroup w-full">
      <span class="p-inputgroup-addon"> Symbols </span>
      <MultiSelect
        v-model="selectedSymbols"
        :maxSelectedLabels="3"
        :options="
          useGlobalStore().sa_api_data.flatMap((asset) => {
            return [{
              name: asset.name + ' [' + asset.symbol + 'USDC]',
              symbol: asset.symbol + 'USDC'
            },{
              name: asset.name + ' [' + asset.symbol + 'ATLAS]',
              symbol: asset.symbol + 'ATLAS'
            }] as SymbolsSearch[];
          })
        "
        class="w-full md:w-20rem"
        filter
        optionLabel="name"
      />
      <Button icon="pi pi-trash" @click="selectedSymbols = []" />
    </div>
    <div class="p-inputgroup basis-1/5">
      <span class="p-inputgroup-addon"> Cols </span>
      <InputNumber
        v-model="cols"
        :max="100"
        :min="0"
        inputId="minmax-buttons"
        mode="decimal"
        showButtons
      />
    </div>
  </div>

  <div :class="'grid-cols-' + cols" class="grid gap-2">
    <TradingViewChart
      v-for="symbol in selectedSymbols"
      :symbol="symbol.symbol"
      class="col-span-1 p-card"
    />
  </div>
</template>

<style scoped></style>