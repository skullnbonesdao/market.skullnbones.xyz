<template>
  <ApolloQuery
    :query="
      (gql: any) => gql`
        query wallet_history($user_wallet: String!, $atlas_mint: String!, $limit: Int!) {
          usdc: trades(
            limit: $limit
            order_by: { block: desc }
            where: {
            _and: [{ currency_mint : {_eq : $atlas_mint }},{
                    _or: [{ order_initializer: { _eq: $user_wallet }
                    },{ order_taker: { _eq: $user_wallet }
            }]}]}
          ) {
                label: timestamp
                data: total_cost
         }
         atlas: trades(
            limit: $limit
            order_by: { block: desc }
            where: {
            _and: [{ currency_mint : {_eq : $atlas_mint }},{
                    _or: [{ order_initializer: { _eq: $user_wallet }
                    },{ order_taker: { _eq: $user_wallet }
            }]}]}
          ) {
                label: timestamp
                data: total_cost
         }}
      `
    "
    :variables="{ limit, user_wallet, atlas_mint }"
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
        {{ data.usdc }}
        {{ new graphql2chartjs(data.trades, "line").data }}
        <Chart type="line" :data="new graphql2chartjs(data, 'bar').data" />
      </div>
    </template>
  </ApolloQuery>
</template>

<script setup lang="ts">
import NoData from "../NoData.vue";
import graphql2chartjs from "graphql2chartjs";
import Chart from "primevue/chart";

const props = defineProps({
  user_wallet: {
    type: String,
    default: "NPC",
  },
  atlas_mint: {
    type: String,
    default: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
  },
  usdc_mint: {
    type: String,
    default: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  limit: {
    type: Number,
    default: 10000,
  },
});
</script>
<script setup lang="ts"></script>
