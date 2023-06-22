<template>
  <div class="m-2 space-y-2">
    <div class="p-card p-2 flex flex-col md:flex-row w-full gap-2">
      <div class="p-fluid flex w-full gap-2">
        <InputText
          v-model="text_user_wallet_input"
          class="w-full"
          placeholder="Enter a wallet address"
          type="text"
        />
        <Button
          :disabled="
            useUserWalletStore().status.get() ||
            !useGlobalStore().status.is_initialized
          "
          :icon="
            !useUserWalletStore().status.get() &&
            useGlobalStore().status.is_initialized
              ? 'pi pi-search'
              : 'pi pi-spinner'
          "
          @click="useUserWalletStore().update(text_user_wallet_input)"
        >
          <i
            v-if="
              !useUserWalletStore().status.get() &&
              useGlobalStore().status.is_initialized
            "
            class="pi pi-search"
          ></i>
          <i v-else class="pi pi-spinner animate-spin"></i>
        </Button>
      </div>
    </div>
    <div class="grid grid-cols-10 gap-1">
      <div v-if="useUserWalletStore().address" class="p-card col-span-2">
        <ProfileSideBar />
      </div>
      <div
        :class="useUserWalletStore().address ? 'col-span-8' : 'col-span-10'"
        class="w-full"
      >
        <div v-if="!useUserWalletStore().address" class="p-card">
          <NoData class="flex justify-center" text="No Wallet searched!" />
        </div>
        <div v-else class="flex flex-col space-y-2">
          <Panel
            v-if="useUserWalletStore().toggle_items.show_accounts"
            class="p-card"
            collapsed
            header="Accounts"
            toggleable
          >
            <template #header>
              <div class="flex flex-row w-full items-center pr-2 space-x-2">
                <p class="p-panel-title w-full">Accounts</p>

                <div class="flex flex-row space-x-1">
                  <p>{{ useUserWalletStore().sa_tokens.length }}</p>
                  <p>/</p>
                  <p>{{ useUserWalletStore().tokens.length }}</p>
                  <p>/</p>
                  <p>{{ useUserWalletStore().nfts.length }}</p>
                </div>
              </div>
            </template>
            <div class="flex justify-around">
              <PortfolioAccountsView class="flex w-full" />
            </div>
          </Panel>
          <Panel
            v-if="useUserWalletStore().toggle_items.show_score"
            class="p-card"
            collapsed
            header="Score"
            toggleable
          >
            <template #header>
              <div class="flex flex-row w-full items-center pr-2 space-x-2">
                <p class="p-panel-title w-full">Score</p>

                <div class="flex flex-row space-x-1">
                  <p>{{ useUserWalletStore().sa_score.length }}</p>
                </div>
              </div>
            </template>
            <div class="flex justify-around">
              <ScoreElement />
            </div>
          </Panel>
          <Panel
            v-if="useUserWalletStore().toggle_items.show_history"
            class="p-card"
            collapsed
            header="Galactic-Marketplace "
            toggleable
          >
            <PortfolioHistoryChart
              :user_wallet="useUserWalletStore().address?.toString() ?? ''"
              class="w-full"
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

<script lang="ts" setup>
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import { useWallet } from "solana-wallets-vue";
import NoData from "../components/elements/NoData.vue";
import { computed, onMounted, ref, watch } from "vue";
import { PublicKey } from "@solana/web3.js";
import PortfolioAccountsView from "./Portfolio/PortfolioAccountsView.vue";
import { useUserWalletStore } from "../stores/UserWalletStore";
import PortfolioHistoryTable from "../components/elements/portfolio_elements/PortfolioHistoryTable.vue";
import ScoreElement from "../components/elements/score/ScoreElement.vue";
import ProfileSideBar from "./Portfolio/ProfileSideBar.vue";
import PortfolioHistoryChart from "../components/elements/portfolio_elements/PortfolioHistoryChart.vue";
import { useGlobalStore } from "../stores/GlobalStore";

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