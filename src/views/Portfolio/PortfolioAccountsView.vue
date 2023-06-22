<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useUserWalletStore } from "../../stores/UserWalletStore";
import AccountsView from "./accounts/AccountsView.vue";
import IconRocket from "~icons/material-symbols/rocket-launch";
import IconToken from "~icons/material-symbols/generating-tokens";
import IconNft from "~icons/ri/nft-fill";
</script>

<template>
  <TabView class="p-card w-full flex flex-col">
    <TabPanel>
      <template #header>
        <span>StarAtlas</span>
        <IconRocket class="ml-2" />
      </template>
      <AccountsView :account="useUserWalletStore().sa_tokens" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span>Tokens</span>
        <IconToken class="ml-2" />
      </template>
      <AccountsView :account="useUserWalletStore().tokens" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span>NFTs</span>
        <IconNft class="ml-2" />
      </template>
      <AccountsView :account="useUserWalletStore().nfts" />
    </TabPanel>
  </TabView>
</template>
