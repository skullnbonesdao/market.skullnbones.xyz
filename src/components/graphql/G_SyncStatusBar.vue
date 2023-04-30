<template>
  <div class="p-inputgroup flex-1">
    <span class="p-inputgroup-addon text-sm basis-1/5">Sync-Status</span>
    <div class="flex w-full p-inputgroup-addon">
      <ApolloQuery
        class="w-full"
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
          <div v-if="loading" class="loading apollo">
            <ProgressSpinner />
          </div>
          <!-- Error -->
          <div v-else-if="error" class="error apollo">
            <NoData class="justify-center"></NoData>
          </div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo flex">
            <ProgressBar
              class="w-full"
              :value="
                parseFloat(
                  calc_range_percentage(data?.cursors)?.toFixed(1) ?? '0'
                )
              "
            ></ProgressBar>
          </div>
        </template>
      </ApolloQuery>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Connection } from "@solana/web3.js";
import gql from "graphql-tag";
import { onMounted, ref } from "vue";
import { CURRENCIES } from "../../static/currencies";
import { useGlobalStore } from "../../stores/GlobalStore";
import NoData from "../elements/NoData.vue";
import ProgressBar from "primevue/progressbar";

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
