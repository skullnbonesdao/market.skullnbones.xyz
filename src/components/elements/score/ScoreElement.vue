<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ProgressBar from "primevue/progressbar";
import { useGlobalStore } from "../../../stores/GlobalStore";
import NoData from "../NoData.vue";
import { useUserWalletStore } from "../../../stores/UserWalletStore";
import { ref, watchEffect } from "vue";
import ShipHarvestButton from "./ShipHarvestButton.vue";
import ShipRefillButton from "./ShipRefillButton.vue";
import Avatar from "primevue/avatar";
import MultiPriceTemplate from "../templates/MultiPriceTemplate.vue";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";

const expandedRows = ref([]);

const totals = ref({
  usdc: 0,
  atlas: 0,
});

watchEffect(() => {
  totals.value.usdc = useUserWalletStore()
    .sa_score?.flatMap(
      (a) =>
        a.ship_staking_info.shipQuantityInEscrow.toNumber() *
        (a.market_price?.usdc ?? 0)
    )
    ?.reduce((a: number, b: number) => a + b, 0);

  totals.value.atlas = useUserWalletStore()
    .sa_score?.flatMap(
      (a) =>
        a.ship_staking_info.shipQuantityInEscrow.toNumber() *
        (a.market_price?.atlas ?? 0)
    )
    ?.reduce((a: number, b: number) => a + b, 0);
});

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

      <Column header="Quantity">
        <template #body="slotProps">
          x{{
            slotProps.data.ship_staking_info.shipQuantityInEscrow.toNumber()
          }}
        </template>
      </Column>

      <Column field="market_price" header="Price">
        <template #body="slotProps">
          <MultiPriceTemplate
            :price_usdc="slotProps.data.market_price.usdc"
            :price_atlas="slotProps.data.market_price.atlas"
          />
        </template>
      </Column>

      <Column header="Value">
        <template #body="slotProps">
          <MultiPriceTemplate
            :price_usdc="
              slotProps.data.market_price.usdc *
              slotProps.data.ship_staking_info.shipQuantityInEscrow.toNumber()
            "
            :price_atlas="
              slotProps.data.market_price.atlas *
              slotProps.data.ship_staking_info.shipQuantityInEscrow.toNumber()
            "
          />
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

      <ColumnGroup type="footer">
        <Row>
          <Column footer="Totals:" :colspan="5" footerStyle="text-align:left" />
          <Column>
            <template #footer>
              <MultiPriceTemplate
                :price_usdc="totals.usdc"
                :price_atlas="totals.atlas"
              />
            </template>
          </Column>
        </Row>
      </ColumnGroup>
    </DataTable>

    <NoData v-else class="flex justify-center" />
  </div>
</template>
