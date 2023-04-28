<template>
  <Panel :header="'Overview'" toggleable>
    <div class="grid md:grid-cols-3 gap-2">
      <Fieldset legend="Tokens-Value" class="flex items-center">
        <div class="flex flex-row space-x-2 items-center">
          <CurrencyIcon
            style="height: 24px"
            :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
          />

          <p
            v-if="
              useGlobalStore()
                .wallet.tokenInfo.flatMap((t) => t.usd_value)
                .reduce((sum, current) => sum + current, 0) > 0
            "
          >
            {{
              useGlobalStore()
                .wallet.tokenInfo.flatMap((t) => t.usd_value)
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

            <G_VolumeElement
              :currency_mint="
                CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC).mint
              "
              :wallet_address="useGlobalStore().wallet.address"
            ></G_VolumeElement>
          </div>
          <div class="flex flex-row space-x-2 items-center">
            <CurrencyIcon
              style="height: 24px"
              :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />
            <G_VolumeElement
              :currency_mint="
                CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS).mint
              "
              :wallet_address="useGlobalStore().wallet.address"
            ></G_VolumeElement>
          </div>
        </div>
      </Fieldset>
    </div>
  </Panel>
  {{ volume }}
</template>

<script setup lang="ts">
import { CURRENCIES, E_CURRENCIES } from "../../../static/currencies";
import { useGlobalStore } from "../../../stores/GlobalStore";
import Skeleton from "primevue/skeleton";
import Panel from "primevue/panel";
import CurrencyIcon from "../../icon-helper/CurrencyIcon.vue";
import Fieldset from "primevue/fieldset";
import { computed } from "vue";
import gql from "graphql-tag";
import G_VolumeElement from "../../graphql/G_VolumeElement.vue";

const volume = computed(() => {
  gql`
    query MyQuery {
      trades_aggregate(
        where: {
          currency_mint: {}
          _and: {
            currency_mint: {
              _eq: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx"
            }
          }
        }
      ) {
        aggregate {
          sum {
            total_cost
          }
        }
      }
    }
  `;
});

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
