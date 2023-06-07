<script setup lang="ts">
import { CURRENCIES, E_CURRENCIES } from "../../static/currencies";
import { useUserWalletStore } from "../../stores/UserWalletStore";
import CurrencyIcon from "../../components/icon-helper/CurrencyIcon.vue";
import ToggleButton from "primevue/togglebutton";
</script>

<template>
  <div>
    <div class="flex flex-col space-y-2 my-2">
      <div class="flex flex-col items-center space-y-1">
        <CurrencyIcon
          class="w-32"
          :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.SOL)"
        ></CurrencyIcon>
        <div class="text-xs">
          {{
            useUserWalletStore().address?.toString().substring(0, 4) +
            "[...]" +
            useUserWalletStore()
              .address?.toString()
              .substring(
                useUserWalletStore().address?.toString().length,
                useUserWalletStore().address?.toString().length - 4
              )
          }}
        </div>
      </div>
      <div class="grid grid-cols-2 mx-2">
        <div>Faction:</div>
        <div class="text-right">
          {{ useUserWalletStore().sa_profile?.faction }}
        </div>

        <div>Rank:</div>
        <div class="text-right">
          {{ useUserWalletStore().sa_profile?.rank }}
        </div>

        <div>FactionRank:</div>
        <div class="text-right">
          {{ useUserWalletStore().sa_profile?.factionRank }}
        </div>

        <div>Balance:</div>
        <div class="text-right">
          {{ useUserWalletStore().sa_profile?.balance }}
        </div>
      </div>
      <div v-if="false" class="grid grid-cols-1 mx-2 space-y-1">
        <ToggleButton
          v-model="useUserWalletStore().toggle_items.show_accounts"
          onLabel="Accounts"
          offLabel="Accounts"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
        />
        <ToggleButton
          v-model="useUserWalletStore().toggle_items.show_score"
          onLabel="Accounts"
          offLabel="Accounts"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
        />
        <ToggleButton
          v-model="useUserWalletStore().toggle_items.show_history"
          onLabel="Accounts"
          offLabel="Accounts"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
