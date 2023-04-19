<template>
  <div class="space-y-2">
    <div class="flex w-full">
      <AssetInfo
        v-if="!show_search"
        class="p-card w-full p-2"
        @click="show_search = true"
      />
      <div class="p-card w-full" v-else>
        <SearchHelperExplorer
          @toSearch="
            (value) => {
              show_search = false;
              update_from_search(value.api_search);
            }
          "
        />
      </div>
    </div>

    <div class="p-card p-2">
      <TradingViewChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AssetInfo from "../elements/AssetInfo.vue";
import SearchHelperExplorer from "../elements/SearchHelperExplorer.vue";
import TradingViewChart from "../elements/TradingView/TradingViewChart.vue";
import { useGlobalStore } from "../../stores/GlobalStore";
import { PublicKey } from "@solana/web3.js";

const show_search = ref<boolean>();
show_search.value = false;

function update_from_search(symbol: any) {
  useGlobalStore().symbol.name = symbol.value;
  useGlobalStore().symbol.mint_asset = new PublicKey(symbol.mint_asset);
  useGlobalStore().symbol.mint_pair = new PublicKey(symbol.mint_pair);
}
</script>

<style scoped></style>
