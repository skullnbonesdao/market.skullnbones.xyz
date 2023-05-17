<script setup lang="ts">
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import { useGlobalStore } from "../../../stores/GlobalStore";
import ExplorerIcon from "../../icon-helper/ExplorerIcon.vue";
</script>

<template>
  <div class="flex flex-row justify-around">
    <ExplorerIcon
      class="w-5"
      :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
      :address="useGlobalStore().symbol.mint_asset.toString()"
    />
    <ExplorerIcon
      class="w-5"
      :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
      :address="useGlobalStore().symbol.mint_asset.toString()"
    />
    <ExplorerIcon
      class="w-5"
      :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)"
      :address="useGlobalStore().symbol.mint_asset.toString()"
    />
  </div>
</template>

<style scoped></style>
