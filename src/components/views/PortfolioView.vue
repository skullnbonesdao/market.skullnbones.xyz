<template>
  <div class="m-2 space-y-2">
    <div>
      <StatusStoreTemplate />
    </div>

    <div class="p-card p-2">
      <div class="p-fluid flex flex-row space-x-2">
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

        <div>
          <ToggleablesTemplate />
        </div>
      </div>
    </div>
    <div v-if="!has_valid_pubkey" class="p-card">
      <NoData text="Invalid PublicKey!" class="flex justify-center" />
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

      <div class="p-card">
        <NoData
          v-if="!useGlobalStore().wallet.tokenInfo.length"
          class="flex justify-center"
        />
        <OverviewChilds v-else />
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
        <Panel header="Score" toggleable>
          <div class="flex justify-around">
            <ScoreElement />
          </div>
        </Panel>
      </div>

      <div v-if="useGlobalStore().toggleables.load_history" class="p-card">
        <Panel header="Market-History" toggleable>
          <div class="flex flex-row justify-around">
            <NoData
              class="flex justify-center"
              v-if="!useGlobalStore().wallet.historySorted.length"
            />
            <WalletHistoryTable v-else />
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import ProgressBar from "primevue/progressbar";
import Panel from "primevue/panel";
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import { useGlobalStore } from "../../stores/GlobalStore";
import { useWallet } from "solana-wallets-vue";
import WalletTokensTable from "../elements/tables/WalletTokensTable.vue";
import NoData from "../elements/NoData.vue";
import WalletHistoryTable from "../elements/tables/WalletHistoryTable.vue";
import CurrencyIcon from "../icon-helper/CurrencyIcon.vue";
import OverviewChilds from "../elements/portfolio_elements/OverviewChilds.vue";
import { computed, ref, watch } from "vue";
import { PublicKey } from "@solana/web3.js";
import WalletNftsTable from "../elements/tables/WalletNftsTable.vue";
import ScoreElement from "../elements/score/ScoreElement.vue";
import StatusStoreTemplate from "../elements/templates/StatusStoreTemplate.vue";
import { useStaratlasGmStore } from "../../stores/StaratlasGmStore";
import ToggleablesTemplate from "../elements/templates/ToggleablesTemplate.vue";

const text_user_wallet_input = ref(
  useWallet().publicKey.value?.toString() ??
    "NPCxfjPxh6pvRJbGbWZjxfkqWfGBvKkqPbtiJar3mom"
);

const wallet = useWallet();

const has_valid_pubkey = computed(() => {
  try {
    return PublicKey.isOnCurve(new PublicKey(text_user_wallet_input.value));
  } catch (err) {
    return false;
  }
});

// if (wallet.publicKey && useGlobalStore().status.is_initalized) {
//   useGlobalStore().update_wallet(
//     useWallet().publicKey.value?.toString() ??
//       "NPCxfjPxh6pvRJbGbWZjxfkqWfGBvKkqPbtiJar3mom"
//   );
// }

// watch(
//   () => useWallet().publicKey.value,
//   () => {
//     if (useWallet().connected && useGlobalStore().status.is_initalized)
//       useGlobalStore().update_wallet(
//         useWallet().publicKey.value?.toString() ?? ""
//       );
//   }
// );

// async function action_startSearch() {
//   useGlobalStore().load_wallet_trades();
//   useGlobalStore().load_wallet_tokens();
//   useGlobalStore().load_wallet_nfts();
// }
</script>

<style scoped></style>
