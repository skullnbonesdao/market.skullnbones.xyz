<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import { ref } from "vue";
import InputText from "primevue/inputtext";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useGlobalStore } from "../../../../stores/GlobalStore";
import {
  Account,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "solana-spl-current";
import { useWallet } from "solana-wallets-vue";
import SendIcon from "../../../icons/SendIcon.vue";

const is_modal_visible = ref(false);
const input_destination_wallet = ref("");
const input_amount_to_send = ref<number>(1);

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

function toggle_send_modal() {
  is_modal_visible.value = !is_modal_visible.value;
}

async function btn_action_send(
  fromWallet_str: string,
  toWallet_str: string,
  token_mint_str: string,
  amount: number
) {
  const connection = new Connection(useGlobalStore().rpc.url);
  let tx = new Transaction();

  const fromWallet = new PublicKey(fromWallet_str);
  const toWallet = new PublicKey(toWallet_str);
  const token_mint = new PublicKey(token_mint_str);

  const formTokenAccount = await getAssociatedTokenAddress(
    token_mint,
    fromWallet
  );
  console.log("formTokenAccount" + formTokenAccount);

  const toTokenAccount = await getAssociatedTokenAddress(token_mint, toWallet);
  console.log("toTokenAccount" + toTokenAccount);

  let account: Account;
  try {
    account = await getAccount(
      connection,
      toTokenAccount,
      "finalized",
      TOKEN_PROGRAM_ID
    );
  } catch (error: unknown) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error instanceof TokenAccountNotFoundError ||
      error instanceof TokenInvalidAccountOwnerError
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      tx.add(
        createAssociatedTokenAccountInstruction(
          fromWallet,
          toTokenAccount,
          toWallet,
          token_mint
        )
      );
    } else {
      throw error;
    }
  }

  tx.add(
    createTransferInstruction(
      formTokenAccount,
      toTokenAccount,
      fromWallet,
      amount
    )
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
    :disabled="max_amount_token === 0"
    @click="toggle_send_modal"
    v-tooltip.bottom="'Send token'"
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
          :value="useWallet().publicKey.value?.toString() ?? ''"
        />
      </div>
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <i class="pi pi-sign-in"></i>
        </span>
        <InputText
          placeholder="Receiver address"
          v-model="input_destination_wallet"
        />
      </div>
      <div class="p-inputgroup flex-1">
        <span class="p-inputgroup-addon">
          <SendIcon />
        </span>
        <InputNumber
          :class="
            input_amount_to_send > max_amount_token ? 'p-invalid' : 'p-valid'
          "
          placeholder="Amount"
          v-model="input_amount_to_send"
        />
        <span
          @click="input_amount_to_send = max_amount_token"
          class="p-inputgroup-addon"
          >/{{ max_amount_token }}</span
        >
      </div>
      <div class="flex w-full justify-end">
        <Button
          type="button"
          label="Send"
          icon="pi pi-send"
          @click="
            btn_action_send(
              useWallet().publicKey.value?.toString() ?? '',
              input_destination_wallet,
              mint_send_token,
              input_amount_to_send
            )
          "
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
