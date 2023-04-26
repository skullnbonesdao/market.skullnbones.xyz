<template>
  <Toast />
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
            <Button
              disabled
              v-tooltip.bottom="'Send NFT'"
              class="p-button-secondary"
              ><i class="pi pi-send"></i
            ></Button>

            <Button
              disabled
              v-tooltip.bottom="'Send to dumpster!'"
              class="p-button-secondary"
              ><i class="pi pi-send pi-reply"></i
            ></Button>

            <Button
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
                  slotProps.data.metadata.mintAddress.toString()
                ).then(() => {
                  is_unsecured = false;
                })
              "
              v-tooltip.bottom="'Burn NFT (unlocked)'"
              class="p-button-danger"
              ><i class="pi pi-exclamation-triangle"></i
            ></Button>
          </div>
        </template>
      </Column>
      <Column header="Explorer">
        <template #body="slotProps">
          <div class="flex flex-row justify-center items-center space-x-2">
            <ExplorerIcon
              class="w-5"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)"
              :address="slotProps.data.metadata.mintAddress.toString()"
            />
            <ExplorerIcon
              class="w-5"
              :explorer="EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)"
              :address="slotProps.data.metadata.mintAddress.toString()"
            />
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
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { ref } from "vue";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "solana-wallets-vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import ExplorerIcon from "../icons_images/ExplorerIcon.vue";

const is_unsecured = ref(false);
const toast = useToast();

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

<style scoped></style>
