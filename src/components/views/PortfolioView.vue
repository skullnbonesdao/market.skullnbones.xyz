<template>
  <div class="m-2 space-y-2">
    <div class="p-card p-2">
      <div class="p-fluid flex flex-row space-x-2">
        <InputText
          class="w-full"
          type="text"
          v-model="useGlobalStore().wallet.address"
        /><Button icon="pi pi-search" @click="action_startSearch" />
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
          <NoData
            class="flex justify-center"
            v-if="!useGlobalStore().wallet.tokens.length"
          />
          <WalletTokensTable v-else />
        </div>
      </Panel>
    </div>

    <div class="p-card">
      <Panel header="History" toggleable>
        <div class="flex flex-row justify-around">
          <NoData
            class="flex justify-center"
            v-if="!useGlobalStore().wallet.historySorted.length"
          />
          <WalletHistoryTable v-else />
        </div>
      </Panel>
    </div>

    <!--    <div class="grid grid-cols-3 gap-5">-->
    <!--      <TokenPriceElement-->
    <!--        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"-->
    <!--        :price="0.0"-->
    <!--        :change24h="24"-->
    <!--        image-name="some"-->
    <!--      />-->
    <!--      <TokenPriceElement-->
    <!--        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"-->
    <!--        :price="0.0"-->
    <!--        :change24h="24"-->
    <!--        image-name="some"-->
    <!--      />-->
    <!--      <TokenPriceElement-->
    <!--        :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"-->
    <!--        :price="0.0"-->
    <!--        :change24h="24"-->
    <!--        image-name="some"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
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
import { ref, watch } from "vue";
import WalletTokensTable from "../elements/tables/WalletTokensTable.vue";
import NoData from "../elements/NoData.vue";
import WalletHistoryTable from "../elements/tables/WalletHistoryTable.vue";

const wallet = useWallet();

if (wallet.publicKey) {
  useGlobalStore().wallet.address = wallet.publicKey.value?.toString() ?? "";
}

async function action_startSearch() {
  await useGlobalStore().load_wallet_tokens();
  await useGlobalStore().load_wallet_trades();
}
</script>

<style scoped></style>
