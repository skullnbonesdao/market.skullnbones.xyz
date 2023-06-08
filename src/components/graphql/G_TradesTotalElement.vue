<template>
  <div>
    <ApolloQuery
      :query="
        (gql:any) => gql`
          query MyQuery($currency_mint: String!, $wallet_address: String!) {
            trades_aggregate(
              where: {
                _and: [
                  { currency_mint: { _eq: $currency_mint } }
                  {
                    _or: [
                      { order_initializer: { _eq: $wallet_address } }
                      { order_taker: { _eq: $wallet_address } }
                    ]
                  }
                ]
              }
            ) {
              aggregate {
                count
              }
            }
          }
        `
      "
      :variables="{ currency_mint, wallet_address }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="data" class="loading apollo">
          {{ data.trades_aggregate?.aggregate?.count ?? "0" }}
        </div>
        <div v-else>-</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script setup lang="ts">
import { CURRENCIES } from "../../static/currencies";

const props = defineProps({
  currency_mint: {
    type: String,
    default: CURRENCIES[1].mint.toString(),
  },
  wallet_address: {
    type: String,
    default: "NPCxfjPxh6pvRJbGbWZjxfkqWfGBvKkqPbtiJar3mom",
  },
  decimals: {
    type: Number,
    default: 2,
  },
});
</script>
