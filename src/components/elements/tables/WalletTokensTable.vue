<template>
  <div class="">
    <DataTable
      class="flex w-full"
      reorderable-columns
      columnResizeMode="expand"
      style="width: 100%"
      :value="useGlobalStore().wallet.tokens"
      tableStyle="min-width: 50rem"
    >
      <Column field="address" header="Mint"></Column>
      <Column field="amount" header="Amount">
        <template #body="slotProps">
          <div class="flex float-right">
            <p>
              {{ slotProps.data.amount.toFixed(2) }}
            </p>
          </div>
        </template>
      </Column>
      <Column field="usd_value" header="USD">
        <template #body="slotProps">
          <div class="flex float-right">
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
import Column from "primevue/column";
import DataTable from "primevue/datatable";
</script>

<style scoped></style>
