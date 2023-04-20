<template>
  <div class="flex flex-col w-full">
    <DataTable
      resizableColumns
      columnResizeMode="expand"
      style="width: 100%"
      :value="useGlobalStore().wallet.nfts.data"
    >
      <Column field="uri" header="Image">
        <template #body="slotProps">
          <img :src="slotProps.data.json.image" alt="Image" width="125" />
        </template>
      </Column>

      <Column field="metadata.mintAddress" header="Mint"></Column>
      <Column field="metadata.symbol" header="Symbol"></Column>
    </DataTable>
    <ProgressSpinner v-if="useGlobalStore().wallet.nfts.is_loading" />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import { useGlobalStore } from "../../../stores/GlobalStore";
import Skeleton from "primevue/skeleton";
import Image from "primevue/image";

import Column from "primevue/column";
import DataTable from "primevue/datatable";

function resolveUrl(url_json: string): string {
  let img_url = "";
  fetch(url_json)
    .then((resp) => resp.json())
    .then((json) => {
      img_url = json.image;
      console.log(img_url);
    })
    .catch((err) => {
      img_url = "";
    });
  return img_url;
}
</script>

<style scoped></style>
