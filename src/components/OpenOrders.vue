<template>
  <Toast />
  <div>
    <DataTable
      resizableColumns
      columnResizeMode="fit"
      style="width: 100%"
      :value="open_orders"
    >
      <Column field="orderMint" header="Info">
        <template #body="slotProps">
          <div class="flex">
            <PairImage
              :currency="
                CURRENCIES.find((c) => c.mint === slotProps.data.currencyMint)
              "
              :asset_image_url="'webp/' + slotProps.data.orderMint + '.webp'"
            />
          </div>
        </template>
      </Column>
      <Column field="orderType" header="Type"></Column>

      <Column field="price" header="Price">
        <template #body="slotProps">
          <div class="flex flex-row space-x-2">
            <p>
              {{
                slotProps.data.price *
                Math.pow(10, -slotProps.data.currencyDecimals)
              }}
            </p>
            <CurrencyIcon
              style="height: 24px"
              :currency="
                CURRENCIES.find((c) => c.mint === slotProps.data.currencyMint)
              "
            />
          </div>
        </template>
      </Column>
      <Column field="orderOriginationQty" header="Quantity">
        <template #body="slotProps">
          <p>x{{ slotProps.data.orderOriginationQty }}</p>
        </template>
      </Column>
      <Column header="">
        <template #body="slotProps">
          <div class="flex flex-row space-x-2">
            <Button @click="show()" severity="warning">
              <i class="pi pi-pencil"></i
            ></Button>
            <Button @click="show()" severity="warning">
              <i class="pi pi-ban"></i
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import {
  getOpenOrdersForPlayer,
  GmClientService,
  Order,
  OrderAccountItem,
} from "@staratlas/factory";
import Toast from "primevue/toast";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useGlobalStore } from "../stores/GlobalStore";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import { GM_PROGRAM_ID } from "../static/constants/StarAtlasConstants";
import { onMounted, ref, watch } from "vue";
import CurrencyIcon from "./icon-helper/CurrencyIcon.vue";
import PairImage from "./elements/PairImage.vue";
import { CURRENCIES } from "../static/currencies";
import * as wasi from "wasi";
import { useToast } from "primevue/usetoast";

const open_orders = ref<Order[]>();
const toast = useToast();

watch(
  () => useWallet().publicKey.value,
  async () => {
    await fetch_orders();
  }
);

onMounted(async () => {
  await fetch_orders();
});

async function fetch_orders() {
  let gm_client = new GmClientService();

  open_orders.value = await gm_client.getOpenOrdersForPlayer(
    new Connection(useGlobalStore().rpc.url),
    useWallet().publicKey.value ?? new PublicKey(""),
    new PublicKey(GM_PROGRAM_ID)
  );
}
const show = () => {
  toast.add({
    severity: "warning",
    summary: "Not implemented",
    detail: "This function is not jet implemented!",
    life: 3000,
  });
};
</script>

<style scoped></style>
