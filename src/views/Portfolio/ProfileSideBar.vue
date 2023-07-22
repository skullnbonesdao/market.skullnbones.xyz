<script lang="ts" setup>
import {useUserWalletStore} from "../../stores/UserWalletStore";
import Avatar from "primevue/avatar";
import {computed} from "vue";
import Fieldset from "primevue/fieldset";
import MultiPriceTemplate from "../../components/elements/templates/MultiPriceTemplate.vue";
import CurrencyIcon from "../../components/icon-helper/CurrencyIcon.vue";
import {CURRENCIES, E_CURRENCIES} from "../../static/currencies";
import G_TradesTotalElement from "../../components/graphql/G_TradesTotalElement.vue";
import {useGlobalStore} from "../../stores/GlobalStore";
import G_TradesVolumeElement from "../../components/graphql/G_TradesVolumeElement.vue";
import {calc_passed_time} from "../../static/formatting/calc_passed_time";

const accounts_total_usdc_value = computed(() => {
  return (
      useUserWalletStore()
          .sa_tokens.map(
          (token) =>
              (token.market_price.usdc ?? 0) *
              token.account?.data.parsed.info.tokenAmount.uiAmount
      )
          .reduce((a, b) => a + b, 0) +
      useUserWalletStore()
          .tokens.map(
          (token) =>
              (token.market_price.usdc ?? 0) *
              token.account?.data.parsed.info.tokenAmount.uiAmount
      )
          .reduce((a, b) => a + b, 0) +
      useUserWalletStore()
          .nfts.map(
          (token) =>
              (token.market_price.usdc ?? 0) *
              token.account?.data.parsed.info.tokenAmount.uiAmount
      )
          .reduce((a, b) => a + b, 0)
  );
});

const accounts_total_atlas_value = computed(() => {
  return (
      useUserWalletStore()
          .sa_tokens.map(
          (token) =>
              (token.market_price.atlas ?? 0) *
              token.account?.data.parsed.info.tokenAmount.uiAmount
      )
          .reduce((a, b) => a + b, 0) +
      useUserWalletStore()
          .tokens.map(
          (token) =>
              (token.market_price.atlas ?? 0) *
              token.account?.data.parsed.info.tokenAmount.uiAmount
      )
          .reduce((a, b) => a + b, 0) +
      useUserWalletStore()
          .nfts.map(
          (token) =>
              (token.market_price.atlas ?? 0) *
              token.account?.data.parsed.info.tokenAmount.uiAmount
      )
          .reduce((a, b) => a + b, 0)
  );
});

const score_total_usdc_value = computed(() => {
  return useUserWalletStore()
      .sa_score.map(
          (ship) =>
              (ship.market_price.usdc ?? 0) *
              ship.ship_staking_info.shipQuantityInEscrow.toNumber()
      )
      .reduce((a, b) => a + b, 0);
});

const score_total_atlas_value = computed(() => {
  return useUserWalletStore()
      .sa_score.map(
          (ship) =>
              (ship.market_price.atlas ?? 0) *
              ship.ship_staking_info.shipQuantityInEscrow.toNumber()
      )
      .reduce((a, b) => a + b, 0);
});
</script>

