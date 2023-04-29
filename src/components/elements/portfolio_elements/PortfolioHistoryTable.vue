<template>
  <ApolloQuery
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
        <p class="w-full text-end text-orange-400">
          Limited to: last {{ limit }} trades
        </p>

        <NoData v-if="!data.trades.length" class="justify-center"></NoData>
        <DataTable
          v-else
          :value="data.trades"
          scrollable
          scrollHeight="800px"
          tableStyle="min-width: 50rem"
        >
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
          <Column field="mint" header="Mint">
            <template #body="slotProps">
              <div class="flex flex-row space-x-2 text-xs">
                <div class="flex flex-col">
                  <div>Token:</div>
                  <div>Asset:</div>
                </div>
                <div class="flex flex-col">
                  <div>{{ slotProps.data.currency_mint }}</div>

                  <div>{{ slotProps.data.asset_mint }}</div>
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
                      slotProps.data.asset_receiving_wallet ===
                      slotProps.data.order_initializer
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{ slotProps.data.order_initializer }}
                  </div>
                  <div
                    :class="
                      slotProps.data.asset_receiving_wallet ===
                      slotProps.data.order_taker
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{ slotProps.data.order_taker }}
                  </div>
                </div>
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
                  style="height: 24px"
                  :currency="
                    CURRENCIES.find(
                      (c) => c.mint === slotProps.data.currency_mint
                    )
                  "
                />
                <span>{{ slotProps.data.price }}</span>
              </div>
            </template>
          </Column>
          <Column field="total.value" header="Total" sortable>
            <template #body="slotProps">
              <div class="flex gap-2">
                <CurrencyIcon
                  style="height: 24px"
                  :currency="
                    CURRENCIES.find(
                      (c) => c.mint === slotProps.data.currency_mint
                    )
                  "
                />
                <span>{{ slotProps.data.total_cost.toFixed(2) }}</span>
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
                  :signature="slotProps.data.signature"
                />
                <ExplorerIcon
                  class="w-5"
                  :explorer="
                    EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                  "
                  :signature="slotProps.data.signature"
                />
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

<script setup lang="ts">
import { CURRENCIES } from "../../../static/currencies";
import { calc_passed_time } from "../../../static/formatting/calc_passed_time";
import PairImage from "../PairImage.vue";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import NoData from "../NoData.vue";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import ExplorerIcon from "../icons_images/ExplorerIcon.vue";
import { calc_percentage_for_fee } from "../../../static/formatting/calc_percentage";

const props = defineProps({
  user_wallet: {
    type: String,
    default: "NPC",
  },
  limit: {
    type: Number,
    default: 10,
  },
});
</script>
<style scoped></style>