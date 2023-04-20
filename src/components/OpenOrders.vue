<template>
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
      <Column field="orderOriginationQty" header="Quantity"></Column>
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
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useGlobalStore } from "../stores/GlobalStore";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import { GM_PROGRAM_ID } from "../static/constants/StarAtlasConstants";
import { onMounted, ref } from "vue";
import CurrencyIcon from "./icon-helper/CurrencyIcon.vue";
import PairImage from "./elements/PairImage.vue";
import { CURRENCIES } from "../static/currencies";

const open_orders = ref<Order[]>();

onMounted(async () => {
  let gm_client = new GmClientService();

  open_orders.value = await gm_client.getOpenOrdersForPlayer(
    new Connection(useGlobalStore().rpc.url),
    useWallet().publicKey.value ?? new PublicKey(""),
    new PublicKey(GM_PROGRAM_ID)
  );

  console.log(open_orders.value);
});
</script>

<style scoped></style>
