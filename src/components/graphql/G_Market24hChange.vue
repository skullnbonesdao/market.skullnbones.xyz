<script lang="ts" setup>
import { gql } from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";

const TRADE_QUERY_NEW = gql`
  query query_new($symbol: String!) {
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

const props = defineProps({
  symbol: {
    type: String,
    default: "FOODATLAS",
  },
  // before: {
  //   type: String,
  //   default: "FOODATLAS",
  // },
});

const TRADE_QUERY_OLD = gql`
  query query_old($symbol: String!, $before: bigint!) {
    trades(
      where: { symbol: { _eq: $symbol }, timestamp: { _lt: $before } }
      limit: 1
      order_by: { timestamp: desc }
    ) {
      price
      timestamp
    }
  }
`;

const symbol = props.symbol;
const before = (Date.now() / 1000 - 60 * 60 * 24).toFixed(0);

const price_now = computed(() => {
  const { result, loading, error } = useQuery<any>(TRADE_QUERY_NEW, {
    symbol,
  });
  return result.value;
});

const price_24h = computed(() => {
  console.log(before);
  const { result, loading, error } = useQuery<any>(TRADE_QUERY_OLD, {
    symbol,
    before,
  });
  return result.value;
});

const percentage_change = computed(() => {
  return (
    ((price_now.value?.trades[0].price - price_24h.value?.trades[0].price) /
      price_24h.value?.trades[0].price) *
    100
  );
});

// export default {
//   setup() {
//
//
//     return {
//       price_now,
//       price_24h,
//       percentage_change,
//     };
//   },
// };
</script>

<template>
  <div
    v-tooltip.bottom="'24h price change'"
    :class="
      percentage_change == 0
        ? 'text-yellow-500'
        : percentage_change > 0
        ? 'text-green-500'
        : 'text-red-500'
    "
    class="flex flex-row items-baseline justify-end"
  >
    <p v-if="isNaN(percentage_change)" class="text-yellow-500">0.0</p>
    <p v-else-if="percentage_change">
      {{ percentage_change?.toFixed(2) }}
    </p>
    <p v-else>0.0</p>
    <p v-if="isNaN(percentage_change)" class="text-xs text-yellow-500">%</p>
    <p v-else class="text-xs">%</p>
  </div>

  <!--  <ApolloQuery :query="TRADE_QUERY_NEW" :variables="{ symbol }">-->
  <!--    <template v-slot="{ result: { loading, error, data } }">-->
  <!--      &lt;!&ndash; Loading &ndash;&gt;-->
  <!--      <div v-if="data" class="loading apollo">-->
  <!--        {{ data }}-->
  <!--      </div>-->
  <!--      <div v-else>-</div>-->
  <!--    </template>-->
  <!--  </ApolloQuery>-->
</template>

<style scoped></style>