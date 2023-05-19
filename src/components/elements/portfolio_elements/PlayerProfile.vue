<template>
  <div class="p-card">
    <Panel :header="'SA-Profile'" toggleable collapsed>
      <NoData
        v-if="!useUserWalletStore().sa_profile?._id"
        class="flex justify-center w-full"
      />

      <div v-else class="grid md:grid-cols-4 gap-2">
        <Fieldset legend="Faction" class="flex items-center">
          <p>{{ useUserWalletStore().sa_profile?.faction }}</p>
        </Fieldset>
        <Fieldset legend="Rank" class="flex items-center">
          <p>{{ useUserWalletStore().sa_profile?.rank }}</p>
        </Fieldset>
        <Fieldset legend="Faction Rank" class="flex items-center">
          <p>{{ useUserWalletStore().sa_profile?.factionRank }}</p>
        </Fieldset>
        <Fieldset legend="Value" class="flex items-center">
          <div class="flex flex-row space-x-2 items-center">
            <p>{{ useUserWalletStore().sa_profile?.balance }}</p>
            <CurrencyIcon
              style="width: 24px"
              :currency="
                CURRENCIES.find((c) =>
                  c.name.includes(
                    useUserWalletStore().sa_profile?.currencySymbol ?? ''
                  )
                )
              "
            />
          </div>
        </Fieldset>

        <Fieldset legend="Info" class="flex items-center">
          <div class="flex flex-col">
            <p>
              Created: {{ useUserWalletStore().sa_profile?.registrationDate }}
            </p>
            <p>Updated: {{ useUserWalletStore().sa_profile?.updatedAt }}</p>
          </div>
        </Fieldset>
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import Panel from "primevue/panel";
import Fieldset from "primevue/fieldset";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { CURRENCIES } from "../../../static/currencies";
import NoData from "../NoData.vue";
import { useUserWalletStore } from "../../../stores/UserWalletStore";
</script>

<style scoped></style>
