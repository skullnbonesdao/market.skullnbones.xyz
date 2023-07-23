<script lang="ts" setup>
import { ref } from "vue";
import TradingViewChart from "../components/elements/TradingView/TradingViewChart.vue";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import { useGlobalStore } from "../stores/GlobalStore";
import { useLocalStorage } from "@vueuse/core";

interface SymbolsSearch {
  name: string;
  symbol: string;
}

let chart_cols = ref(useLocalStorage("chart_cols", 2));
let chart_height = ref(useLocalStorage("chart_height", 400));
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
  <div class="flex flex-col xl:flex-row p-card p-2 m-1 gap-2">
    <div class="p-inputgroup w-full">
      <span class="p-inputgroup-addon">Symbols</span>
      <MultiSelect
        v-model="selectedSymbols"
        :maxSelectedLabels="6"
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
      <span class="p-inputgroup-addon">Columns</span>
      <InputNumber
        v-model="chart_cols"
        :max="3"
        :min="1"
        inputId="minmax-buttons"
        mode="decimal"
        showButtons
      />
    </div>
    <div class="p-inputgroup basis-1/5">
      <span class="p-inputgroup-addon">Height</span>
      <InputNumber
        v-model="chart_height"
        :min="1"
        inputId="minmax-buttons"
        mode="decimal"
        showButtons
        suffix="px"
      />
    </div>
  </div>

  <div :class="'grid gap-1  grid-cols-' + chart_cols">
    <div v-for="symbol in selectedSymbols">
      <TradingViewChart
        :height_px="chart_height"
        :symbol="symbol.symbol"
        class=""
      />
    </div>
  </div>
</template>

<style scoped></style>