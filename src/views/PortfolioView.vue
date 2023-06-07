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
          v-if="!useUserWalletStore().status.get()"
          icon="pi pi-search"
          @click="useUserWalletStore().update(text_user_wallet_input)"
        />
        <Button
          v-else
          disabled
          icon="pi pi-spinner"
          @click="useUserWalletStore().update(text_user_wallet_input)"
        >
          <i class="pi pi-spinner animate-spin"></i>
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-10 gap-1">
      <div class="p-card col-span-2">
        <ProfileSideBar />
      </div>
      <div class="w-full p-card col-span-8">
        <div v-if="!useUserWalletStore().address" class="p-card">
          <NoData text="No Wallet searched!" class="flex justify-center" />
        </div>
        <div v-else>
          <Panel
            header="Accounts"
            v-if="useUserWalletStore().toggle_items.show_accounts"
            toggleable
          >
            <div class="flex justify-around">
              <NoData
                class="flex justify-center"
                v-if="!useUserWalletStore().tokens.length"
              />
              <PortfolioAccountsView v-else class="flex w-full" />
            </div>
          </Panel>
          <Panel
            header="Score"
            v-if="useUserWalletStore().toggle_items.show_score"
            toggleable
          >
            <div class="flex justify-around">
              <ScoreElement />
            </div>
          </Panel>
          <Panel
            header="Trade"
            v-if="useUserWalletStore().toggle_items.show_history"
            toggleable
          >
            <PortfolioHistoryChart
              class="w-full"
              :user_wallet="useUserWalletStore().address?.toString() ?? ''"
            />
            <PortfolioHistoryTable
              :user_wallet="useUserWalletStore().address?.toString() ?? ''"
            />
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import { useWallet } from "solana-wallets-vue";
import NoData from "../components/elements/NoData.vue";
import { computed, onMounted, ref, watch } from "vue";
import { PublicKey } from "@solana/web3.js";
import PortfolioAccountsView from "../components/elements/portfolio_elements/PortfolioAccountsView.vue";
import { useUserWalletStore } from "../stores/UserWalletStore";
import PortfolioHistoryTable from "../components/elements/portfolio_elements/PortfolioHistoryTable.vue";
import ScoreElement from "../components/elements/score/ScoreElement.vue";
import ProfileSideBar from "./Portfolio/ProfileSideBar.vue";
import PortfolioHistoryChart from "../components/elements/portfolio_elements/PortfolioHistoryChart.vue";

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
