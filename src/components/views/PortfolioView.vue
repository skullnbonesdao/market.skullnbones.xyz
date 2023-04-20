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
    <div v-if="!has_valid_pubkey" class="p-card">
      <NoData class="flex justify-center" />
    </div>
    <div v-else class="flex flex-col space-y-2">
      <div class="p-card">
        <NoData
          v-if="!useGlobalStore().wallet.tokens.length"
          class="flex justify-center"
        />

        <OverviewChilds v-else />
      </div>

      <div class="p-card">
        <Panel header="Tokens" toggleable>
          <div class="flex justify-around">
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
  </div>
</template>

<script setup lang="ts">
import Fieldset from "primevue/fieldset";
import InputText from "primevue/inputtext";
import Skeleton from "primevue/skeleton";
import Panel from "primevue/panel";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useWallet } from "solana-wallets-vue";
import WalletTokensTable from "../elements/tables/WalletTokensTable.vue";
import NoData from "../elements/NoData.vue";
import WalletHistoryTable from "../elements/tables/WalletHistoryTable.vue";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import OverviewChilds from "../elements/portfolio_elements/OverviewChilds.vue";
import { computed, watch } from "vue";
import { PublicKey } from "@solana/web3.js";

const wallet = useWallet();

const has_valid_pubkey = computed(() => {
  try {
    return PublicKey.isOnCurve(new PublicKey(useGlobalStore().wallet.address));
  } catch (err) {
    return false;
  }
});

if (wallet.publicKey) {
  useGlobalStore().wallet.address = wallet.publicKey.value?.toString() ?? "";
}

action_startSearch();

watch(
  () => useWallet().publicKey.value,
  () => {
    useGlobalStore().wallet.address =
      useWallet().publicKey.value?.toString() ?? "";
    action_startSearch();
  }
);

async function action_startSearch() {
  await useGlobalStore().load_wallet_trades();
  await useGlobalStore().load_wallet_tokens();
}
</script>

<style scoped></style>
