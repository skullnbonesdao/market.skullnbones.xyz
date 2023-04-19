<template>
  <div class="space-y-2">
    <SearchHelperExplorer
      @toSearch="(value) => (search_input_object = value.api_search)"
    />
    <div class="p-card p-2">
      <div class="flex w-full">
        <ProgressSpinner v-if="is_loading" class="flex justify-center" />
      </div>

      <NoData
        v-if="table_data.length === 0 && !is_loading"
        class="flex justify-center"
      ></NoData>
      <div v-if="table_data.length != 0 && !is_loading" class="">
        <DataTable
          resizableColumns
          columnResizeMode="expand"
          style="width: 100%"
          :value="table_data"
          scrollHeight="800px"
        >
          <Column field="pair" header="Pair">
            <template #body="slotProps">
              <div class="flex">
                <PairImage
                  :asset_image_url="slotProps.data.pair.asset_image_url"
                  :currency="
                    CURRENCIES.find(
                      (c) => c.mint === slotProps.data.pair.currency_mint
                    )
                  "
                />
              </div>
            </template>
          </Column>
          <Column field="info" header="Info">
            <template #body="slotProps">
              <div class="">
                <div class="flex text-xs">
                  {{
                    new Date(slotProps.data.info.timestamp * 1000).toISOString()
                  }}
                </div>
                <div class="text-purple-500 text-xs">
                  <p class="">Before: {{ slotProps.data.info.before }}</p>
                </div>

                <div class="flex text-xs">
                  <p>
                    {{ slotProps.data.info.signature.slice(0, 10) }}[...]{{
                      slotProps.data.info.signature.slice(-10)
                    }}
                  </p>
                </div>
              </div>
            </template>
          </Column>
          <Column field="mint" header="Mint">
            <template #body="slotProps">
              <div class="flex flex-row space-x-2 text-xs">
                <div class="flex flex-col">
                  <div>Token:</div>
                  <div>Asset:</div>
                </div>
                <div class="flex flex-col">
                  <div>{{ slotProps.data.mint.token }}</div>

                  <div>{{ slotProps.data.mint.asset }}</div>
                </div>
              </div>
            </template>
          </Column>
          <Column field="wallets" header="Wallets">
            <template #body="slotProps">
              <div class="flex flex-row space-x-2 text-xs">
                <div class="flex flex-col">
                  <div>Maker:</div>
                  <div>Taker:</div>
                </div>
                <div class="flex flex-col">
                  <div
                    :class="
                      slotProps.data.wallets.reviver ===
                      slotProps.data.wallets.maker
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{ slotProps.data.wallets.maker }}
                  </div>
                  <div
                    :class="
                      slotProps.data.wallets.reviver ===
                      slotProps.data.wallets.taker
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{ slotProps.data.wallets.taker }}
                  </div>
                </div>
              </div>
            </template>
          </Column>

          <Column field="fee" header="Fee"> </Column>

          <Column field="size" header="Size">
            <template #body="slotProps">
              <div class="flex float-right gap-2">
                <span>x{{ slotProps.data.size }}</span>
              </div>
            </template>
          </Column>
          <Column field="price" header="Price">
            <template #body="slotProps">
              <div class="flex float-right gap-2">
                <img
                  alt="flag"
                  :src="
                    CURRENCIES.find((c) => c.mint === slotProps.data.price.mint)
                      ?.image_path ?? ''
                  "
                  :class="`flag flag-${slotProps.data.price.value}`"
                  style="width: 24px"
                />
                <span>{{ slotProps.data.price.value }}</span>
              </div>
            </template>
          </Column>

          <Column field="total" header="Total" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex float-right gap-2">
                <img
                  alt="flag"
                  :src="
                    CURRENCIES.find((c) => c.mint === slotProps.data.total.mint)
                      ?.image_path
                  "
                  :class="`flag flag-${slotProps.data.total.value}`"
                  style="width: 24px"
                />
                <span>{{ slotProps.data.total.value }}</span>
              </div>
            </template>
          </Column>

          <Column field="explorer" header="Explorer" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex flex-row justify-center items-center space-x-2">
                <ExplorerIcon
                  class="w-5"
                  :explorer="
                    EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                  "
                  :signature="slotProps.data.explorer.signature"
                />
                <ExplorerIcon
                  class="w-5"
                  :explorer="
                    EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                  "
                  :signature="slotProps.data.explorer.signature"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import SearchHelperExplorer from "../elements/SearchHelperExplorer.vue";
