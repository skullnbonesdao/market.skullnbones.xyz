<template>
  <div class="p-card">
    <Panel :header="'SA-Profile'" toggleable>
      <NoData
        v-if="!useGlobalStore().wallet.profile._id"
        class="flex justify-center w-full"
      />

      <div v-else class="grid md:grid-cols-4 gap-2">
        <Fieldset legend="Faction" class="flex items-center">
          <p>{{ useGlobalStore().wallet.profile.faction }}</p>
        </Fieldset>
        <Fieldset legend="Rank" class="flex items-center">
          <p>{{ useGlobalStore().wallet.profile.rank }}</p>
        </Fieldset>
        <Fieldset legend="Faction Rank" class="flex items-center">
          <p>{{ useGlobalStore().wallet.profile.factionRank }}</p>
        </Fieldset>
        <Fieldset legend="Balance" class="flex items-center">
          <div class="flex flex-row space-x-2 items-center">
            <p>{{ useGlobalStore().wallet.profile.balance }}</p>
            <CurrencyIcon
              style="width: 24px"
              :currency="
                CURRENCIES.find((c) =>
                  c.name.includes(
                    useGlobalStore().wallet.profile.currencySymbol
                  )
                )
              "
            />
          </div>
        </Fieldset>

        <Fieldset legend="Info" class="flex items-center">
          <div class="flex flex-col">
            <p>
              Created: {{ useGlobalStore().wallet.profile.registrationDate }}
            </p>
            <p>Updated: {{ useGlobalStore().wallet.profile.updatedAt }}</p>
          </div>
        </Fieldset>
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import Panel from "primevue/panel";
import Fieldset from "primevue/fieldset";
import { useGlobalStore } from "../../../stores/GlobalStore";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import { CURRENCIES } from "../../../static/currencies";
import NoData from "../NoData.vue";
</script>

<style scoped></style>
