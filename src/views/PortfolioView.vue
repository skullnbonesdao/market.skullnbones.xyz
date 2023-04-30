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
          @click="
            useGlobalStore()
              .update_wallet(text_user_wallet_input)
              .then(() => {})
          "
        />
      </div>
      <div>
        <ToggleablesTemplate />
      </div>
    </div>

    <div v-if="!has_valid_pubkey" class="p-card">
      <NoData text="Invalid PublicKey!" class="flex justify-center" />
    </div>

    <div v-if="!useGlobalStore().wallet.address" class="p-card">
      <NoData text="No Wallet searched!" class="flex justify-center" />
    </div>
    <div v-else class="flex flex-col space-y-2">
      <div class="p-card flex flex-row p-2">
        <div class="flex flex-col justify-center">
          <p>Connected to:</p>
          <p class="text-xs">
            {{ useGlobalStore().wallet.address }}
          </p>
        </div>
        <div class="flex w-full justify-end items-center space-x-2">
          <p>
            {{ useGlobalStore().wallet.sol_balance.toFixed(3) }}
          </p>
          <CurrencyIcon
            style="width: 50px"
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
          />
        </div>
      </div>

      <OverviewChilds />

      <div class="p-card">
        <NoData
          v-if="!useGlobalStore().wallet.profile"
          class="flex justify-center"
        />
        <PlayerProfile v-else />
      </div>

      <div v-if="useGlobalStore().toggleables.load_tokens" class="p-card">
        <Panel header="Tokens" toggleable collapsed>
          <div class="flex justify-around">
            <NoData
              class="flex justify-center"
              v-if="!useGlobalStore().wallet.tokenInfo.length"
            />
            <WalletTokensTable v-else />
          </div>
        </Panel>
      </div>

      <div v-if="useGlobalStore().toggleables.load_nfts" class="p-card">
        <Panel header="NFTs" toggleable collapsed>
          <div class="flex justify-around">
            <NoData
              class="flex justify-center"
              v-if="!useGlobalStore().wallet.nfts.data?.length"
            />
            <WalletNftsTable v-else />
          </div>
        </Panel>
      </div>

      <div v-if="useGlobalStore().toggleables.load_score" class="p-card">
        <Panel header="Score" toggleable collapsed>
          <div class="flex justify-around">
            <ScoreElement />
          </div>
        </Panel>
      </div>

      <div v-if="useGlobalStore().toggleables.load_history" class="p-card">
        <Panel header="Market-History" toggleable>
          <div class="flex justify-around">
            <WalletHistoryElement />
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
import { useGlobalStore } from "../stores/GlobalStore";
import { useWallet } from "solana-wallets-vue";
import WalletTokensTable from "../components/elements/tables/WalletTokensTable.vue";
import NoData from "../components/elements/NoData.vue";
import WalletHistoryElement from "../components/elements/tables/WalletHistoryTable.vue";
import CurrencyIcon from "../components/icon-helper/CurrencyIcon.vue";
import OverviewChilds from "../components/elements/portfolio_elements/OverviewChilds.vue";
import { computed, ref } from "vue";
import { PublicKey } from "@solana/web3.js";
import WalletNftsTable from "../components/elements/tables/WalletNftsTable.vue";
import ScoreElement from "../components/elements/score/ScoreElement.vue";
import ToggleablesTemplate from "../components/elements/templates/ToggleablesTemplate.vue";
import PlayerProfile from "../components/elements/portfolio_elements/PlayerProfile.vue";

const text_user_wallet_input = ref(
  useWallet().publicKey.value?.toString() ?? ""
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
