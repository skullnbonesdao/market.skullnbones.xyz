<script setup lang="ts">
import {useUserWalletStore} from "../../stores/UserWalletStore";
import Avatar from "primevue/avatar";
import {calc_passed_time} from "../../static/formatting/calc_passed_time";
import Fieldset from "primevue/fieldset";
import CurrencyIcon from "../../components/icon-helper/CurrencyIcon.vue";
import {CURRENCIES, E_CURRENCIES} from "../../static/currencies";
import ToggleButton from "primevue/togglebutton";
import G_TradesVolumeElement from "../../components/graphql/G_TradesVolumeElement.vue";
import G_TradesTotalElement from "../../components/graphql/G_TradesTotalElement.vue";
import {computed} from "vue";


const accounts_total_usdc_value = computed(() => {
  return  useUserWalletStore().tokens
      .map(token => (token.market_price.usdc ?? 0) * token.account_info.data.parsed.info.tokenAmount.uiAmount )
      .reduce((a,b) => a+b, 0)
})


const accounts_total_atlas_value = computed(() => {
  return  useUserWalletStore().tokens
      .map(token => (token.market_price.atlas ?? 0) * token.account_info.data.parsed.info.tokenAmount.uiAmount )
      .reduce((a,b) => a+b, 0)
})


const score_total_usdc_value = computed(() => {
 return  useUserWalletStore().sa_score
     .map(ship => (ship.market_price.usdc ?? 0) *  ship.ship_staking_info.shipQuantityInEscrow.toNumber())
     .reduce((a,b) => a+b, 0)
})

const score_total_atlas_value = computed(() => {
  return  useUserWalletStore().sa_score
      .map(ship => (ship.market_price.atlas ?? 0) *  ship.ship_staking_info.shipQuantityInEscrow.toNumber())
      .reduce((a,b) => a+b, 0)
})

</script>

<template>

    <div class="flex flex-col space-y-2 m-2">
      <div v-if="useUserWalletStore().address" class="flex flex-col items-center space-y-1">
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

        <div class="text-xs" >
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
            <i-mdi-face-man-profile class="mr-2" />
            <span class="font-bold text-lg">Profile</span>
          </div>
        </template>

        <div class="grid grid-cols-2 mx-2">
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
            <i-mdi-wallet class="mr-2" />
            <span class="font-bold text-lg">Accounts</span>
          </div>
        </template>

        <div class="grid grid-cols-2 mx-2">
          <div>Total:</div>
          <div class="flex flex-row justify-end space-x-1">

            <p>{{ useUserWalletStore().tokens?.length }}</p>
            <p>&#8721</p>
          </div>
          <div>Value:</div>

          <div class="flex flex-row justify-end items-center space-x-1">
            <p>{{accounts_total_usdc_value.toFixed(2)}}</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            />
          </div>
          <div></div>
          <div class="flex flex-row justify-end items-center space-x-1">
            <p>{{accounts_total_atlas_value.toFixed(2)}}</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset v-if="useUserWalletStore().address && useUserWalletStore().toggle_items.show_score">
        <template #legend>
          <div class="flex items-center">
            <i-mdi-rocket class="mr-2" />
            <span class="font-bold text-lg">Score</span>
          </div>
        </template>

        <div class="grid grid-cols-2 mx-2">
          <div>Total:</div>
          <div class="flex flex-row justify-end space-x-1">

            <p>{{ useUserWalletStore().sa_score?.length }}</p>
            <p>&#8721</p>
          </div>
          <div>Value:</div>

          <div class="flex flex-row justify-end items-center space-x-1">
            <p>
              {{ score_total_usdc_value.toFixed(2)}}
            </p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            />
          </div>
          <div></div>
          <div class="flex flex-row justify-end items-center space-x-1">
            <p>{{score_total_atlas_value.toFixed(2)}}</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset v-if="useUserWalletStore().address && useUserWalletStore().toggle_items.show_history">
        <template #legend>
          <div class="flex items-center">
            <i-mdi-history class="mr-2" />
            <span class="font-bold text-lg">Trade</span>
          </div>
        </template>

        <div class="grid grid-cols-2">
          <div class="grid grid-cols-1">
            <div class="text-transparent">
              currenty
            </div>
            <div>Count:</div>
            <div>Volume:</div>
          </div>

          <div class="grid grid-cols-2 text-right 	">
            <div class="flex justify-end  -mr-1">
              <CurrencyIcon
                  class="w-6"
                  :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
              />
            </div>
            <div class="flex justify-end -mr-1 ">
              <CurrencyIcon
                  class="w-6"
                  :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
              />
            </div>
            <G_TradesTotalElement
                class=" "
                :currency_mint="
                CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
              "
                                   :wallet_address="useUserWalletStore().address?.toString()"/>

            <G_TradesTotalElement  :currency_mint="
                CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
              "
                                   :wallet_address="useUserWalletStore().address?.toString()"/>
            <G_TradesVolumeElement
                :currency_mint="
                CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint
              "
                :wallet_address="useUserWalletStore().address?.toString()"
            ></G_TradesVolumeElement>
            <G_TradesVolumeElement
                :currency_mint="
                CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint
              "
                :wallet_address="useUserWalletStore().address?.toString()"
            ></G_TradesVolumeElement>
          </div>
        </div>


      </Fieldset>

      <Fieldset>
        <template #legend>
          <div class="flex items-center">
            <i-mdi-cog class="mr-2" />
            <span class="font-bold text-lg">Options</span>
          </div>
        </template>

        <div class="grid grid-cols-1 gap-2">
            <ToggleButton
                v-model="useUserWalletStore().toggle_items.show_accounts"
                onLabel="Load Accounts"
                offLabel="No Accounts"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
            />

            <ToggleButton
                v-model="useUserWalletStore().toggle_items.show_score"
                onLabel="Load Score"
                offLabel="No Score"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
            />
            <ToggleButton
                v-model="useUserWalletStore().toggle_items.show_history"
                onLabel="Load Trades"
                offLabel="No Trades"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
            />
        </div>
      </Fieldset>
    </div>
</template>

<style scoped></style>
