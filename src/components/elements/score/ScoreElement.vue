<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useGlobalStore } from "../../../stores/GlobalStore";
import NoData from "../NoData.vue";
import { useUserWalletStore } from "../../../stores/UserWalletStore";
import { ref } from "vue";
import { ShipStakingInfo } from "@staratlas/factory/dist/score";
import { ScoreVarsShipInfo } from "@staratlas/factory";

const expandedRows = ref([]);

function getRemainArmsDetails(
  shipInfo: ScoreVarsShipInfo,
  fleet: ShipStakingInfo
): any {
  const secondsLeft =
    fleet.armsCurrentCapacity.toNumber() -
    (Date.now() / 1000 - fleet.currentCapacityTimestamp.toNumber());
  const unitsBurnRate = 1 / (shipInfo.millisecondsToBurnOneArms / 1000); // Per Second
  const unitsBurnt =
    unitsBurnRate * (Date.now() / 1000) * fleet.shipQuantityInEscrow.toNumber();
  const unitsLeft =
    unitsBurnRate * secondsLeft * fleet.shipQuantityInEscrow.toNumber();
  const unitsLeftPct =
    unitsLeft /
    (shipInfo.armsMaxReserve * fleet.shipQuantityInEscrow.toNumber());
  const maxSeconds =
    shipInfo.armsMaxReserve *
    fleet.shipQuantityInEscrow.toNumber() *
    (shipInfo.millisecondsToBurnOneArms /
      1000 /
      fleet.shipQuantityInEscrow.toNumber());
  // this is different than maxSeconds
  const totalSeconds = fleet.armsCurrentCapacity.toNumber();
  const maxUnits =
    shipInfo.armsMaxReserve * fleet.shipQuantityInEscrow.toNumber();

  return {
    unitsBurnt,
    unitsLeftPct,
    unitsLeft: unitsLeft,
    secondsLeft: Math.max(0, secondsLeft),
    totalSeconds,
    maxSeconds,
    maxUnits,
    burnRate: unitsBurnRate,
  };
}
</script>

<template>
  <div class="flex flex-col w-full">
    <DataTable
      scrollable
      v-model:expandedRows="expandedRows"
      v-if="useUserWalletStore().sa_score.length > 1"
      :value="useUserWalletStore().sa_score"
      tableStyle="min-width: 50rem"
    >
      <Column expander style="width: 5rem" />
      <Column field="shipMint" header="Name">
        <template #body="slotPros">
          <p>
            {{
              useGlobalStore().sa_api_data.find(
                (api) => api.mint === slotPros.data.mint
              )?.name
            }}
          </p>
        </template>
      </Column>
      <Column field="ship_staking_info" header="ship_staking_info"></Column>
      <Column field="score_vars_ship" header="score_vars_ship"></Column>
      <Column header="food_temp">
        <template #body="slotProps">
          {{ slotProps.data.parsed.food_temp }}
        </template>
      </Column>

      <Column header="fuel_temp">
        <template #body="slotProps">
          {{ slotProps.data.parsed.fuel_temp }}
        </template>
      </Column>
      <Column header="food_percentage">
        <template #body="slotProps">
          {{ slotProps.data.parsed.food_percentage }}
        </template>
      </Column>

      <Column header="fuel_percentage">
        <template #body="slotProps">
          {{ slotProps.data.parsed.fuel_percentage }}
        </template>
      </Column>

      <Column header="arms_data">
        <template #body="slotProps">
          {{
            getRemainArmsDetails(
              slotProps.data.score_vars_ship,
              slotProps.data.ship_staking_info
            )
          }}
        </template>
      </Column>

      <template #expansion="slotProps">
        <div>
          <json-viewer
            expand-depth="5"
            theme="my-awesome-json-theme"
            :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
            :value="slotProps.data"
          ></json-viewer>
        </div>
      </template>
    </DataTable>

    <NoData v-else class="flex justify-center" />
  </div>
</template>
