<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useInsightsStore } from "../../stores/InsightsStore";
import { E_EXPLORER, EXPLORER } from "../../static/explorer";
import ExplorerIcon from "../../components/icon-helper/ExplorerIcon.vue";
import AssetDetailsAPIDataInfo from "./AssetDetails/AssetDetailsAPIDataInfo.vue";
import AssetDetailsAPIJson from "./AssetDetails/AssetDetailsAPIJson.vue";
import AssetDetailsGalleria from "./AssetDetails/AssetDetailsGalleria.vue";
import AccordionTab from "primevue/accordiontab";
import Accordion from "primevue/accordion";
import Avatar from "primevue/avatar";

const data = ref();

onMounted(async () => {
  const metaplex = Metaplex.make(new Connection(useGlobalStore().rpc.url));
  // const d = await metaplex.tokens().findMintByAddress({
  //   address: new PublicKey(useInsightsStore().selected?.mint ?? ""),
  // });
});
</script>

<template>
  <div v-if="useInsightsStore().selected" class="flex flex-col p-card">
    <div id="header" class="flex flex-row">
      <div class="flex flex-col m-2 space-y-3 w-full">
        <div class="flex flex-row items-center">
          <div class="flex flex-row w-full gap-2">
            <p class="text-6xl">
              {{ useInsightsStore().selected?.name }}
            </p>
            <Avatar
              :image="'webp/' + useInsightsStore().selected?.mint + '.webp'"
              shape="circle"
              size="xlarge"
            />
          </div>

          <div class="flex flex-row gap-2">
            <ExplorerIcon
              :address="useInsightsStore().selected?.mint"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
              class="w-9"
            />
            <ExplorerIcon
              :address="useInsightsStore().selected?.mint"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
              class="w-9"
            />
            <ExplorerIcon
              :address="useInsightsStore().selected?.mint"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)"
              class="w-9"
            />
          </div>
        </div>

        <Accordion>
          <AccordionTab header="Description">
            <p>{{ useInsightsStore().selected?.description }}</p>
          </AccordionTab>
        </Accordion>
      </div>
    </div>

    <div id="content" class="p-2 space-y-10">
      <AssetDetailsAPIDataInfo />
      <AssetDetailsAPIJson />
    </div>

    <div id="footer">
      <AssetDetailsGalleria />
    </div>
  </div>
</template>

<style scoped></style>