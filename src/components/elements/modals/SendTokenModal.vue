<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { ref } from "vue";
import InputText from "primevue/inputtext";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useGlobalStore } from "../../../stores/GlobalStore";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useWallet } from "solana-wallets-vue";

const is_modal_visible = ref(false);
const input_destination_wallet = ref("");
const input_amount_to_send = ref(1);

const props = defineProps({
  mint_send_token: {
    type: String,
    default: "",
  },
});

function toggle_send_modal() {
  is_modal_visible.value = !is_modal_visible.value;
}

async function btn_action_send(
  fromWallet_str: string,
  toWallet_str: string,
  token_mint_str: string
) {
  const connection = new Connection(useGlobalStore().rpc.url);
  let tx = new Transaction();

  console.log(toWallet_str);
  const fromWallet = new PublicKey(fromWallet_str);
  const toWallet = new PublicKey(toWallet_str);
  const token_mint = new PublicKey(token_mint_str);

  const formTokenAccount = await getAssociatedTokenAddress(
    token_mint,
    fromWallet
  );

  const toTokenAccount = await getAssociatedTokenAddress(token_mint, toWallet);

  tx.add(
    createTransferInstruction(formTokenAccount, toTokenAccount, fromWallet, 1.0)
  );

  const tx_signature = await useWallet().sendTransaction(tx, connection);

  const is_confirmed = await connection.confirmTransaction(
    tx_signature,
    "processed"
  );

  if (is_confirmed) {
    console.log("Burned");
  } else {
    console.log("errror buring");
  }
}
</script>

<template>
  <Button
    @click="toggle_send_modal"
    v-tooltip.bottom="'Send NFT'"
    class="p-button-secondary"
    ><i class="pi pi-send"></i
  ></Button>
  <Dialog
    v-model:visible="is_modal_visible"
    modal
    header="Send Instruction Builder"
    :style="{ width: '50vw' }"
  >
    <div class="flex flex-col space-y-2">
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <i class="pi pi-money-bill"></i>
        </span>
        <InputText disabled placeholder="Token mint" :value="mint_send_token" />
      </div>
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <i class="pi pi-sign-out"></i>
        </span>
        <InputText
          disabled
          placeholder="Sender address"
          :value="useWallet().publicKey.value.toString()"
        />
      </div>
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <i class="pi pi-sign-in"></i>
        </span>
        <InputText
          placeholder="Receiver address"
          type="text"
          v-model="input_destination_wallet"
        />
      </div>
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <i class="pi pi-arrow-right-arrow-left"></i>
        </span>
        <InputText
          placeholder="Amount"
          type="number"
          v-model="input_amount_to_send"
        />
        <span class="p-inputgroup-addon">/6</span>
      </div>
      <div class="flex w-full justify-end">
        <Button
          type="button"
          label="Send"
          icon="pi pi-send"
          @click="
            btn_action_send(
              useWallet().publicKey.value.toString(),
              input_destination_wallet,
              mint_send_token
            )
          "
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
