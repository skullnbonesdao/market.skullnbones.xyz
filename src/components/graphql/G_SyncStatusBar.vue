<template>
  <div>
    <ApolloQuery
      :query="
      (gql: any) => gql`
        query get_ranges {
    cursors(order_by: { start_block: desc }) {
      start_block
      end_block
      block
    }
  }
      `
    "
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
          <ProgressBar
            :value="parseFloat(calc_range_percentage(data?.cursors).toFixed(1))"
          ></ProgressBar>
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script setup lang="ts">
import { Connection } from "@solana/web3.js";
import gql from "graphql-tag";
import { onMounted, ref } from "vue";
import ProgressBar from "primevue/progressbar";
import { CURRENCIES } from "../../static/currencies";
import { useGlobalStore } from "../../stores/GlobalStore";
import NoData from "../elements/NoData.vue";

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

const current_block = ref(0);

const RANGES_QUERRY = gql`
  query get_ranges {
    cursors(order_by: { start_block: desc }) {
      start_block
      end_block
      block
    }
  }
`;

onMounted(async () => {
  current_block.value = await new Connection(
    useGlobalStore().rpc.url
  ).getSlot();
});

function calc_range_percentage(ranges: any[]) {
  if (ranges) {
    let total_range =
      current_block.value - ranges[ranges.length - 1]?.start_block;
    let sum_ranges = ranges
      ?.map((r: any) => {
        if (r.block) return r.block - r.start_block;
        else return 0;
      })
      .reduce((a: any, b: any) => a + b);
    console.log(sum_ranges);
    return (sum_ranges / total_range) * 100;
  }
}
</script>
