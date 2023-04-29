<template>
  <ApolloQuery
    :query="
      (gql) => gql`
        query wallet_history(
          $user_wallet: String!
          $atlas_mint: String!
          $usdc_mint: String!
          $limit: Int!
        ) {
          atlas: trades(
            limit: $limit
            order_by: { block: desc }
            where: {
              _and: [
                { currency_mint: { _eq: $atlas_mint } }
                {
                  _or: [
                    { order_initializer: { _eq: $user_wallet } }
                    { order_taker: { _eq: $user_wallet } }
                  ]
                }
              ]
            }
          ) {
            label: timestamp_ts
            data: total_cost
          }
          usdc: trades(
            limit: $limit
            order_by: { block: desc }
            where: {
              _and: [
                { currency_mint: { _eq: $usdc_mint } }
                {
                  _or: [
                    { order_initializer: { _eq: $user_wallet } }
                    { order_taker: { _eq: $user_wallet } }
                  ]
                }
              ]
            }
          ) {
            label: timestamp_ts
            data: total_cost
          }
        }
      `
    "
    :variables="{ limit, user_wallet, atlas_mint, usdc_mint }"
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
        <p class="w-full text-end text-orange-400">
          Limited to: last {{ limit }} trades
        </p>

        <Chart
          type="line"
          :data="map_history_chart(data).data"
          :options="chart_options"
          class="h-30rem"
        />
      </div>
    </template>
  </ApolloQuery>
</template>

<script lang="js">
export default {
    name: "PortfolioHistoryChart",
};

import * as g2c from "graphql2chartjs";
import {useGlobalStore} from "../../../stores/GlobalStore";
import {defineProps} from 'vue'

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

const chart_options = {
  maintainAspectRatio: false,

  aspectRatio: 0.6,
  title: {
    display: true,
    fontColor: "blue",
    text: "Volume History",
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      fontColor: "orange",
    },
  },
  scales: {
    x: {
      type: "time",
    },
    y: {
      title: {
        position: "left",
        display: true,
        text: "ATLAS",
      },
    },
    y1: {
      position: "right",
      title: {
        display: true,
        text: "USDC",
      },
    },
  },
};

function map_history_chart(data) {
  return new g2c.graphql2chartjs(data, (dataSetName, dataPoint) => {
    console.log(dataSetName);
    if (dataSetName === "usdc") {
      return {
        ...dataPoint,
        chartType: "line",
        lineTension: 0.4,
        radius: 4,
        borderWidth: 0,
        borderColor: "#4d8aff",
        pointBackgroundColor: "#55bae7",
      };
    }
    if (dataSetName === "atlas") {
      return {
        ...dataPoint,
        chartType: "line",
        lineTension: 0,
        radius: 4,
        borderWidth: 0,
        borderColor: useGlobalStore().is_dark ? "#FFF" : "#000",
        pointBackgroundColor: useGlobalStore().is_dark ? "#a9a9a9" : "#1e1e1e",
      };
    }
  });
}
</script>
