<template>
  <div class="flex flex-col">
    <ProgressSpinner v-if="useStaratlasGmStore().status.is_loading" />
    <DataTable
      v-else-if="useStaratlasGmStore().score_table_data.length > 1"
      :value="useStaratlasGmStore().score_table_data"
      tableStyle="min-width: 50rem"
    >
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

    <NoData v-else class="flex justify-center" />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useGlobalStore } from "../../../stores/GlobalStore";
import { useStaratlasGmStore } from "../../../stores/StaratlasGmStore";
import NoData from "../NoData.vue";
</script>

<style scoped></style>
