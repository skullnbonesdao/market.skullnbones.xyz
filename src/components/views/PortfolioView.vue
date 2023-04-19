<template>
  <div class="m-2 space-y-2">
    <div class="p-card">
      <div class="p-card-body flex flex-row space-x-2">
        <InputText
          class="w-full bg-gray-700"
          type="text"
          v-model="useGlobalStore().selected_publicKey"
        /><Button
          icon="pi pi-search"
          @click="useGlobalStore().load_wallet_tokens()"
        />
      </div>
    </div>
    <div class="p-card">
      <Panel header="Overview" toggleable>
        <div class="flex flex-row justify-around">
          <div>NET</div>
          <div>Staked</div>
        </div>
      </Panel>
    </div>

    <div class="p-card">
      <Panel header="Tokens" toggleable>
        <div class="flex flex-row justify-around">
          <div>NET</div>
          <div>Staked</div>
        </div>
      </Panel>
    </div>

    <div class="p-card">
      <Panel header="History" toggleable>
        <div class="flex flex-row justify-around">
          <div>NET</div>
          <div>Staked</div>
        </div>
      </Panel>
    </div>

    <div class="grid grid-cols-3 gap-5">
      <TokenPriceElement
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        :price="0.0"
        :change24h="24"
        image-name="some"
      />
      <TokenPriceElement
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        :price="0.0"
        :change24h="24"
        image-name="some"
      />
      <TokenPriceElement
        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        :price="0.0"
        :change24h="24"
        image-name="some"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import TokenPriceElement from "../../components/elements/TokenPriceElement.vue";
import Panel from "primevue/panel";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import { useGlobalStore } from "../../stores/GlobalStore";
import {
  useWallet,
  WalletConnectButton,
  WalletMultiButton,
} from "solana-wallets-vue";
import {
  Api,
  Trade,
} from "../../static/swagger/skullnbones_api/skullnbones_api";
import { watch } from "vue";

const wallet = useWallet();

if (wallet.publicKey) {
  useGlobalStore().selected_publicKey = wallet.publicKey;
}
</script>

<style scoped></style>
