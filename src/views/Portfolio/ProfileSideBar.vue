<script setup lang="ts">
import {useUserWalletStore} from "../../stores/UserWalletStore";
import ToggleButton from "primevue/togglebutton";
import Avatar from "primevue/avatar";
import {calc_passed_time} from "../../static/formatting/calc_passed_time";
import Fieldset from "primevue/fieldset";
import CurrencyIcon from "../../components/icon-helper/CurrencyIcon.vue";
import {CURRENCIES, E_CURRENCIES} from "../../static/currencies";
</script>

<template>
  <div>
    <div class="flex flex-col space-y-2 m-2">
      <div class="flex flex-col items-center space-y-1">
        <Avatar
          :image="
            'https://storage.googleapis.com/star-atlas-assets/avatars/' +
            useUserWalletStore().sa_profile?.avatarId +
            '.jpg'
          "
          shape="circle"
          size="xlarge"
        />

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
      <Fieldset>
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
                    useUserWalletStore().sa_profile?.registrationDate
                  ).getTime() / 1000
                )
              }}
            </p>
          </div>
        </div>
      </Fieldset>

      <Fieldset>
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
            <p>-</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            />
          </div>
          <div></div>
          <div class="flex flex-row justify-end items-center space-x-1">
            <p>-</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />
          </div>
        </div>
      </Fieldset>


      <Fieldset>
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
            <p>-</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            />
          </div>
          <div></div>
          <div class="flex flex-row justify-end items-center space-x-1">
            <p>-</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />
          </div>
        </div>
      </Fieldset>


      <Fieldset>
        <template #legend>
          <div class="flex items-center">
            <i-mdi-history class="mr-2" />
            <span class="font-bold text-lg">Trade</span>
          </div>
        </template>

        <div class="grid grid-cols-2 mx-2">
          <div>Total:</div>
          <div class="flex flex-row justify-end space-x-1">

            <p>-</p>
            <p>&#8721</p>
          </div>
          <div>Value:</div>

          <div class="flex flex-row justify-end items-center space-x-1">
            <p>-</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)"
            />
          </div>
          <div></div>
          <div class="flex flex-row justify-end items-center space-x-1">
            <p>-</p>
            <CurrencyIcon
                style="height: 14px"
                :currency="CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)"
            />
          </div>
        </div>
      </Fieldset>

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
