<template>
  <div class="flex items-center">
    <Toast />
    <div
      v-if="!useWallet().publicKey.value"
      class="flex m-2 w-full justify-center"
    >
      <WalletMultiButton dark />
    </div>

    <ProgressSpinner v-else-if="is_loading" class="flex justify-center" />

    <DataTable
      v-else
      :value="open_orders"
      columnResizeMode="fit"
      resizableColumns
      style="width: 100%"
    >
      <Column field="orderMint" header="Info">
        <template #body="slotProps">
          <div class="flex">
            <PairImage
              :asset_image_url="'webp/' + slotProps.data.orderMint + '.webp'"
              :currency="
                CURRENCIES.find((c) => c.mint === slotProps.data.currencyMint)
              "
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
              :currency="
                CURRENCIES.find((c) => c.mint === slotProps.data.currencyMint)
              "
              style="height: 24px"
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
          <div class="flex w-full flex-row justify-end space-x-2">
            <Button
              v-tooltip.bottom="'Edit order'"
              class="p-button-info"
              @click="show()"
            >
              <i class="pi pi-pencil"></i
            ></Button>
            <Button
              v-tooltip.bottom="'Close order'"
              class="p-button-warning"
              @click="cancel_order(slotProps.data.id.toString()).then(() => {})"
            >
              <i class="pi pi-ban"></i
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import { GmClientService, Order } from "@staratlas/factory";
import Toast from "primevue/toast";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useGlobalStore } from "../../stores/GlobalStore";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet, WalletMultiButton } from "solana-wallets-vue";
import { GM_PROGRAM_ID } from "../../static/constants/StarAtlasConstants";
import { onMounted, ref, watch } from "vue";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import PairImage from "./PairImage.vue";
import { CURRENCIES } from "../../static/currencies";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";

const open_orders = ref<Order[]>();
const toast = useToast();

const is_loading = ref(true);

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
  if (useWallet().publicKey.value) {
    is_loading.value = true;
    let gm_client = new GmClientService();
    open_orders.value = await gm_client.getOpenOrdersForPlayer(
      new Connection(useGlobalStore().rpc.url),
      useWallet().publicKey.value ?? new PublicKey(""),
      new PublicKey(GM_PROGRAM_ID)
    );

    is_loading.value = false;
  }
}

async function cancel_order(order_address: string) {
  let connection = new Connection(useGlobalStore().rpc.url);
  let gmClient = new GmClientService();

  console.log(order_address);
  console.log(useWallet().publicKey.value);

  let tx = await gmClient.getCancelOrderTransaction(
    connection,
    new PublicKey(order_address),
    new PublicKey(useWallet().publicKey.value?.toString() ?? ""),
    new PublicKey(GM_PROGRAM_ID)
  );

  console.log(tx);

  let tx_signature: any;
  await useWallet()
    .sendTransaction(tx.transaction, connection, {
      signers: tx.signers,
    })
    .then((tx) => (tx_signature = tx))
    .catch((err) => {
      console.log(err);
    });
}

const show = () => {
  toast.add({
    severity: "warn",
    summary: "Not implemented",
    detail: "This function is not jet implemented!",
    life: 3000,
  });
};
</script>

<style scoped></style>