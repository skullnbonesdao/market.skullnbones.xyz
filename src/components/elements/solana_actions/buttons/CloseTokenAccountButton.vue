<script setup lang="ts">
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import CloseIcon from "../../../icons/CloseIcon.vue";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useGlobalStore } from "../../../../stores/GlobalStore";
import {
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useWallet } from "solana-wallets-vue";

const toast = useToast();

const props = defineProps({
  mint_send_token: {
    type: String,
    default: "",
  },
  max_amount_token: {
    type: Number,
    default: 0,
  },
});

async function btn_close_account(
  fromWallet_str: string,
  token_mint_str: string
) {
  const connection = new Connection(useGlobalStore().rpc.url);
  let tx = new Transaction();

  const fromWallet = new PublicKey(fromWallet_str);
  const token_mint = new PublicKey(token_mint_str);

  const account_to_close = await getAssociatedTokenAddress(
    token_mint,
    fromWallet
  );

  console.log(account_to_close);

  tx.add(
    createCloseAccountInstruction(account_to_close, fromWallet, fromWallet)
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
  <Toast />
  <Button
    @click="
      btn_close_account(useWallet().publicKey.value.toString(), mint_send_token)
    "
    :disabled="max_amount_token != 0"
    v-tooltip.bottom="'Close token account'"
    class="p-button-secondary"
  >
    <CloseIcon />
  </Button>
</template>

<style scoped></style>
