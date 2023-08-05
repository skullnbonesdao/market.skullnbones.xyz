<script lang="ts" setup>
import { gql } from "graphql-tag";
import { useGlobalStore } from "../../stores/GlobalStore";

const props = defineProps({
  symbol: {
    type: String,
    default: "FOODATLAS",
    required: true,
  },
  decimals: {
    type: Number,
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
  <ApolloQuery
    :poll-interval="useGlobalStore().pollInterval"
    :query="TRADE_QUERY"
    :variables="{ symbol: props.symbol }"
  >
    <template v-slot="{ result: { loading, error, data } }">
      <div v-if="loading" class="loading apollo">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo">-</div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        {{
          decimals
            ? data?.trades[0]?.price?.toFixed(decimals) ?? "-"
            : data?.trades[0]?.price ?? 0.0
        }}
      </div>

      <!-- No result -->
      <div v-else class="no-result apollo">-</div>
    </template>
  </ApolloQuery>
</template>

<style scoped></style>