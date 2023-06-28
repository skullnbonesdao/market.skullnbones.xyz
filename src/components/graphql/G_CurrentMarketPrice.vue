<script lang="ts" setup>
import { gql } from "graphql-tag";
import { ref } from "vue";

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

const symbol_local = ref("FOODATLAS");

symbol_local.value = props.symbol;

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
  <ApolloQuery :query="TRADE_QUERY" :variables="{ symbol: symbol_local }">
    <template v-slot="{ result: { loading, error, data } }">
      <div v-if="loading" class="loading apollo">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo">-</div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        {{
          decimals
            ? data?.trades[0]?.price?.toFixed(decimals) ?? 0.0
            : data?.trades[0]?.price
        }}
      </div>

      <!-- No result -->
      <div v-else class="no-result apollo">-</div>
    </template>
  </ApolloQuery>
</template>

<style scoped></style>