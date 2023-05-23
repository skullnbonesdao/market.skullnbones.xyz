<script setup lang="ts">
import Button from "primevue/button";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

import {
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
} from "solana-spl-current";
import { useWallet } from "solana-wallets-vue";
import { useGlobalStore } from "../../../stores/GlobalStore";

const is_unsecured = ref(false);
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
  token_decimals: {
    type: Number,
    default: 0,
  },
});

async function btn_action_burn(
  wallet_str: string,
  token_mint_str: string,
  amount: number,
  decimal: number
) {
  const connection = new Connection(useGlobalStore().rpc.url);
  let tx = new Transaction();

  const wallet = new PublicKey(wallet_str);
  const token_mint = new PublicKey(token_mint_str);

  const account_to_burn = await getAssociatedTokenAddress(token_mint, wallet);

  tx.add(createCloseAccountInstruction(account_to_burn, wallet, wallet));

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
    disabled
    @click="
      btn_action_burn(
        useWallet().publicKey.value?.toString() ?? '',
        mint_send_token,
        max_amount_token,
        token_decimals
      ).then(() => {
        is_unsecured = false;
      })
    "
    v-tooltip.bottom="'Refill'"
    >Refill</Button
  >
</template>

<style scoped></style>
