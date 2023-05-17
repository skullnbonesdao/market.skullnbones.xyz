<script setup lang="ts">
import Button from "primevue/button";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useGlobalStore } from "../../../../stores/GlobalStore";
import {
  createBurnInstruction,
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useWallet } from "solana-wallets-vue";

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
});

function btn_make_unsecure() {
  is_unsecured.value = true;
  toast.add({
    severity: "warn",
    summary: "Burning - active",
    detail: "Click again to burn your NFT!",
    life: 3000,
  });
}
async function btn_action_burn(
  wallet_str: string,
  token_mint_str: string,
  amount: number
) {
  const connection = new Connection(useGlobalStore().rpc.url);
  let tx = new Transaction();

  const wallet = new PublicKey(wallet_str);
  const token_mint = new PublicKey(token_mint_str);

  const account_to_burn = getAssociatedTokenAddress(token_mint, wallet);

  const instuctions = new Transaction().add(
    createBurnInstruction(account_to_burn, token_mint, wallet, amount),
    createCloseAccountInstruction(account_to_burn, wallet, wallet)
  );

  const tx_signature = await useWallet().sendTransaction(
    instuctions,
    connection
  );

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
    :disabled="max_amount_token === 0"
    v-tooltip.bottom="'Burn NFT (unlock)'"
    v-if="!is_unsecured"
    class="p-button-secondary"
    @click="btn_make_unsecure"
    ><i class="pi pi-trash"></i
  ></Button>
  <Button
    v-else
    @click="
      btn_action_burn(
        useWallet().publicKey.value.toString(),
        mint_send_token,
        max_amount_token
      ).then(() => {
        is_unsecured = false;
      })
    "
    v-tooltip.bottom="'Burn NFT (unlocked)'"
    class="p-button-danger"
    ><i class="pi pi-exclamation-triangle"></i
  ></Button>
</template>

<style scoped></style>