<template>
  <div class="flex flex-col  gap-2 w-full px-3">
    <div class="flex w-full flex-col items-center space-y-1">
      <Avatar
          v-if="useUserWalletStore().sa_profile?.avatarId"
          :image="
          'https://storage.googleapis.com/star-atlas-assets/avatars/' +
          useUserWalletStore().sa_profile?.avatarId +
          '.jpg'
        "
          shape="circle"
          size="xlarge"
      />
      <Avatar
          v-else
          image="/webp/9bccaxs8YihGCRkPqcFMPkPbVBwNNjzHc4iHvsfQNs6x.webp"
          shape="circle"
          size="xlarge"
      />

      <div class="text-xs">
        {{
          useUserWalletStore().address?.toString().substring(0, 5) +
          "[...]" +
          useUserWalletStore()
              .address?.toString()
              .substring(
                  useUserWalletStore().address?.toString().length ?? 0,
                  (useUserWalletStore().address?.toString().length ?? 0) - 5
              )
        }}
      </div>
    </div>

    <Fieldset v-if="useUserWalletStore().address">
      <template #legend>
        <div class="flex items-center">
          <i-mdi-face-man-profile class="mr-2"/>
          <span class="font-bold text-lg">Overview</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-1">
        <div>Score+Wallet:</div>
        <MultiPriceTemplate :price_atlas="accounts_total_atlas_value + score_total_atlas_value"
                            :price_usdc="(accounts_total_usdc_value + score_total_usdc_value)"/>
      </div>
    </Fieldset>

    <Fieldset v-if="useUserWalletStore().address">
      <template #legend>
        <div class="flex items-center">
          <i-mdi-face-man-profile class="mr-2"/>
          <span class="font-bold text-lg">SA-Profile</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-1">
        <div>Faction:</div>
        <div class="text-right">
          {{
            useUserWalletStore().sa_profile?.faction === 0
                ? "MUD"
                : useUserWalletStore().sa_profile?.faction === 1
                    ? "ONI"
                    : "USTUR"
          }}
        </div>

        <div>Rank:</div>
        <div class="text-right">
          {{ useUserWalletStore().sa_profile?.rank }}
        </div>

        <div>FactionRank:</div>
        <div class="text-right">
          {{ useUserWalletStore().sa_profile?.factionRank }}
        </div>

        <div>Balance:
        </div>

        <div class="flex flex-row justify-end space-x-1">
          <p>{{ useUserWalletStore().sa_profile?.balance }} USDC</p>
        </div>

        <div>Account age:</div>
        <div class="text-right">
          <p class="whitespace-nowrap">
            {{
              calc_passed_time(
                  new Date(
                      useUserWalletStore().sa_profile?.registrationDate ?? 0
                  ).getTime() / 1000
              )
            }}
          </p>
        </div>
      </div>
    </Fieldset>

    <Fieldset v-if="useUserWalletStore().address && useUserWalletStore().toggle_items.show_accounts">
      <template #legend>
        <div class="flex items-center">
          <i-mdi-wallet class="mr-2"/>
          <span class="font-bold text-lg">Accounts</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-1">
        <div>Total:</div>
        <div

            class="flex flex-row gap-2 p-2  p-inputtext"
        >
          <div class="flex flex-col space-y-1 text-sm">
            <p>&#8721</p>
          </div>
          <div class="flex flex-col w-full text-right text-sm">
            <p>{{
                useUserWalletStore().sa_tokens?.length + useUserWalletStore().tokens?.length + useUserWalletStore().nfts?.length
              }}</p>
          </div>
        </div>
        <div>Value:</div>
        <MultiPriceTemplate :price_atlas="accounts_total_atlas_value" :price_usdc="accounts_total_usdc_value"/>
      </div>
    </Fieldset>

    <Fieldset v-if="useUserWalletStore().address && useUserWalletStore().toggle_items.show_score">
      <template #legend>
        <div class="flex items-center">
          <i-mdi-rocket class="mr-2"/>
          <span class="font-bold text-lg">Score</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-1">
        <div>Total:</div>
        <div

            class="flex flex-row gap-2 p-2  items-center p-inputtext"
        >
          <div class="flex flex-col space-y-1 items-center">
            <p>&#8721</p>
          </div>
          <div class="flex flex-col w-full text-right text-sm">
            <p>{{ useUserWalletStore().sa_score?.length }}</p>
          </div>
        </div>
        <div>Value:</div>
        <MultiPriceTemplate :price_atlas="score_total_atlas_value" :price_usdc="score_total_usdc_value"/>
      </div>
    </Fieldset>

    <Fieldset v-if="useUserWalletStore().address && useUserWalletStore().toggle_items.show_history">
      <template #legend>
        <div class="flex items-center">
          <i-mdi-history class="mr-2"/>
          <span class="font-bold text-lg">Trade</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-1">
        <p>Count:</p>
        <div
            class="flex flex-col gap-2 p-2   p-inputtext"
        >
          <div>
            <div class="flex flex-row w-full gap-2 items-center ">
              <div>
                <CurrencyIcon
                    :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
                    style="width: 20px"
                />
              </div>
              <div class="border h-1rem"></div>
              <G_TradesTotalElement
                  :currency_mint="
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
                  "
                  :wallet_address="useUserWalletStore().address?.toString()"
                  class="flex w-full  justify-end "/>
            </div>

            <div class="flex flex-row w-full gap-2 items-center ">
              <div>
                <CurrencyIcon
                    :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
                    style="width: 20px"
                />
              </div>
              <div class="border  h-1rem"></div>
              <G_TradesTotalElement :currency_mint="
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
                  "
                                    :wallet_address="useUserWalletStore().address?.toString()"
                                    class="flex w-full  justify-end "/>
            </div>
          </div>
        </div>
        <p>Volume:</p>
        <div
            :class="useGlobalStore().is_dark ? 'border-gray-900' : ''"
            class="flex flex-col gap-2 p-2   p-inputtext"
        >
          <div>
            <div class="flex flex-row w-full gap-2 items-center ">
              <div>
                <CurrencyIcon
                    :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
                    style="width: 20px"
                />
              </div>
              <div class="border h-1rem"></div>
              <G_TradesVolumeElement
                  :currency_mint="
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
                  "
                  :wallet_address="useUserWalletStore().address?.toString()"
                  class="flex w-full  justify-end "
              ></G_TradesVolumeElement>
            </div>
            <div class="flex flex-row w-full gap-2 items-center ">
              <div>
                <CurrencyIcon
                    :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
                    style="width: 20px"
                />
              </div>
              <div class="border h-1rem"></div>
              <G_TradesVolumeElement
                  :currency_mint="
                    CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
                  "
                  :wallet_address="useUserWalletStore().address?.toString()"
                  class="flex w-full  justify-end "
              ></G_TradesVolumeElement>
            </div>
          </div>

        </div>
      </div>
    </Fieldset>

  </div>
</template>

<style scoped></style>