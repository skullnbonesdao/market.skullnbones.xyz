<script setup lang="ts">
import Button from "primevue/button";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useGlobalStore } from "../../../../stores/GlobalStore";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
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
async function btn_action_burn(nft_mint_to_burn: string) {
  const connection = new Connection(useGlobalStore().rpc.url);

  const associatedAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(nft_mint_to_burn),
    new PublicKey(useWallet().publicKey.value ?? "")
  );

  const burn_instruction = spl.Token.createBurnInstruction(
    TOKEN_PROGRAM_ID,
    new PublicKey(nft_mint_to_burn),
    associatedAddress,
    new PublicKey(useWallet().publicKey.value ?? ""),
    [],
    1
  );

  const close_account_instruction = spl.Token.createCloseAccountInstruction(
    TOKEN_PROGRAM_ID,
    associatedAddress,
    new PublicKey(useWallet().publicKey.value ?? ""),
    new PublicKey(useWallet().publicKey.value ?? ""),
    []
  );

  const instuctions = new Transaction().add(
    burn_instruction,
    close_account_instruction
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
      btn_action_burn(mint_send_token).then(() => {
        is_unsecured = false;
      })
    "
    v-tooltip.bottom="'Burn NFT (unlocked)'"
    class="p-button-danger"
    ><i class="pi pi-exclamation-triangle"></i
  ></Button>
</template>

<style scoped></style>
