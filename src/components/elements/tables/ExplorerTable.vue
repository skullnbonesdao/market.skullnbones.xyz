<script lang="ts" setup>
import { CURRENCIES } from "../../../static/currencies";
import { calc_passed_time } from "../../../static/formatting/calc_passed_time";
import PairImage from "../PairImage.vue";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import NoData from "../NoData.vue";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import { calc_percentage_for_fee } from "../../../static/formatting/calc_percentage";
import ExplorerIcon from "../../icon-helper/ExplorerIcon.vue";
import Dropdown from "primevue/dropdown";
import { useGlobalStore } from "../../../stores/GlobalStore";
import { format_address } from "../../../static/formatting/format_address";
import SinglePriceTemplate from "../templates/SinglePriceTemplate.vue";
import { ref } from "vue";

const props = defineProps({
  search_string: {
    type: String,
    default: "PX4",
  },
  limit: {
    type: Number,
    default: 0,
  },
});

defineEmits(["search_string"]);

const selectedCity = ref();
const cities = ref([
  { name: "1s", code: 1000 },
  { name: "3s", code: 3000 },
  { name: "10s", code: 10000 },
  { name: "60s", code: 60000 },
]);
</script>

<template>
  <ApolloQuery
    :poll-interval="useGlobalStore().pollInterval"
    :query="search_string ?
      (gql: any) => gql`
        query find_symbol_history($search_string: String!, $limit: Int!) {
          trades(
            limit: $limit
            order_by: { block: desc }
            where: {
            _or: [
                    { symbol: { _eq: $search_string }},
                    { asset_mint: { _eq: $search_string }},
                    { currency_mint: { _eq: $search_string }},
                    { order_initializer: { _eq: $search_string }},
                    { order_taker: { _eq: $search_string }}

                 ]}
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
      ` : (gql: any) => gql`
        query find_symbol_history($limit: Int!) {
          trades(
            limit: $limit
            order_by: { block: desc }
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
    :variables="{ limit, search_string }"
    class="p-card"
  >
    <template v-slot="{ result: { loading, error, data } }">
      <!-- Loading -->
      <div v-if="loading" class="loading apollo flex">
        <ProgressSpinner />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo flex">
        <NoData class="justify-center"></NoData>
      </div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        <NoData v-if="!data.trades.length" class="justify-center"></NoData>
        <DataTable
          v-else
          :sort-order="-1"
          :value="data.trades"
          sort-field="timestamp"
          tableStyle="min-width: 50rem"
        >
          <template #header>
            <div class="w-full flex justify-end">
              <Dropdown
                v-model="useGlobalStore().pollInterval"
                :options="cities"
                option-value="code"
                optionLabel="name"
                placeholder="Select a City"
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
                <p
                  class="text-sm hover:animate-pulse hover:underline"
                  @click="$emit('search_string', slotProps.data.symbol)"
                >
                  {{ slotProps.data.symbol }}
                </p>
              </div>
            </template>
          </Column>

          <Column header="Info" sort-field="timestamp" sortable>
            <template #body="slotProps">
              <div class="flex flex-col p-2 p-inputtext text-xs">
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
              </div>
            </template>
          </Column>
          <Column field="mint" header="Mint">
            <template #body="slotProps">
              <div class="flex flex-row gap-2 p-2 p-inputtext text-xs">
                <div class="flex flex-col text-xs">
                  <p>Token:</p>
                  <p>Asset:</p>
                </div>
                <div class="flex flex-col text-xs">
                  <p
                    class="hover:animate-pulse hover:underline"
                    @click="
                      $emit('search_string', slotProps.data.currency_mint)
                    "
                  >
                    {{ format_address(slotProps.data.currency_mint) }}
                  </p>

                  <p
                    class="hover:animate-pulse hover:underline"
                    @click="$emit('search_string', slotProps.data.asset_mint)"
                  >
                    {{ format_address(slotProps.data.asset_mint) }}
                  </p>
                </div>
              </div>
            </template>
          </Column>
          <Column field="wallets" header="Wallets">
            <template #body="slotProps">
              <div
                :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
                class="flex flex-row space-x-2 p-2 p-inputtext"
              >
                <div class="flex flex-col text-xs">
                  <div>Maker:</div>
                  <div>Taker:</div>
                </div>
                <div class="flex flex-col text-xs">
                  <div
                    :class="
                      slotProps.data.asset_receiving_wallet ===
                      slotProps.data.order_initializer
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                    class="hover:animate-pulse hover:underline"
                    @click="
                      $emit('search_string', slotProps.data.order_initializer)
                    "
                  >
                    {{ format_address(slotProps.data.order_initializer) }}
                  </div>
                  <div
                    :class="
                      slotProps.data.asset_receiving_wallet ===
                      slotProps.data.order_taker
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                    class="hover:animate-pulse hover:underline"
                    @click="$emit('search_string', slotProps.data.order_taker)"
                  >
                    {{ format_address(slotProps.data.order_taker) }}
                  </div>
                </div>
              </div>
            </template>
          </Column>
          <Column field="market_fee" header="Fee" sortable>
            <template #body="slotProps">
              <span class="p-2 rounded-lg p-inputtext text-xs"
                >{{
                  calc_percentage_for_fee(
                    slotProps.data.market_fee,
                    slotProps.data.total_cost
                  ).toFixed(1)
                }}%</span
              >
            </template>
          </Column>
          <Column field="size" header="Size" sortable>
            <template #body="slotProps">
              <div class="p-2 rounded-lg p-inputtext">
                <span>{{ slotProps.data.asset_change }}</span>
              </div>
            </template>
          </Column>
          <Column field="price.value" header="Price" sortable>
            <template #body="slotProps">
              <SinglePriceTemplate
                :currency="
                  CURRENCIES.find(
                    (c) => c.mint === slotProps.data.currency_mint
                  )
                "
                :price="slotProps.data.price"
              />
            </template>
          </Column>
          <Column field="total.value" header="Total" sortable>
            <template #body="slotProps">
              <SinglePriceTemplate
                :currency="
                  CURRENCIES.find(
                    (c) => c.mint === slotProps.data.currency_mint
                  )
                "
                :price="slotProps.data.total_cost.toFixed(2)"
              />
            </template>
          </Column>
          <Column field="explorer" header="Explorer" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex flex-row justify-center items-center space-x-2">
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
                <ExplorerIcon
                  :address="slotProps.data.asset_mint"
                  :explorer="
                    EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)
                  "
                  class="w-5"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- No result -->
      <div v-else class="error apollo flex">
        <NoData class="justify-center" text="No Result :/"></NoData>
      </div>
    </template>
  </ApolloQuery>
</template>

<style scoped></style>