<template>
  <div class="flex w-full">
    <DataTable
      resizableColumns
      columnResizeMode="expand"
      style="width: 100%"
      :value="useGlobalStore().wallet.tokenInfo"
    >
      <Column field="address" header="Mint">
        <template #body="slotProps">
          <p class="text-xs">{{ slotProps.data.address }}</p>
        </template>
      </Column>
      <Column field="" header="Name">
        <template #body="slotProps">
          <p class="text-xs">{{ slotProps.data.meta?.name }}</p>
        </template>
      </Column>

      <Column field="" header="Model">
        <template #body="slotProps">
          <p class="text-xs">{{ slotProps.data.meta?.model }}</p>
        </template>
      </Column>

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
      <Column field="explorer" header="Explorer" style="min-width: 200px">
        <template #body="slotProps">
          <div class="flex flex-row justify-center items-center space-x-2">
            <ExplorerIcon
              class="w-5"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
              :address="slotProps.data.address"
            />
            <ExplorerIcon
              class="w-5"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
              :address="slotProps.data.address"
            />
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
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import ExplorerIcon from "../icons_images/ExplorerIcon.vue";
</script>

<style scoped></style>
