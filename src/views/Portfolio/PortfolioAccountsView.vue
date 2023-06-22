<script lang="ts" setup>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useUserWalletStore } from "../../stores/UserWalletStore";
import AccountsView from "./accounts/AccountsView.vue";
</script>

<template>
  <TabView class="p-card w-full flex flex-col">
    <TabPanel>
      <template #header>
        <span>StarAtlas</span>
        <i-material-symbols-rocket-launch class="ml-2" />
      </template>
      <AccountsView :account="useUserWalletStore().sa_tokens" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span>Tokens</span>
        <i-material-symbols-generating-tokens class="ml-2" />
      </template>
      <AccountsView :account="useUserWalletStore().tokens" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span>NFTs</span>
        <i-ri-nft-fill />
      </template>
      <AccountsView :account="useUserWalletStore().nfts" />
    </TabPanel>
  </TabView>
</template>