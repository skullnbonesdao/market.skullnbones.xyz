<script setup lang="ts">
import { I_Token } from "../../../stores/UserWalletStore";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";
import { PropType, ref, watchEffect } from "vue";
import { E_EXPLORER, EXPLORER } from "../../../static/explorer";
import { useGlobalStore } from "../../../stores/GlobalStore";
import TabView from "primevue/tabview";
import ExplorerIcon from "../../../components/icon-helper/ExplorerIcon.vue";
import TabPanel from "primevue/tabpanel";
import Image from "primevue/image";
import BurnTokenButton from "../../../components/elements/solana_actions/buttons/BurnTokenButton.vue";
import MultiPriceTemplate from "../../../components/elements/templates/MultiPriceTemplate.vue";
import ToggleButton from "primevue/togglebutton";
import { format_address } from "../../../static/formatting/format_address";

const props = defineProps({
  account: {
    type: [] as PropType<Array<I_Token>>,
    default: [],
  },
});

const expandedRows = ref();
const hide_zero_quantity = ref(true);

const accounts_filtered = ref();

watchEffect(() => {
  if (hide_zero_quantity.value)
    accounts_filtered.value = props.account?.filter(
      (a) => a.account?.data?.parsed?.info?.tokenAmount?.uiAmount != 0
    );
  else accounts_filtered.value = props.account;
});
</script>

<template>
  <DataTable
    v-model:expandedRows="expandedRows"
    :value="accounts_filtered"
    sortField="metadata.name"
    :sortOrder="-1"
  >
    <template #header>
      <div class="flex">
        <div class="w-full"></div>
        <ToggleButton
          v-model="hide_zero_quantity"
          onLabel="hide 0"
          offLabel="show 0"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          class="w-9rem"
        />
      </div>
    </template>

    <Column expander style="width: 5rem" />
    <Column>
      <template #body="slotProps">
        <Avatar
          v-if="slotProps.data.metadata?.json?.image"
          :image="slotProps.data.metadata?.json?.image"
          shape="circle"
        ></Avatar>
        <Avatar
          v-else-if="slotProps.data.metadata?.image"
          :image="slotProps.data.metadata?.image"
          shape="circle"
        ></Avatar>
        <Avatar
          v-else
          :image="slotProps.data.metadata?.logoURI"
          shape="circle"
        ></Avatar>
      </template>
    </Column>
    <Column field="metadata.symbol" :sortable="true" header="Symbol"></Column>
    <Column field="metadata.name" :sortable="true" header="Name"></Column>

    <Column
      field="account.data.parsed.info.tokenAmount.uiAmount"
      header="Quantity"
      sortable
    >
      <template #body="slotProps">
        <div class="grid grid-cols-1 gap-1">
          <p>
            {{
              slotProps.data.account.data.parsed.info.tokenAmount.uiAmount.toFixed(
                2
              )
            }}
          </p>
        </div>
      </template>
    </Column>

    <Column header="Price">
      <template #body="slotProps">
        <MultiPriceTemplate
          :price_usdc="slotProps.data.market_price.usdc"
          :price_atlas="slotProps.data.market_price.atlas"
        />
      </template>
    </Column>

    <Column header="Value">
      <template #body="slotProps">
        <MultiPriceTemplate
          :price_usdc="
            slotProps.data.market_price.usdc *
            slotProps.data.account.data.parsed.info.tokenAmount.uiAmount
          "
          :price_atlas="
            slotProps.data.market_price.atlas *
            slotProps.data.account.data.parsed.info.tokenAmount.uiAmount
          "
        />
      </template>
    </Column>

    <template #expansion="slotProps">
      <div>
        <TabView class="p-card">
          <TabPanel header="Details">
            <div class="flex flex-row space-x-2">
              <Image
                v-if="slotProps.data.metadata?.json?.image"
                :src="slotProps.data.metadata?.json?.image"
                class="basis-1/5"
                alt="Image"
                width="150"
                preview
              />
              <Image
                v-else-if="slotProps.data.metadata?.image"
                :src="slotProps.data.metadata?.image"
                class="basis-1/5"
                alt="Image"
                width="150"
                preview
              />
              <Image
                v-else-if="slotProps.data.metadata?.image"
                :src="slotProps.data.metadata?.image"
                class="basis-1/5"
                alt="Image"
                width="150"
                preview
              />

              <div class="grid grid-cols-1">
                <div class="grid grid-cols-3 gap-2">
                  <p>Name:</p>
                  <p>{{ slotProps.data.metadata.name }}</p>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <p>Symbol:</p>
                  <p>{{ slotProps.data.metadata.symbol }}</p>
                </div>
                <div class="grid grid-cols-3 items-center gap-2">
                  <p>Mint:</p>
                  <p class="w-40 text-xs">
                    {{
                      format_address(
                        slotProps.data.metadata.mint ??
                          slotProps.data.metadata.address ??
                          ""
                      )
                    }}
                  </p>
                  <div class="flex flex-row space-x-1">
                    <ExplorerIcon
                      class="w-5"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                      "
                      :address="slotProps.data.token_mint"
                    />
                    <ExplorerIcon
                      class="w-5"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                      "
                      :address="slotProps.data.token_mint"
                    />
                    <ExplorerIcon
                      class="w-5"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.STARATLAS)
                      "
                      :address="slotProps.data.token_mint"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-3 items-center gap-2">
                  <p>Account:</p>
                  <p class="w-40 text-xs">
                    {{
                      format_address(slotProps.data.publicKey.toString() ?? "")
                    }}
                  </p>
                  <div class="flex flex-row space-x-1">
                    <ExplorerIcon
                      class="w-5"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLSCAN)
                      "
                      :address="slotProps.data.token_account"
                    />
                    <ExplorerIcon
                      class="w-5"
                      :explorer="
                        EXPLORER.find((e) => e.type === E_EXPLORER.SOLANAFM)
                      "
                      :address="slotProps.data.token_account"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <p>Quantity:</p>
                  <p>
                    {{
                      slotProps.data.account.data.parsed.info.tokenAmount
                        .uiAmountString
                    }}
                  </p>
                </div>
              </div>

              <div class="flex w-full justify-end items-center">
                <div class="flex-row space-x-2">
                  <BurnTokenButton
                    :mint_send_token="slotProps.data.metadata.mint"
                    :max_amount_token="
                      parseFloat(
                        slotProps.data.account.data.parsed.info.tokenAmount
                          .uiAmountString
                      )
                    "
                    :token_decimals="
                      slotProps.data.account.data.parsed.info.tokenAmount
                        .decimals
                    "
                  />

                  <CloseTokenAccountButton
                    :mint_send_token="slotProps.data.metadata.mint"
                    :max_amount_token="
                      parseFloat(
                        slotProps.data.account.data.parsed.info.tokenAmount
                          .uiAmountString
                      )
                    "
                  />

                  <SendTokenModal
                    :mint_send_token="slotProps.data.metadata.mint"
                    :max_amount_token="
                      parseFloat(
                        slotProps.data.account.data.parsed.info.tokenAmount
                          .uiAmountString
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Account">
            <json-viewer
              expand-depth="5"
              theme="my-awesome-json-theme"
              :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
              :value="slotProps.data.account"
            ></json-viewer>
          </TabPanel>
          <TabPanel header="Metadata">
            <json-viewer
              expand-depth="5"
              theme="my-awesome-json-theme"
              :class="useGlobalStore().is_dark ? 'bg-gray-300' : ''"
              :value="slotProps.data.metadata"
            ></json-viewer>
          </TabPanel>
        </TabView>
      </div>
    </template>
  </DataTable>
</template>

<style scoped></style>
