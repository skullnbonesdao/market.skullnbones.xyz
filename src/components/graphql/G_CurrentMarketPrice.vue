<script setup lang="ts">
import { gql } from "graphql-tag";

defineProps({
  symbol: {
    type: String,
    default: "FOODATLAS",
  },
});

const TRADE_QUERY = gql`
  query get_last_or_first($symbol: String!) {
    trades(
      where: { symbol: { _eq: $symbol } }
      limit: 1
      order_by: { timestamp: desc }
    ) {
      price
      timestamp
    }
  }
`;
</script>

<template>
  <ApolloQuery :query="TRADE_QUERY" :variables="{ symbol }">
    <template v-slot="{ result: { loading, error, data } }">
      <!-- Loading -->
      <div v-if="data" class="loading apollo">
        {{ data.trades[0].price ?? "0" }}
      </div>
      <div v-else>-</div>
    </template>
  </ApolloQuery>
</template>

<style scoped></style>
