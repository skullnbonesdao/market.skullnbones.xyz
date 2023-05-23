<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ProgressBar from "primevue/progressbar";
import { useGlobalStore } from "../../../stores/GlobalStore";
import NoData from "../NoData.vue";
import { useUserWalletStore } from "../../../stores/UserWalletStore";
import { ref } from "vue";
import ShipHarvestButton from "./ShipHarvestButton.vue";
import ShipRefillButton from "./ShipRefillButton.vue";
import Avatar from "primevue/avatar";

const expandedRows = ref([]);

function calc_formatted_percentage(
  n: number,
  d: number,
  decimals: number = 0
): number {
  return parseFloat(((n / d) * 100).toFixed(decimals));
}

function test() {}
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
      <Column>
        <template #body="slotProps">
          <Avatar
            size="large"
            shape="circle"
            :image="'/webp/' + slotProps.data.mint + '.webp'"
          ></Avatar>
        </template>
      </Column>

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
      <Column header="Amount">
        <template #body="slotProps">
          x{{
            slotProps.data.ship_staking_info.shipQuantityInEscrow.toNumber()
          }}
        </template>
      </Column>

      <Column header="FOOD">
        <template #body="slotProps">
          <ProgressBar
            class="flex w-full"
            :value="
              calc_formatted_percentage(
                slotProps.data.parsed.food.current,
                slotProps.data.parsed.food.total
              )
            "
          ></ProgressBar>
        </template>
      </Column>

      <Column header="FUEL">
        <template #body="slotProps">
          <ProgressBar
            class="flex w-full"
            :value="
              calc_formatted_percentage(
                slotProps.data.parsed.fuel.current,
                slotProps.data.parsed.fuel.total
              )
            "
          ></ProgressBar>
        </template>
      </Column>

      <Column header="AMMO">
        <template #body="slotProps">
          <ProgressBar
            class="flex w-full"
            :value="
              calc_formatted_percentage(
                slotProps.data.parsed.ammo.current,
                slotProps.data.parsed.ammo.total
              )
            "
          ></ProgressBar>
        </template>
      </Column>

      <Column header="TOOL">
        <template #body="slotProps">
          <ProgressBar
            class="flex w-full"
            :value="
              calc_formatted_percentage(
                slotProps.data.parsed.tool.current,
                slotProps.data.parsed.tool.total
              )
            "
          ></ProgressBar>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <div class="flex flex-row space-x-2">
            <ShipRefillButton />
            <ShipHarvestButton />
          </div>
        </template>
      </Column>

      <template #expansion="slotProps">
        <div>
          <TabView>
            <TabPanel header="ShipStakingInfo">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="
                  Object.fromEntries(
                    Object.keys(slotProps.data.ship_staking_info).map((k) => {
                      return [
                        k.toString(),
                        slotProps.data.ship_staking_info[k].toString(),
                      ];
                    })
                  )
                "
              ></json-viewer>
            </TabPanel>
            <TabPanel header="ScoreVarsShipInfo">
              <json-viewer
                expand-depth="5"
                theme="my-awesome-json-theme"
                :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
                :value="
                  Object.fromEntries(
                    Object.keys(slotProps.data.score_vars_ship).map((k) => {
                      return [
                        k.toString(),
                        slotProps.data.score_vars_ship[k].toString(),
                      ];
                    })
                  )
                "
              ></json-viewer>
            </TabPanel>
          </TabView>
        </div>
      </template>
    </DataTable>

    <NoData v-else class="flex justify-center" />
  </div>
</template>
