<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useUserWalletStore } from "../../stores/UserWalletStore";
import AccountsView from "./accounts/AccountsView.vue";
</script>

<template>
  <TabView class="p-card w-full flex flex-col">
    <TabPanel>
      <template #header>
        <i class="pi pi-calendar mr-2"></i>
        <span>StarAtlas</span>
      </template>
      <AccountsView :account="useUserWalletStore().sa_tokens" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <span>Tokens</span>
        <i class="pi pi-user ml-2"></i>
      </template>
      <AccountsView :account="useUserWalletStore().tokens" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <i class="pi pi-search mr-2"></i>
        <span>NFTs</span>
        <i class="pi pi-cog ml-2"></i>
      </template>
      <AccountsView :account="useUserWalletStore().nfts" />
    </TabPanel>
  </TabView>
</template>
