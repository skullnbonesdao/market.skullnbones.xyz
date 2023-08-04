<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useInsightsStore } from "../../stores/InsightsStore";
import { E_EXPLORER, EXPLORER } from "../../static/explorer";
import ExplorerIcon from "../../components/icon-helper/ExplorerIcon.vue";
import AssetDetailsAPIDataInfo from "./AssetDetails/AssetDetailsAPIDataInfo.vue";
import AssetDetailsAPIJson from "./AssetDetails/AssetDetailsAPIJson.vue";
import AccordionTab from "primevue/accordiontab";
import Accordion from "primevue/accordion";
import Avatar from "primevue/avatar";
import AssetDetailsGalleria from "./AssetDetails/AssetDetailsGalleria.vue";
import AssetDetailsMarkets from "./AssetDetails/AssetDetailsMarkets.vue";

const data = ref();
const token_supply = ref();
onMounted(async () => {
  const metaplex = Metaplex.make(new Connection(useGlobalStore().rpc.url));
  // const d = await metaplex.tokens().findMintByAddress({
  //   address: new PublicKey(useInsightsStore().selected?.mint ?? ""),
  // });
});

watch(
  () => useInsightsStore().selected?.mint,
  async () => {
    useGlobalStore()
      .connection.getTokenSupply(
        new PublicKey(useInsightsStore().selected?.mint ?? "")
      )
      .then((resp) => (token_supply.value = resp.value.uiAmount));
  }
);
</script>

<template>
  <div
    v-if="useInsightsStore().selected"
    class="flex flex-col p-card background"
  >
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

          <!--          <div class="flex flex-row gap-2">-->
          <!--            <ExplorerIcon-->
          <!--              :address="useInsightsStore().selected?.mint"-->
          <!--              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"-->
          <!--              class="w-9"-->
          <!--            />-->
          <!--            <ExplorerIcon-->
          <!--              :address="useInsightsStore().selected?.mint"-->
          <!--              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"-->
          <!--              class="w-9"-->
          <!--            />-->
          <!--            <ExplorerIcon-->
          <!--              :address="useInsightsStore().selected?.mint"-->
          <!--              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)"-->
          <!--              class="w-9"-->
          <!--            />-->
          <!--          </div>-->
        </div>

        <div class="flex flex-col gap-1">
          <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon w-24">
              <p>Symbol</p>
            </span>
            <p class="p-inputtext p-component p-inputwrapper">
              {{ useInsightsStore().selected?.symbol }}
            </p>
          </div>

          <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon w-24">
              <p>Mint</p>
            </span>
            <p class="p-inputtext p-component p-inputwrapper">
              {{ useInsightsStore().selected?.mint }}
            </p>
            <Button>
              <ExplorerIcon
                :address="useInsightsStore().selected?.mint"
                :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
                class="w-6"
              />
            </Button>
            <Button>
              <ExplorerIcon
                :address="useInsightsStore().selected?.mint"
                :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
                class="w-6"
              />
            </Button>
            <Button>
              <ExplorerIcon
                :address="useInsightsStore().selected?.mint"
                :explorer="
                  EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)
                "
                class="w-6"
              />
            </Button>
          </div>

          <!--          <div class="p-inputgroup flex-1">-->
          <!--            <span class="p-inputgroup-addon w-24">-->
          <!--              <p>Created</p>-->
          <!--            </span>-->
          <!--            <p class="p-inputtext p-component p-inputwrapper">-->
          <!--              {{ useInsightsStore().selected?.createdAt }}-->
          <!--            </p>-->
          <!--          </div>-->

          <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon w-24">
              <p>Supply</p>
            </span>
            <p class="p-inputtext p-component p-inputwrapper">
              {{ token_supply }}
            </p>
          </div>
        </div>

        <Accordion :activeIndex="0">
          <AccordionTab header="Description">
            <p>{{ useInsightsStore().selected?.description }}</p>
          </AccordionTab>
        </Accordion>
        <Accordion :activeIndex="0">
          <AccordionTab header="Markets">
            <AssetDetailsMarkets />
          </AccordionTab>
        </Accordion>
      </div>
    </div>

    <div id="content" class="p-2 space-y-10">
      <AssetDetailsAPIDataInfo />

      <Accordion>
        <AccordionTab header="Galleria">
          <AssetDetailsGalleria />
        </AccordionTab>
      </Accordion>

      <AssetDetailsAPIJson />
    </div>

    <div id="footer"></div>
  </div>
</template>