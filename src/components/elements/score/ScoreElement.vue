<template>
  <div class="flex flex-col">
    <DataTable :value="table_data" tableStyle="min-width: 50rem">
      <Column field="shipMint" header="Name">
        <template #body="slotPros">
          <p>
            {{
              useGlobalStore().sa_api_data.find(
                (api) =>
                  api.mint ===
                  slotPros.data.shipStatkingInfo.shipMint.toString()
              )?.name
            }}
          </p>
        </template>
      </Column>
      <Column
        field="shipStatkingInfo.shipQuantityInEscrow"
        header="Count"
      ></Column>
      <Column header="Food">
        <template #body="slotProps">
          <p v-if="slotProps.data.parsed.food_remaining_time > 0">
            {{ slotProps.data.parsed.food_remaining_time.toFixed(2) }}
          </p>
          <p v-else>EMPTY</p>
        </template>
      </Column>
      <Column header="Fuel">
        <template #body="slotProps">
          <p v-if="slotProps.data.parsed.fuel_remaining_time > 0">
            {{ slotProps.data.parsed.fuel_remaining_time.toFixed(2) }}
          </p>
          <p v-else>EMPTY</p>
        </template>
      </Column>
      <Column header="Fuel">
        <template #body="slotProps">
          <p v-if="slotProps.data.parsed.arms_remaining_time > 0">
            {{ slotProps.data.parsed.arms_remaining_time.toFixed(2) }}
          </p>
          <p v-else>EMPTY</p>
        </template>
      </Column>
      <Column header="Fuel">
        <template #body="slotProps">
          <p v-if="slotProps.data.parsed.tools_remaining_time > 0">
            {{ slotProps.data.parsed.tools_remaining_time.toFixed(2) }}
          </p>
          <p v-else>EMPTY</p>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { onMounted, ref } from "vue";
import { Connection, PublicKey } from "@solana/web3.js";
import { useGlobalStore } from "../../../stores/GlobalStore";
import { useStaratlasGmStore } from "../../../stores/StaratlasGmStore";
import {
  getAllFleetsForUserPublicKey,
  getScoreVarsShipInfo,
  ScoreVarsShipInfo,
} from "@staratlas/factory";
import { useWallet } from "solana-wallets-vue";
import { SCORE_FLEET_PROGRAM_ID } from "../../../static/constants/StarAtlasConstants";
import { ShipStakingInfo } from "@staratlas/factory/dist/score";

interface ScoreParsedShipInfo {
  food_remaining_time: number;
  fuel_remaining_time: number;
  arms_remaining_time: number;
  tools_remaining_time: number;
}

interface TableData {
  shipStatkingInfo: ShipStakingInfo;
  scoreVarsShipInfo: ScoreVarsShipInfo;
  parsed: ScoreParsedShipInfo;
}

const table_data = ref<TableData[]>();
const temp = ref();

onMounted(async () => {
  const ship_staking_infos = await getAllFleetsForUserPublicKey(
    new Connection(useGlobalStore().rpc.url),
    new PublicKey(useWallet().publicKey.value ?? ""),
    new PublicKey(SCORE_FLEET_PROGRAM_ID)
  );

  table_data.value = [];
  for (const ship of ship_staking_infos) {
    table_data.value?.push({
      shipStatkingInfo: ship,
      scoreVarsShipInfo: await getScoreVarsShipInfo(
        new Connection(useGlobalStore().rpc.url),
        new PublicKey(SCORE_FLEET_PROGRAM_ID),
        new PublicKey(ship.shipMint.toString())
      ),
      parsed: {
        food_remaining_time:
          ship.foodCurrentCapacity.toNumber() - get_time_last_action(ship),
        arms_remaining_time:
          ship.armsCurrentCapacity.toNumber() - get_time_last_action(ship),
        fuel_remaining_time:
          ship.fuelCurrentCapacity.toNumber() - get_time_last_action(ship),
        tools_remaining_time:
          ship.healthCurrentCapacity.toNumber() - get_time_last_action(ship),
      },
    });
  }

  console.log(table_data);
});

function get_time_last_action(ship_staking_info: ShipStakingInfo): number {
  let capacity_max = ship_staking_info.currentCapacityTimestamp.toNumber();
  return Date.now() / 1000 - capacity_max;
}
</script>

<style scoped></style>
