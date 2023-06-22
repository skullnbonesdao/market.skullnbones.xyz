<script lang="ts" setup>
import { CURRENCIES } from "../../../static/currencies";
import { calc_passed_time } from "../../../static/formatting/calc_passed_time";
import PairImage from "../PairImage.vue";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import NoData from "../NoData.vue";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import { calc_percentage_for_fee } from "../../../static/formatting/calc_percentage";
import ExplorerIcon from "../../icon-helper/ExplorerIcon.vue";
import download from "downloadjs";
import { useUserWalletStore } from "../../../stores/UserWalletStore";
import { useGlobalStore } from "../../../stores/GlobalStore";

const props = defineProps({
  user_wallet: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    default: 1000000,
  },
});

function export_json(table_data: {}) {
  download(
    JSON.stringify(table_data, null, 4),
    "trades_" + useUserWalletStore().address + ".json",
    "application/json"
  );
}
</script>

<template>
  <ApolloQuery
    :poll-interval="useGlobalStore().pollInterval"
    :query="
      (gql: any) => gql`
        query wallet_history($user_wallet: String!, $limit: Int!) {
          trades(
            limit: $limit
            order_by: { block: desc }
            where: {
            _or: [{
            order_initializer: { _eq: $user_wallet }
            },{
            order_taker: { _eq: $user_wallet }
            }]}
          ) {
            timestamp
            signature
            symbol
            asset_mint
            currency_mint
            order_initializer
            order_taker
            asset_receiving_wallet
            market_fee
            asset_change
            price
            total_cost
          }
        }
      `
    "
    :variables="{ limit, user_wallet }"
  >
    <template v-slot="{ result: { loading, error, data } }">
      <!-- Loading -->
      <div v-if="loading" class="loading apollo p-card flex">
        <ProgressSpinner />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo p-card flex">
        <NoData class="justify-center"></NoData>
      </div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo p-card">
        <NoData v-if="!data.trades.length" class="justify-center"></NoData>
        <DataTable
          v-else
          :value="data.trades"
          scrollHeight="800px"
          scrollable
          tableStyle="min-width: 50rem"
        >
          <template #footer>
            <div class="flex flex-row w-full items-center">
              <p class="w-full text-sm text-orange-400">
                Limited to: last {{ limit }} trades
              </p>

              <Button
                icon="pi pi-external-link"
                label="Export"
                @click="export_json(data.trades)"
              />
            </div>
          </template>
          <Column header="Pair">
            <template #body="slotProps">
              <div class="flex flex-col items-center">
                <PairImage
                  :asset_image_url="
                    '/webp/' + slotProps.data.asset_mint + '.webp'
                  "
                  :currency="
                    CURRENCIES.find(
                      (c) => c.mint === slotProps.data.currency_mint
                    ) ?? CURRENCIES[0]
                  "
                />
                <p class="text-sm">{{ slotProps.data.symbol }}</p>
              </div>
            </template>
          </Column>

          <Column header="Info">
            <template #body="slotProps">
              <div class="flex text-xs">
                {{ new Date(slotProps.data.timestamp * 1000).toISOString() }}
              </div>
              <div class="text-purple-500 text-xs">
                <p class="">
                  Before: {{ calc_passed_time(slotProps.data.timestamp) }}
                </p>
              </div>

              <div class="flex text-xs">
                <p>
                  {{ slotProps.data.signature.slice(0, 10) }}[...]{{
                    slotProps.data.signature.slice(-10)
                  }}
                </p>
              </div>
            </template>
          </Column>

          <Column field="explorer" header="Explorer" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex flex-row items-center space-x-2">
                <ExplorerIcon
                  :explorer="
                    EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                  "
                  :signature="slotProps.data.signature"
                  class="w-5"
                />
                <ExplorerIcon
                  :explorer="
                    EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                  "
                  :signature="slotProps.data.signature"
                  class="w-5"
                />
              </div>
            </template>
          </Column>

          <Column field="wallets" header="Side">
            <template #body="slotProps">
              <div
                :class="
                  slotProps.data.asset_receiving_wallet ===
                  useUserWalletStore().address?.toString()
                    ? 'text-green-500'
                    : 'text-red-500'
                "
              >
                {{
                  slotProps.data.asset_receiving_wallet ===
                  useUserWalletStore().address?.toString()
                    ? "BUY"
                    : "SELL"
                }}
              </div>
            </template>
          </Column>
          <Column field="market_fee" header="Fee" sortable>
            <template #body="slotProps">
              <span
                >{{
                  calc_percentage_for_fee(
                    slotProps.data.market_fee,
                    slotProps.data.total_cost
                  ).toFixed(1)
                }}%</span
              ></template
            >
          </Column>
          <Column field="size" header="Size" sortable>
            <template #body="slotProps">
              <div class="flex gap-2">
                <span>x{{ slotProps.data.asset_change }}</span>
              </div>
            </template>
          </Column>
          <Column field="price.value" header="Price" sortable>
            <template #body="slotProps">
              <div class="flex gap-2">
                <CurrencyIcon
                  :currency="
                    CURRENCIES.find(
                      (c) => c.mint === slotProps.data.currency_mint
                    )
                  "
                  style="height: 24px"
                />
                <span>{{ slotProps.data.price }}</span>
              </div>
            </template>
          </Column>
          <Column field="total.value" header="Total" sortable>
            <template #body="slotProps">
              <div class="flex gap-2">
                <CurrencyIcon
                  :currency="
                    CURRENCIES.find(
                      (c) => c.mint === slotProps.data.currency_mint
                    )
                  "
                  style="height: 24px"
                />
                <span>{{ slotProps.data.total_cost.toFixed(2) }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- No result -->
      <div v-else class="error apollo p-card flex">
        <NoData class="justify-center" text="No Result :/"></NoData>
      </div>
    </template>
  </ApolloQuery>
</template>

<style scoped></style>