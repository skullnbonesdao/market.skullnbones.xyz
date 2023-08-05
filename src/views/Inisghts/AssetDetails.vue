<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useInsightsStore } from "../../stores/InsightsStore";
import AssetDetailsAPIDataInfo from "./AssetDetails/AssetDetailsAPIDataInfo.vue";
import AssetDetailsAPIJson from "./AssetDetails/AssetDetailsAPIJson.vue";
import AccordionTab from "primevue/accordiontab";
import Accordion from "primevue/accordion";
import Avatar from "primevue/avatar";
import AssetDetailsGalleria from "./AssetDetails/AssetDetailsGalleria.vue";
import AssetDetailsMarkets from "./AssetDetails/AssetDetailsMarkets.vue";
import CurrencyIcon from "../../components/icon-helper/CurrencyIcon.vue";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import G_CurrentMarketPrice from "../../components/graphql/G_CurrentMarketPrice.vue";
import { E_EXPLORER, EXPLORER } from "../../static/explorer";
import ExplorerIcon from "../../components/icon-helper/ExplorerIcon.vue";

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
    <div id="header" class="p-2">
      <div class="flex flex-col space-y-3 w-full">
        <div class="flex flex-col md:flex-row items-center">
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
          <div class="p-inputgroup">
            <div class="w-full"></div>
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

          <div class="p-inputgroup flex-1">
            <span class="p-inputgroup-addon w-24">
              <p>Price</p>
            </span>

            <p class="p-inputtext p-component p-inputwrapper text-right">
              <G_CurrentMarketPrice
                :symbol="useInsightsStore().selected?.symbol + 'ATLAS'"
              />
            </p>
            <span class="p-inputgroup-addon w-6">
              <CurrencyIcon
                :currency="
                  CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)
                "
              ></CurrencyIcon>
            </span>
            <p class="p-inputtext p-component p-inputwrapper text-right">
              <G_CurrentMarketPrice
                :symbol="useInsightsStore().selected?.symbol + 'USDC'"
              />
            </p>
            <span class="p-inputgroup-addon w-6">
              <CurrencyIcon
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              ></CurrencyIcon>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div id="content" class="p-2 space-y-10">
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