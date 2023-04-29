<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import ExplorerIcon from "../icons_images/ExplorerIcon.vue";
import { useGlobalStore } from "../../../stores/GlobalStore";
</script>

<style scoped></style>
