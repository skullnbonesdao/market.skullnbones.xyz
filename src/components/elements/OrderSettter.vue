<template>
  <div>
    <Toast />
    <BlockUI :blocked="is_disabled">
      <div class="mx-auto">
        <div class="flex flex-row space-x-2">
          <button
            class="w-full block font-medium leading-tight uppercase px-6 py-3 hoverable"
            v-bind:class="tab === 1 ? 'bg-green-500' : 'border-2'"
            @click="currentTab(1)"
          >
            Buy
          </button>

          <button
            class="w-full block font-medium leading-tight uppercase px-6 py-3 hoverable"
            v-bind:class="tab === 2 ? 'bg-red-500' : 'border-2'"
            @click="currentTab(2)"
          >
            Sell
          </button>
        </div>
        <div class="p-3 text-center">
          <div class="flex flex-col space-y-2">
            <div class="p-inputgroup flex-1">
              <span class="w-15 p-inputgroup-addon uppercase">Price</span>
              <InputNumber
                id="input_price"
                v-model="input.price"
                :class="input.price <= 0 ? ' p-invalid' : ''"
                :max-fraction-digits="8"
                :minFractionDigits="2"
                placeholder="0.0"
              />
              <div class="flex p-inputgroup-addon">
                <Avatar
                  :image="
                    '/webp/' +
                    useGlobalStore().symbol.mint_asset.toString() +
                    '.webp'
                  "
                  shape="circle"
                  size="normal"
                >
                  <CurrencyIcon
                    :currency="
                      CURRENCIES.find(
                        (c) =>
                          c.mint ===
                          useGlobalStore().symbol.mint_pair.toString()
                      )
                    "
                  />
                </Avatar>
              </div>
            </div>
            <div class="p-inputgroup flex-1">
              <span class="w-15 p-inputgroup-addon uppercase">Size</span>
              <InputNumber
                id="input_size"
                v-model="input.size"
                :class="input.size <= 0 ? ' p-invalid' : ''"
                placeholder="0.0"
              />
              <div class="p-inputgroup-addon">
                <Avatar
                  :image="
                    '/webp/' +
                    useGlobalStore().symbol.mint_asset.toString() +
                    '.webp'
                  "
                  shape="circle"
                  size="normal"
                ></Avatar>
              </div>
            </div>
          </div>
        </div>
        <button
          id="order-submit-btn"
          :class="tab === 1 ? 'bg-green-500' : 'bg-red-500'"
          class="nav-link w-full block font-medium leading-tight uppercase px-6 py-3 hoverable"
          @click.prevent="submitOrder().then(() => {})"
        >
          {{ tab === 1 ? "Buy" : "Sell" }}
        </button>
      </div>
    </BlockUI>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useWallet } from "solana-wallets-vue";
import { useGlobalStore } from "../../stores/GlobalStore";
import InputNumber from "primevue/inputnumber";
import BlockUI from "primevue/blockui";
import { useToast } from "primevue/usetoast";
import { Connection, PublicKey } from "@solana/web3.js";
import { GmClientService, OrderSide } from "@staratlas/factory";
import { GM_PROGRAM_ID } from "../../static/constants/StarAtlasConstants";
import { CURRENCIES } from "../../static/currencies";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import Avatar from "primevue/avatar";

const toast = useToast();

const is_disabled = ref(false);

const tab = ref(1);

const input = ref({
  price: 0.0,
  size: 0.0,
});

const currentTab = (tabNumber: number) => (tab.value = tabNumber);

const { publicKey, sendTransaction } = useWallet();
const globalStore = useGlobalStore();

onMounted(async () => {
  //await useGlobalStore().load_wallet_tokens();
});

async function submitOrder() {
  is_disabled.value = true;

  let connection = new Connection(import.meta.env.VITE_SNB_RPC_QUICKNODE); //useGlobalStore().connection as Connection; //new Connection(globalStore.rpc.url);

  let gmClient = new GmClientService();
  const price = await gmClient.getBnPriceForCurrency(
    connection,
    input.value.price,
    new PublicKey(useGlobalStore().symbol.mint_pair),
    new PublicKey(GM_PROGRAM_ID)
  );

  const tx = await gmClient.getInitializeOrderTransaction(
    connection,
    new PublicKey(useWallet().publicKey.value?.toString() ?? ""),
    new PublicKey(useGlobalStore().symbol.mint_asset),
    new PublicKey(useGlobalStore().symbol.mint_pair),
    input.value.size,
    price,
    new PublicKey(GM_PROGRAM_ID),
    tab.value === 1 ? OrderSide.Buy : OrderSide.Sell
  );

  let tx_signature: any;
  await useWallet()
    .sendTransaction(tx.transaction, connection, {
      signers: tx.signers,
    })
    .then((tx) => (tx_signature = tx))
    .catch((err) => {
      console.log(err);
      is_disabled.value = false;
    });

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection
    .confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: tx_signature,
      },
      "processed"
    )
    .then((result) => {
      result.value.err === null
        ? toast.add({
            severity: "info",
            summary: "Order created!",
            detail: tx_signature,
            life: 3000,
          })
        : toast.add({
            severity: "info",
            summary: "Order Error!",
            detail: result.value.err.toString(),
            life: 3000,
          });
    });

  is_disabled.value = false;

  // const { transaction, signers } =
  //   await useStaratlasGmStore().getInitializeOrderTransaction(
  //     useWallet().publicKey.value ?? new PublicKey(""),
  //     globalStore.symbol.mint_asset.toString(),
  //     globalStore.symbol.mint_pair.toString(),
  //     input.value.size.text_box_value,
  //     input.value.price.text_box_value,
  //     tab.value === 1 ? OrderSide.Buy : OrderSide.Buy
  //   );
  // const signature = await sendTransaction(transaction, connection, {
  //   signers: signers,
  // });
  // const latestBlockHash = await connection.getLatestBlockhash();
  // connection
  //   .confirmTransaction(
  //     {
  //       blockhash: latestBlockHash.blockhash,
  //       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //       signature: signature,
  //     },
  //     "processed"
  //   )
  //   .then((result) =>
  //     result.value.err === null
  //       ? console.log("Order created", { type: "success" })
  //       : console.log("Error creating order", { type: "danger" })
  //   );
}
</script>