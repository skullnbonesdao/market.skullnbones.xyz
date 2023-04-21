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

      <Column header="Actions">
        <template #body="slotProps"
          ><div class="flex flex-row space-x-2">
            <Button><i class="pi pi-send"></i></Button>

            <Button><i class="pi pi-send pi-reply"></i></Button>

            <Button v-if="!is_unsecured" @click="is_unsecured = true"
              ><i class="pi pi-trash"></i
            ></Button>
            <Button v-else @click="is_unsecured = false"
              ><i class="pi pi-exclamation-triangle"></i
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
    <ProgressSpinner v-if="useGlobalStore().wallet.nfts.is_loading" />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { useGlobalStore } from "../../../stores/GlobalStore";
import Skeleton from "primevue/skeleton";
import Image from "primevue/image";

import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { ref } from "vue";

const is_unsecured = ref(false);

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
