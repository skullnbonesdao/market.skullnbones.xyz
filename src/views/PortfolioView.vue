<template>
  <div class="m-2 space-y-2">
    <div class="p-card p-2 flex flex-col md:flex-row w-full gap-2">
      <div class="p-fluid flex w-full gap-2">
        <InputText
          class="w-full"
          type="text"
          placeholder="Enter a wallet address"
          v-model="text_user_wallet_input"
        /><Button
          icon="pi pi-search"
          @click="useUserWalletStore().update(text_user_wallet_input)"
        />
      </div>
    </div>

    <div v-if="!has_valid_pubkey" class="p-card">
      <NoData text="Invalid PublicKey!" class="flex justify-center" />
    </div>

    <div v-if="!useUserWalletStore().address" class="p-card">
      <NoData text="No Wallet searched!" class="flex justify-center" />
    </div>
    <div v-else class="flex flex-col space-y-2">
      <div class="p-card flex flex-row p-2">
        <div class="flex flex-col justify-center">
          <p>Connected to:</p>
          <p class="text-xs">
            {{ useUserWalletStore().address }}
          </p>
        </div>
        <div class="flex w-full justify-end items-center space-x-2">
          <p>
            {{ useUserWalletStore().sol_balance.toFixed(3) }}
          </p>
          <CurrencyIcon
            style="width: 50px"
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
          />
        </div>
      </div>

      <!--      <OverviewChilds />-->

      <div class="p-card">
        <PlayerProfile v-if="useUserWalletStore().sa_profile" />
      </div>

      <div v-if="useUserWalletStore().tokens" class="p-card">
        <Panel header="Accounts" toggleable collapsed>
          <div class="flex justify-around">
            <NoData
              class="flex justify-center"
              v-if="!useUserWalletStore().tokens.length"
            />
            <PortfolioAccountsView v-else class="flex w-full" />
          </div>
        </Panel>
      </div>

      <div v-if="true" class="p-card">
        <Panel header="Score" toggleable>
          <div class="flex justify-around">
            <ScoreElement />
          </div>
        </Panel>
      </div>

      <div class="p-card">
        <Panel header="Market-History" toggleable>
          <div class="w-full">
            <PortfolioHistoryChart
              :user_wallet="useUserWalletStore().address?.toString() ?? ''"
            />
            <PortfolioHistoryTable
              :user_wallet="useUserWalletStore().address?.toString() ?? ''"
            />
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";
import { useWallet } from "solana-wallets-vue";
import NoData from "../components/elements/NoData.vue";
import CurrencyIcon from "../components/icon-helper/CurrencyIcon.vue";
import { computed, onMounted, ref, watch } from "vue";
import { PublicKey } from "@solana/web3.js";
import PlayerProfile from "../components/elements/portfolio_elements/PlayerProfile.vue";
import PortfolioAccountsView from "../components/elements/portfolio_elements/PortfolioAccountsView.vue";
import { useUserWalletStore } from "../stores/UserWalletStore";
import PortfolioHistoryChart from "../components/elements/portfolio_elements/PortfolioHistoryChart.vue";
import PortfolioHistoryTable from "../components/elements/portfolio_elements/PortfolioHistoryTable.vue";
import ScoreElement from "../components/elements/score/ScoreElement.vue";

const text_user_wallet_input = ref();

onMounted(() => {
  text_user_wallet_input.value = useWallet().publicKey.value?.toString() ?? "";
});

watch(
  () => useWallet().publicKey.value,
  () => {
    text_user_wallet_input.value =
      useWallet().publicKey.value?.toString() ?? "";
  }
);

const wallet = useWallet();

const has_valid_pubkey = computed(() => {
  try {
    return PublicKey.isOnCurve(new PublicKey(text_user_wallet_input.value));
  } catch (err) {
    return false;
  }
});
</script>

<style scoped></style>
