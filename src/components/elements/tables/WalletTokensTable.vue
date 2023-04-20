<template>
  <div class="flex w-full">
    <DataTable
      resizableColumns
      columnResizeMode="expand"
      style="width: 100%"
      :value="useGlobalStore().wallet.tokenInfo"
    >
      <Column field="address" header="Mint"></Column>
      <Column field="amount" header="Amount" sortable>
        <template #body="slotProps">
          <div class="flex float-right">
            <p>
              {{ slotProps.data.amount.toFixed(2) }}
            </p>
          </div>
        </template>
      </Column>
      <Column field="price" header="Price" sortable>
        <template #body="slotProps">
          <Skeleton
            v-if="slotProps.data.usd_value === -1.0"
            height="2rem"
            class="mb-2"
          ></Skeleton>

          <div v-else class="flex float-right">
            <p>
              {{ slotProps.data.price.toFixed(2) }}
            </p>
          </div>
        </template>
      </Column>
      <Column field="usd_value" header="Value" sortable>
        <template #body="slotProps">
          <Skeleton
            v-if="slotProps.data.usd_value === -1.0"
            height="2rem"
            class="mb-2"
          ></Skeleton>

          <div v-else class="flex float-right">
            <p>
              {{ slotProps.data.usd_value.toFixed(2) }}
            </p>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "../../../stores/GlobalStore";
import Skeleton from "primevue/skeleton";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
</script>

<style scoped></style>
