<template>
  <Panel
    :header="'Overview for: ' + useGlobalStore().wallet.address.toString()"
    toggleable
  >
    <div class="flex flex-row justify-around">
      <Fieldset legend="Tokens-Value" class="flex items-center">
        <div class="flex flex-row space-x-2 items-center">
          <CurrencyIcon
            style="height: 24px"
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
          />

          <p
            v-if="
              useGlobalStore()
                .wallet.tokens.flatMap((t) => t.usd_value)
                .reduce((sum, current) => sum + current, 0)
                .toFixed(2) > 0
            "
          >
            {{
              useGlobalStore()
                .wallet.tokens.flatMap((t) => t.usd_value)
                .reduce((sum, current) => sum + current, 0)
                .toFixed(2)
            }}
          </p>
          <Skeleton v-else width="5rem" class="mb-2"></Skeleton>
        </div>
      </Fieldset>

      <Fieldset legend="Staking-Value" class="flex items-center">
        <div class="flex flex-row space-x-2 items-center">
          <CurrencyIcon
            style="height: 24px"
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
          />

          <p v-if="0">
            {{ 0.0 }}
          </p>
          <Skeleton v-else width="5rem" class="mb-2"></Skeleton>
        </div>
      </Fieldset>

      <Fieldset legend="Trading-Volume" class="flex items-center">
        <div class="flex flex-col space-y-2">
          <div class="flex flex-row space-x-2 items-center">
            <CurrencyIcon
              style="height: 24px"
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            />

            <p v-if="useGlobalStore().get_wallet_volume_usdc">
              {{ useGlobalStore().get_wallet_volume_usdc.toFixed(2) }}
            </p>
            <Skeleton v-else width="5rem" class="mb-2"></Skeleton>
          </div>
          <div class="flex flex-row space-x-2 items-center">
            <CurrencyIcon
              style="height: 24px"
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />

            <p v-if="useGlobalStore().get_wallet_volume_atlas">
              {{ useGlobalStore().get_wallet_volume_atlas.toFixed(2) }}
            </p>
            <Skeleton v-else width="5rem" class="mb-2"></Skeleton>
          </div>
        </div>
      </Fieldset>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import { useGlobalStore } from "../../../stores/GlobalStore";
import Skeleton from "primevue/skeleton";
import Panel from "primevue/panel";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import Fieldset from "primevue/fieldset";
import { computed } from "vue";

const volume_usdc = computed(() => {
  useGlobalStore()
    .wallet.historyRaw.filter(
      (h) =>
        h.currency_mint ===
        CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
    )
    .flatMap((h) => h.price * h.asset_change)
    .reduce((sum, current) => sum + current, 0);
});

const volume_atlas = computed(() => {
  useGlobalStore()
    .wallet.historyRaw.filter(
      (h) =>
        h.currency_mint ===
        CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
    )
    .flatMap((h) => h.price * h.asset_change)
    .reduce((sum, current) => sum + current, 0);
});
</script>

<style scoped></style>