import {
  Api,
  Trade,
} from "../../static/swagger/skullnbones_api/skullnbones_api";
import { onMounted, ref, watch } from "vue";
import { CURRENCIES } from "../../static/currencies";
import PairImage from "../elements/PairImage.vue";
import { calc_passed_time } from "../../static/formatting/calc_passed_time";
import ExplorerIcon from "../elements/icons_images/ExplorerIcon.vue";
import { E_EXPLORER, EXPLORER } from "../../static/explorer";
import { SEARCH_TYPE } from "../../static/search_types_api";
import NoData from "../elements/NoData.vue";

let search_input_object = ref({
  type: SEARCH_TYPE.SYMBOL,
  value: "PX4USDC",
});

let is_loading = ref(true);
let table_data = ref([]);

watch(
  () => search_input_object.value,
  () => fetch_api_data()
);

onMounted(async () => {
  await fetch_api_data();
});

async function fetch_api_data() {
  is_loading.value = true;

  const api = new Api({
    baseUrl: "https://api2.skullnbones.xyz",
  });

  let fetched_trades: Trade[] = [];
  table_data.value = [];

  switch (search_input_object.value.type) {
    case SEARCH_TYPE.SYMBOL:
      await api.trades
        .getSymbol({ symbol: search_input_object.value.value, limit: 100 })
        .then((resp) => (fetched_trades = resp.data));
      break;
    case SEARCH_TYPE.SIGNATURE:
      await api.trades
        .getSignature({
          signature: search_input_object.value.value,
          limit: 100,
        })
        .then((resp) => (fetched_trades = resp.data));
      break;
    case SEARCH_TYPE.ADDRESS:
      await api.trades
        .getAddress({
          address: search_input_object.value.value,
          limit: 100,
        })
        .then((resp) => (fetched_trades = resp.data));
      break;
    case SEARCH_TYPE.MINT:
      await api.trades
        .getMint({
          asset_mint: search_input_object.value.value,
          limit: 100,
        })
        .then((resp) => (fetched_trades = resp.data));
      break;
  }

  if (fetched_trades.length > 0) {
    fetched_trades?.forEach((trade, idx) => {
      table_data.value.push({
        id: idx,
        pair: {
          symbol: trade.symbol,
          asset_image_url: "/public/webp/" + trade.asset_mint + ".webp",
          currency_mint: trade.currency_mint,
        },
        info: {
          timestamp: trade.timestamp,
          before: calc_passed_time(trade.timestamp),
          signature: trade.signature,
        },
        mint: {
          asset: trade.asset_mint,
          token: trade.currency_mint,
        },
        wallets: {
          maker: trade.order_initializer,
          taker: trade.order_taker,
          reviver: trade.asset_receiving_wallet,
        },
        fee:
          (
            (trade.market_fee / (trade.asset_change * trade.price)) *
            100
          ).toFixed(1) + "%",
        size: trade.asset_change,

        price: {
          value: trade.price,
          mint: trade.currency_mint,
        },
        total: {
          value: (trade.price * trade.asset_change).toFixed(2),
          mint: trade.currency_mint,
        },
        explorer: {
          signature: trade.signature,
        },
      } as never);
    });
  }

  is_loading.value = false;
  //console.log(fetched_trades);
}
</script>

<style scoped></style>
